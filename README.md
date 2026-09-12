## Live Site

https://book-nook-waitlist.vercel.app/

# FreeBookery Waitlist

FreeBookery is an upcoming digital library platform designed to make books more accessible while helping authors and publishers share their work with new readers.

Readers will be able to discover and request books, while authors and publishers can contribute their work and connect with a wider audience.

This website allows readers, authors, publishers, educators, and librarians to join the waitlist and receive updates when the full platform launches.

## Invite preview

The `/invite/` page validates preview codes through `/api/invite` before
redirecting visitors to the current Free Book Nook application.

Configure these Vercel environment variables:

- `INVITE_CODE` (required): the private code accepted by the invite form.
- `FREEBOOKNOOK_URL` (optional): the preview destination. It defaults to the
  current `the-free-book-nook.liemilyrong.workers.dev` deployment.
