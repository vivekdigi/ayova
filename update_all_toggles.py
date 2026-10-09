import re

# Update main-product.liquid
with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'{% if amazon_link != blank or flipkart_link != blank %}\s*<div class=\"purchase-actions-row\" style=\"flex-wrap: wrap; gap: 10px;\">.*?</div>\s*{% else %}'

replacement = '''{%- assign redirect_enabled = product.metafields.custom.enable_redirect.value -%}
          {% if redirect_enabled == true and (amazon_link != blank or flipkart_link != blank) %}
            <div class="purchase-actions-row" style="flex-wrap: wrap; gap: 10px;">
              {% if flipkart_link != blank %}
                <a href="{{ flipkart_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now flipkart-btn" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #FF9F00; color: #fff; margin-bottom: 10px; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: background 0.2s;">
                  BUY ON FLIPKART
                </a>
              {% elsif amazon_link != blank %}
                <a href="{{ amazon_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now amazon-btn" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #FFD814; color: #0F1111; margin-bottom: 10px; border: none; border-radius: 30px; font-weight: 600; font-size: 14px; padding: 10px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: background 0.2s;">
                  BUY ON AMAZON
                </a>
              {% endif %}
            </div>
          {% else %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)
if count > 0:
    with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f'Replaced {count} in main-product.')

# Update product-card.liquid
with open(r'd:\xampp\htdocs\ayova\snippets\product-card.liquid', 'r', encoding='utf-8') as f:
    text2 = f.read()

target_pattern2 = r'{% if card_amazon_link != blank %}\s*<a href=\"{{ card_amazon_link }}\".*?</a>\s*{% elsif product != blank %}'
replacement2 = '''{%- assign redirect_enabled = product.metafields.custom.enable_redirect.value -%}
    {%- assign card_flipkart_link = product.metafields.custom.flipkart_link.value | default: product.metafields.custom.flipkart_link -%}
    {% if redirect_enabled == true %}
      {% if card_flipkart_link != blank %}
        <a href="{{ card_flipkart_link }}" target="_blank" rel="noopener noreferrer" class="btn-add-cart" style="text-decoration:none; display:flex; align-items:center; justify-content:center; text-align:center; box-sizing:border-box;">
          Add to Cart
        </a>
      {% elsif card_amazon_link != blank %}
        <a href="{{ card_amazon_link }}" target="_blank" rel="noopener noreferrer" class="btn-add-cart" style="text-decoration:none; display:flex; align-items:center; justify-content:center; text-align:center; box-sizing:border-box;">
          Add to Cart
        </a>
      {% elsif product != blank %}
        <form method="post" action="/cart/add" class="product-form" data-product-form onsubmit="event.preventDefault(); var btn = event.submitter || this.querySelector('button[type=submit]'); if(btn.dataset.added === 'true') { window.location.href='/cart'; return; } btn.innerHTML = 'Adding...'; btn.disabled = true; fetch('/cart/add.js', { method: 'POST', body: new FormData(this) }).then(res=>res.json()).then(data=>{ btn.innerHTML = 'View Cart'; btn.disabled = false; btn.dataset.added = 'true'; }).catch(err => { btn.innerHTML = 'Error'; btn.disabled = false; });">
          <input type="hidden" name="id" value="{{ product.variants.first.id }}">
          <input type="hidden" name="quantity" value="1">
          <button type="submit" name="add" class="btn-add-cart" data-add-to-cart>
            Add to Cart
          </button>
        </form>
      {% endif %}
    {% elsif product != blank %}'''

new_text2, count2 = re.subn(target_pattern2, replacement2, text2, flags=re.IGNORECASE | re.DOTALL)
if count2 > 0:
    with open(r'd:\xampp\htdocs\ayova\snippets\product-card.liquid', 'w', encoding='utf-8') as f:
        f.write(new_text2)
    print(f'Replaced {count2} in product-card.')
