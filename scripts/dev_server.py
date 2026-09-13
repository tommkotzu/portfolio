#!/usr/bin/env python3
"""Static file server for local dev that always tells the browser not to
cache anything, so edits to html/css/js show up on a normal reload instead
of needing a hard-refresh or a fresh tab."""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8420


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    http.server.test(HandlerClass=NoCacheHandler, port=PORT)
