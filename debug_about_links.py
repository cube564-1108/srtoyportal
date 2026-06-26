from pathlib import Path
import re

patterns = [
    re.compile(r'href="#about"\s*>\s*О портале\s*</a>'),
    re.compile(r'href="#"\s*>\s*О портале\s*</a>'),
    re.compile(r'href="about\.html"\s*>\s*О портале\s*</a>'),
]
root = Path('.')
for path in sorted(root.glob('*.html')):
    text = path.read_text(encoding='utf-8')
    matches = [p.pattern for p in patterns if p.search(text)]
    if 'О портале' in text:
        print(path.name)
        print('  patterns matched:', matches)
        for i, line in enumerate(text.splitlines(), start=1):
            if 'О портале' in line and 'href' in line:
                print(f'  {i}: {repr(line)}')
