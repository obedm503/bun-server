function flatten(ob: any) {
  const result = {} as any;

  for (const i in ob) {
    if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
      const temp = flatten(ob[i]);
      for (const j in temp) {
        // Store temp in result
        result[i + '.' + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
}

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/nslookup') {
      const domain = url.searchParams.get('domain');
      if (!domain) {
        return new Response('Bad Request', { status: 400 });
      }

      const spawned = Bun.spawn(['nslookup', domain]);
      const output = await new Response(spawned.stdout).text();
      return new Response(output);
    }

    console.log(
      flatten(
        JSON.parse(
          JSON.stringify({
            url: req.url,
            method: req.method,
            mode: req.mode,
            credentials: req.credentials,
            destination: req.destination,
            body: await req.text(),
            headers: req.headers,
          }),
        ),
      ),
    );
    return new Response('ok');
  },
});

console.log(`Listening on localhost: ${server.port}`);
