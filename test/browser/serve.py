# Serves the extension root statically.
# NOTE: .wasm must be served as application/wasm; Python's default octet-stream makes
# instantiateStreaming fail.
import functools, http.server, os, socketserver
class NoStore(http.server.SimpleHTTPRequestHandler):
    # NOTE: no caching. A persistent browser profile (seller-bots.mjs) otherwise keeps running an
    # old offscreen.js and engine after they are rebuilt.
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


h = NoStore
h.extensions_map = {**h.extensions_map, ".wasm": "application/wasm", ".js": "text/javascript"}
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", 8777),
        functools.partial(h, directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))) as s:
    s.serve_forever()
