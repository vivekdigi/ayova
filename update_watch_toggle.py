import re

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'{% if ws_amazon_link != blank %}\s*<a href=\"{{ ws_amazon_link }}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"ws-buy-btn\">Buy Now</a>\s*{% else %}\s*<a href=\"{{ block.settings.product.url }}\" class=\"ws-buy-btn\">Buy Now</a>\s*{% endif %}'

replacement = '''{%- assign redirect_enabled = ws_prod.metafields.custom.enable_redirect.value -%}
                {% if redirect_enabled == true %}
                  {% if ws_flipkart_link != blank %}
                    <a href="{{ ws_flipkart_link }}" target="_blank" rel="noopener noreferrer" class="ws-buy-btn">Buy Now</a>
                  {% elsif ws_amazon_link != blank %}
                    <a href="{{ ws_amazon_link }}" target="_blank" rel="noopener noreferrer" class="ws-buy-btn">Buy Now</a>
                  {% else %}
                    <a href="{{ block.settings.product.url }}" class="ws-buy-btn">Buy Now</a>
                  {% endif %}
                {% else %}
                  <a href="{{ block.settings.product.url }}" class="ws-buy-btn">Buy Now</a>
                {% endif %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'w', encoding='utf-8') as f:
    f.write(new_text)
print(f'Replaced {count} in watch-and-shop.')
