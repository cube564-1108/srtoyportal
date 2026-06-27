import re
import sys
from urllib.request import urlopen

url = "https://barhatflowers.ru/"
html = urlopen(url, timeout=20).read().decode("utf-8", errors="replace")

patterns = {
    "title": r"<title[^>]*>(.*?)</title>",
    "description": r"<meta[^>]*name=[\"']description[\"'][^>]*content=[\"']([^\"']*)[\"']",
    "keywords": r"<meta[^>]*name=[\"']keywords[\"'][^>]*content=[\"']([^\"']*)[\"']",
    "robots": r"<meta[^>]*name=[\"']robots[\"'][^>]*content=[\"']([^\"']*)[\"']",
    "canonical": r"<link[^>]*rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)[\"']",
    "lang": r"<html[^>]*lang=[\"']([^\"']+)[\"']"
}

result = {name: (re.search(pat, html, re.I | re.S).group(1).strip() if re.search(pat, html, re.I | re.S) else "") for name, pat in patterns.items()}
result["h1_count"] = len(re.findall(r"<h1[^>]*>", html, re.I))
result["h2_count"] = len(re.findall(r"<h2[^>]*>", html, re.I))
imgs = re.findall(r"<img[^>]*>", html, re.I)
result["img_count"] = len(imgs)
result["img_no_alt"] = sum(1 for tag in imgs if not re.search(r"\balt=[\"'][^\"']*[\"']", tag, re.I))
print("SEO CHECK OUTPUT")
for key, value in result.items():
    print(f"{key}: {value}")
