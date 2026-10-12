import re

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target = r'{% elsif amazon_link != blank %}\s*<a href=\"{{ amazon_link }}\"'
replacement = '''{% endif %}
              {% if amazon_link != blank %}
                <a href="{{ amazon_link }}"'''

new_text, count = re.subn(target, replacement, text)

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f'Replaced {count} instances in main-product.liquid.')
