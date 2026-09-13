# Serves the extension root statically.
# NOTE: .wasm must be served as application/wasm; Python's default octet-stream makes
# instantiateStreaming fail.
import functools, http.server, os, socketserver
h = http.server.SimpleHTTPRequestHandler
h.extensions_map = {**h.extensions_map, ".wasm": "application/wasm", ".js": "text/javascript"}
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", 8777),
        functools.partial(h, directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))) as s:
    s.serve_forever()
