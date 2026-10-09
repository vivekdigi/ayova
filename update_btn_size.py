import re

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'{% if amazon_link != blank %}\s*<a href=\"{{ amazon_link }}\".*?</a>\s*{% endif %}\s*{% if flipkart_link != blank %}\s*<a href=\"{{ flipkart_link }}\".*?</a>\s*{% endif %}'

replacement = '''{% if amazon_link != blank %}
                <a href="{{ amazon_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now amazon-btn" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #FFD814; color: #0F1111; margin-bottom: 10px; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: background 0.2s;">
                  BUY ON AMAZON
                </a>
              {% endif %}
              {% if flipkart_link != blank %}
                <a href="{{ flipkart_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now flipkart-btn" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #FF9F00; color: #fff; margin-bottom: 10px; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: background 0.2s;">
                  BUY ON FLIPKART
                </a>
              {% endif %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)
if count > 0:
    with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f'Successfully replaced {count} occurrences in main-product.liquid.')
else:
    print('Pattern not found!')
