"""
Simple HTTP Server for Development
Serves static files without Flask
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print(f"📁 Serving files from: {os.getcwd()}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
