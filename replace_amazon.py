import re

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'<!-- Quantity and Buttons -->\s*<div class="purchase-actions-row">\s*<div class="quantity-selector-new">.*?</div>\s*<button type="submit" name="add" class="btn-add-cart-new" data-add-to-cart>\s*ADD TO CART\s*</button>\s*<button type="submit" class="btn-buy-now">\s*BUY NOW\s*</button>\s*</div>'

replacement = '''<!-- Quantity and Buttons -->
          {%- assign amazon_link = product.metafields.custom.amazon_link.value | default: product.metafields.custom.amazon_link -%}
          {% if amazon_link != blank %}
            <div class="purchase-actions-row">
              <a href="{{ amazon_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now" style="width: 100%; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                BUY ON AMAZON
              </a>
            </div>
          {% else %}
            <div class="purchase-actions-row">
              <div class="quantity-selector-new">
                <button type="button" class="qty-btn" onclick="let q=document.getElementById('pQty'); if(q.value>1)q.value--;">-</button>
                <input type="number" name="quantity" id="pQty" value="1" min="1" readonly>
                <button type="button" class="qty-btn" onclick="let q=document.getElementById('pQty'); q.value++;">+</button>
              </div>

              <button type="submit" name="add" class="btn-add-cart-new" data-add-to-cart>
                ADD TO CART
              </button>
              
              <button type="submit" class="btn-buy-now">
                BUY NOW
              </button>
            </div>
          {% endif %}'''

new_text, count = re.subn(target_pattern, replacement, text, flags=re.IGNORECASE | re.DOTALL)
if count > 0:
    with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f'Successfully replaced {count} occurrences.')
else:
    print('Pattern not found!')
