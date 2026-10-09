import re

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target = r'{% if redirect_enabled == true and \(amazon_link != blank or flipkart_link != blank\) %}'
replacement = '''{% if redirect_enabled == true %}
          {% if amazon_link != blank or flipkart_link != blank %}'''

new_text, count = re.subn(target, replacement, text, flags=re.IGNORECASE)

# We also need to add an extra {% endif %} because we split one if into two.
# Wait! Instead of nesting, I can just do:
# {% if redirect_enabled == true and amazon_link != blank or redirect_enabled == true and flipkart_link != blank %}
# But Liquid evaluates left-to-right without precedence.
# So  and b or c evaluates as (a and b) or c.
# So edirect_enabled == true and amazon_link != blank or redirect_enabled == true and flipkart_link != blank is safer.

target2 = r'{% if redirect_enabled == true and \(amazon_link != blank or flipkart_link != blank\) %}'
replacement2 = '{% if redirect_enabled == true and amazon_link != blank or redirect_enabled == true and flipkart_link != blank %}'

new_text, count = re.subn(target2, replacement2, text, flags=re.IGNORECASE)

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f'Fixed {count} instances in main-product.liquid.')
