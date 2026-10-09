import re

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix syntax error
text = text.replace(
    "{%- if ws_amazon_link != blank and ws_amazon_link contains 'http://' == false and ws_amazon_link contains 'https://' == false -%}",
    "{%- if ws_amazon_link != blank -%}\n                  {%- unless ws_amazon_link contains 'http://' or ws_amazon_link contains 'https://' -%}"
)
text = text.replace(
    "                {%- endif -%}\n                <div class=\"ws-product-header\">",
    "                  {%- endunless -%}\n                {%- endif -%}\n                <div class=\"ws-product-header\">"
)

# Update Button logic
target_pattern = r'{% if ws_amazon_link != blank %}\s*<a href=\"{{ ws_amazon_link }}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"ws-buy-btn\">Buy Now</a>\s*{% else %}\s*<a href=\"{{ block\.settings\.product\.url }}\" class=\"ws-buy-btn\">Buy Now</a>\s*{% endif %}'

replacement = '''{%- assign ws_flipkart_link = ws_prod.metafields.custom.flipkart_link.value | default: ws_prod.metafields.custom.flipkart_link -%}
                {% if ws_amazon_link != blank or ws_flipkart_link != blank %}
                  <div style="display:flex; flex-direction:column; gap:5px; width:100%;">
                    {% if ws_amazon_link != blank %}
                      <a href="{{ ws_amazon_link }}" target="_blank" rel="noopener noreferrer" class="ws-buy-btn" style="background-color: #FFD814; color: #0F1111; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px;">Buy on Amazon</a>
                    {% endif %}
                    {% if ws_flipkart_link != blank %}
                      <a href="{{ ws_flipkart_link }}" target="_blank" rel="noopener noreferrer" class="ws-buy-btn" style="background-color: #FF9F00; color: #fff; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px;">Buy on Flipkart</a>
                    {% endif %}
                  </div>
                {% else %}
                  <a href="{{ block.settings.product.url }}" class="ws-buy-btn">Buy Now</a>
                {% endif %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)

with open(r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f'Replaced {count} button blocks.')
