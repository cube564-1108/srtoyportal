from pathlib import Path
import re

patterns = [
    re.compile(r'href="#about"\s*>\s*О портале\s*</a>'),
    re.compile(r'href="#"\s*>\s*О портале\s*</a>'),
]
replacement = 'href="about.html">О портале</a>'

root = Path('.')
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    new = text
    for pattern in patterns:
        new = pattern.sub(replacement, new)
    if new != text:
        path.write_text(new, encoding='utf-8')
        print(f'Updated {path.name}')
