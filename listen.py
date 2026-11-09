"""Real listening: the newest episodes and videos from a fixed list of podcasts and YouTube
channels for learners of Hungarian, as JSON (served at /api/listen).

On the published site (GitHub Pages) there is no server: the publish workflow runs
`python3 listen.py <site>/listen.json` every few hours and the app reads that file instead.

Only titles and links are kept here. Audio streams from each podcast's own host, videos play in
YouTube's embedded player, and the browser reads transcripts straight from the podcast's host.
"""
import calendar
import concurrent.futures
import email.utils
import hashlib
import html
import json
import re
import sys
import time

from feedutil import clean as _clean, download as _download, tag as _tag

YT = "https://www.youtube.com/feeds/videos.xml?channel_id={}"

# id (see js/data/shows.js), kind, feed url, how many episodes to keep
SHOWS = [
    ("yt-dori", "video", YT.format("UCjCPJrMedhlxt9fCANaorVA"), 8),
    ("fluentbox", "audio", "https://feeds.redcircle.com/8cd372a2-ac34-48ad-9cf7-8e54214ea4c0", 6),
    ("simplified", "audio", "https://www.patreon.com/public-rss/15945805?show=2179410", 6),
    ("fiction", "audio", "https://www.spreaker.com/show/5818669/episodes/feed", 12),
    ("patrik", "audio", "https://media.rss.com/hungarianwithpatrik/feed.xml", 6),
    ("rackapod", "audio", "https://anchor.fm/s/114ea2df0/podcast/rss", 6),
    ("yt-sziszi", "video", YT.format("UCjZrfHwul22yOTl2G57eWPQ"), 6),
    ("yt-easy", "video", YT.format("UCA0lqVr47gnhS5_Bsghnbzg"), 6),
]

CACHE_SECONDS = 30 * 60
_cache = {"ts": 0, "data": None}


def _seconds(text):
    """itunes:duration comes as 1672, 17:40 or 00:08:13."""
    parts = [p for p in (text or "").strip().split(":") if p.isdigit()]
    total = 0
    for p in parts:
        total = total * 60 + int(p)
    return total


def _ms(text):
    try:
        return int(email.utils.parsedate_to_datetime(text).timestamp() * 1000)
    except (TypeError, ValueError):
        return 0


def _item_id(show, key):
    return hashlib.sha1(f"{show}:{key}".encode()).hexdigest()[:12]


def _attr(tag, name):
    m = re.search(r'\b%s="([^"]*)"' % name, tag)
    return html.unescape(m.group(1)) if m else ""


def _podcast(xml, show, keep):
    out = []
    for block in re.findall(r"<item\b.*?</item>", xml, re.S):
        enclosure = re.search(r"<enclosure\b[^>]*>", block)
        audio = _attr(enclosure.group(0), "url") if enclosure else ""
        if not audio.startswith("https://"):
            continue  # an http stream would be blocked on the https site
        vtt = ""
        for tag in re.findall(r"<podcast:transcript\b[^>]*>", block):
            if _attr(tag, "type") == "text/vtt":
                vtt = _attr(tag, "url")
        title, desc = _clean(_tag(block, "title")), _clean(_tag(block, "description"))
        out.append({
            "id": _item_id(show, _clean(_tag(block, "guid")) or audio),
            "show": show, "kind": "audio", "title": title, "date": _ms(_clean(_tag(block, "pubDate"))),
            "desc": desc[:280], "audio": audio, "dur": _seconds(_clean(_tag(block, "itunes:duration"))),
            "vtt": vtt, "link": _clean(_tag(block, "link")),
            "explicit": _clean(_tag(block, "itunes:explicit")).lower() in ("yes", "true"),
        })
    out.sort(key=lambda x: x["date"], reverse=True)
    if not any(x["vtt"] for x in out):
        return out[:keep]
    # with transcripts (the source of line-by-line practice) keep those
    return [x for x in out if x["vtt"]][:keep]


def _youtube(xml, show, keep):
    out = []
    for block in re.findall(r"<entry>.*?</entry>", xml, re.S):
        link = re.search(r'<link rel="alternate" href="([^"]+)"', block)
        vid = _tag(block, "yt:videoId")
        if not vid or not link or "/shorts/" in link.group(1):
            continue  # a 30-second Short is no use for listening practice
        title = _clean(_tag(block, "title"))
        date = _tag(block, "published")
        out.append({
            "id": _item_id(show, vid), "show": show, "kind": "video", "title": title,
            "date": calendar.timegm(time.strptime(date[:19], "%Y-%m-%dT%H:%M:%S")) * 1000 if date else 0,
            "desc": _clean(_tag(block, "media:description"))[:280], "yt": vid, "link": link.group(1),
        })
    return out[:keep]


def _fetch(src):
    show, kind, url, keep = src
    xml = _download(url).decode("utf-8", errors="replace")
    if "<item" not in xml and "<entry" not in xml:
        raise RuntimeError("no feed received (the site may be down)")
    return (_youtube if kind == "video" else _podcast)(xml, show, keep)


def get_listen(force=False):
    if not force and _cache["data"] and time.time() - _cache["ts"] < CACHE_SECONDS:
        return _cache["data"]
    items, report = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(_fetch, s): s for s in SHOWS}
        for fut, src in futures.items():
            try:
                got = fut.result(timeout=60)
                items.extend(got)
                report.append({"id": src[0], "ok": True, "count": len(got)})
            except Exception as e:  # one broken feed must not break the page
                report.append({"id": src[0], "ok": False, "error": str(e)[:120]})
    items.sort(key=lambda x: x["date"], reverse=True)
    data = json.dumps({"fetched": int(time.time() * 1000), "sources": report, "items": items}, ensure_ascii=False).encode("utf-8")
    if items:
        _cache.update(ts=time.time(), data=data)
    return data


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "listen.json"
    body = get_listen(force=True)
    with open(out, "wb") as f:
        f.write(body)
    d = json.loads(body)
    ok = sum(1 for s in d["sources"] if s.get("ok") and s.get("count"))
    print(f"{len(d['items'])} items from {ok}/{len(d['sources'])} shows → {out}")
    for s in d["sources"]:
        if not s.get("ok") or not s.get("count"):
            print(f"  {s['id']}: {s.get('error', 'nothing usable')}")
