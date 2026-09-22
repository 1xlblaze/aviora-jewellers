import http from 'http';

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 5174,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode || 200, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxy, { end: true });
});

server.on('upgrade', (req, socket, head) => {
  const proxySocket = http.request({
    hostname: '127.0.0.1',
    port: 5174,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxySocket.on('upgrade', (proxyRes, targetSocket, targetHead) => {
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
      Object.entries(proxyRes.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\r\n') +
      '\r\n\r\n'
    );
    targetSocket.pipe(socket);
    socket.pipe(targetSocket);
  });

  proxySocket.on('error', () => {
    socket.destroy();
  });

  proxySocket.end();
});

server.listen(5173, '0.0.0.0', () => {
  console.log('Port 5173 proxy forwarder active -> forwarding to 5174 (with WebSocket HMR support)');
});
