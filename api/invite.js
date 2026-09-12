const DEFAULT_DESTINATION = "https://the-free-book-nook.liemilyrong.workers.dev";

const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    const expectedCode = process.env.INVITE_CODE;
    if (!expectedCode) {
      console.error("INVITE_CODE is not configured.");
      return json({ error: "Invitations are not configured yet." }, 503);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request." }, 400);
    }

    const submittedCode = String(body.code || "");
    if (!submittedCode || submittedCode.length > 200 || submittedCode !== expectedCode) {
      return json({ error: "That invite code is not valid." }, 401);
    }

    return json({
      redirectUrl: process.env.FREEBOOKNOOK_URL || DEFAULT_DESTINATION,
    });
  },
};
