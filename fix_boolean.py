import re

files = [
    r'd:\xampp\htdocs\ayova\sections\main-product.liquid',
    r'd:\xampp\htdocs\ayova\sections\watch-and-shop.liquid',
    r'd:\xampp\htdocs\ayova\snippets\product-card.liquid'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    # In main-product
    text = text.replace(
        '{% if redirect_enabled == true and amazon_link != blank or redirect_enabled == true and flipkart_link != blank %}',
        '{%- assign redirect_str = redirect_enabled | downcase -%}\n          {% if redirect_str == "true" and amazon_link != blank or redirect_str == "true" and flipkart_link != blank %}'
    )
    
    # In watch-and-shop and product-card
    text = text.replace(
        '{% if redirect_enabled == true %}',
        '{%- assign redirect_str = redirect_enabled | downcase -%}\n                {% if redirect_str == "true" %}'
    )
    text = text.replace(
        '{%- assign redirect_str = redirect_enabled | downcase -%}\n                {% if redirect_str == "true" %}',
        '{%- assign redirect_str = redirect_enabled | downcase -%}\n    {% if redirect_str == "true" %}'
    )

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(text)

print('Updated toggles to accept string.')
