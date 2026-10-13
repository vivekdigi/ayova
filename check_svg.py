with open('flipkart_repo.svg', 'r', encoding='utf-8') as f:
    s = f.read()
import re
print('SVG open tag:', s[:200])
