"""Shared helpers for fetching RSS/Atom feeds: download (with a curl fallback for machines whose
Python has no certificates) and tolerant tag extraction. Used by listen.py.
"""
import html
import os
import re
import shutil
import ssl
import subprocess
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"


def tag(block, name):
    m = re.search(r"<%s\b[^>]*>(.*?)</%s>" % (re.escape(name), re.escape(name)), block, re.S | re.I)
    if not m:
        return ""
    text = m.group(1).strip()
    cdata = re.match(r"^<!\[CDATA\[(.*)\]\]>$", text, re.S)
    return cdata.group(1) if cdata else text


def clean(text):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", html.unescape(text or "")))).strip()


def _ssl_context():
    # python.org builds on macOS ship without root certificates until "Install Certificates.command"
    # is run; fall back to certifi or the system bundle so HTTPS works out of the box.
    ctx = ssl.create_default_context()
    if ctx.cert_store_stats().get("x509_ca", 0) == 0:
        try:
            import certifi
            ctx.load_verify_locations(certifi.where())
        except Exception:
            if os.path.exists("/etc/ssl/cert.pem"):
                ctx.load_verify_locations("/etc/ssl/cert.pem")
    return ctx


_CTX = _ssl_context()


def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    try:
        with urllib.request.urlopen(req, timeout=12, context=_CTX) as r:
            return r.read(6_000_000)
    except Exception:
        # e.g. a network proxy with its own certificate: curl uses the system's trust settings
        if not shutil.which("curl"):
            raise
        out = subprocess.run(["curl", "-fsSL", "--max-time", "30", "-A", UA, url], capture_output=True, timeout=40)
        # a slow connection may time out mid-feed: complete items received so far are still usable
        if not out.stdout or (out.returncode != 0 and b"</item>" not in out.stdout and b"</entry>" not in out.stdout):
            raise RuntimeError(out.stderr.decode(errors="replace").strip()[:120] or "download failed")
        return out.stdout[:6_000_000]
