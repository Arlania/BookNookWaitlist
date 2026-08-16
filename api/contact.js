const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");
      return json({ error: "The email service is not configured." }, 500);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request." }, 400);
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return json({ error: "Please complete every field." }, 400);
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      message.length > 1200 ||
      !EMAIL_PATTERN.test(email)
    ) {
      return json({ error: "Please check the information you entered." }, 400);
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ||
          "FreeBookery Website <info@freebookery.org>",
        to: [process.env.CONTACT_TO_EMAIL || "info@freebookery.org"],
        reply_to: email,
        subject: `FreeBookery website message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <h2>New FreeBookery contact message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Resend error:", await resendResponse.text());
      return json({ error: "The message could not be sent." }, 502);
    }

    return json({ success: true });
  },
};
