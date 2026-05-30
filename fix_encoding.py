path = r'C:\Users\sanya\Desktop\aashiyana-decor\index.html'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    # Multi-char sequences (must go first)
    ('600x600', '600&times;600'),
    ('600x1200', '600&times;1200'),
    ('60x60', '60&times;60'),
    ('60x120', '60&times;120'),
    # Unicode chars
    ('★', '&#9733;'),   # ★
    ('—', '&mdash;'),   # —
    ('–', '&ndash;'),   # –
    ('“', '&ldquo;'),   # "
    ('”', '&rdquo;'),   # "
    ('‘', '&lsquo;'),   # '
    ('’', '&rsquo;'),   # '
    ('·', '&middot;'),  # ·
    ('…', '&hellip;'),  # …
    ('×', '&times;'),   # ×
    ('─', '-'),         # ─ (box drawing in CSS comments - safe to replace)
]

for old, new in replacements:
    count = text.count(old)
    if count:
        print(f"Replaced {count}x U+{ord(old[0]) if len(old)==1 else 0:04X} '{old}' -> {new}")
    text = text.replace(old, new)

# Write without BOM, Unix line endings
with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print(f"\nDone. {len(text)} chars saved.")
