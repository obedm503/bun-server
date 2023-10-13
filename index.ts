const server = Bun.serve({
  async fetch(req) {
    console.log({
      url: req.url,
      method: req.method,
      mode: req.mode,
      headers: req.headers,
      credentials: req.credentials,
      destination: req.destination,
      body: await req.text(),
    });
    return new Response('ok');
  },
});

console.log(`Listening on localhost: ${server.port}`);
