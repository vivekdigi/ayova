import re

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'{%- assign ws_flipkart_link = ws_prod\.metafields.*?{% endif %}'

replacement = '''{% if ws_amazon_link != blank %}
                  <a href="{{ ws_amazon_link }}" target="_blank" rel="noopener noreferrer" class="ws-buy-btn">Buy Now</a>
                {% else %}
                  <a href="{{ block.settings.product.url }}" class="ws-buy-btn">Buy Now</a>
                {% endif %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f'Reverted {count} button blocks.')
