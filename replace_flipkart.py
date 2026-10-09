import re

with open(r'd:\xampp\htdocs\ayova\sections\main-product.liquid', 'r', encoding='utf-8') as f:
    text = f.read()

target_pattern = r'<!-- Quantity and Buttons -->\s*{%- assign amazon_link.*?{% endif %}'

replacement = '''<!-- Quantity and Buttons -->
          {%- assign amazon_link = product.metafields.custom.amazon_link.value | default: product.metafields.custom.amazon_link -%}
          {%- assign flipkart_link = product.metafields.custom.flipkart_link.value | default: product.metafields.custom.flipkart_link -%}
          {% if amazon_link != blank or flipkart_link != blank %}
            <div class="purchase-actions-row" style="flex-wrap: wrap; gap: 10px;">
              {% if amazon_link != blank %}
                <a href="{{ amazon_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #FF9900; color: #fff; margin-bottom: 10px; border:none;">
                  BUY ON AMAZON
                </a>
              {% endif %}
              {% if flipkart_link != blank %}
                <a href="{{ flipkart_link }}" target="_blank" rel="noopener noreferrer" class="btn-buy-now" style="flex: 1; min-width: 45%; text-decoration: none; display: flex; align-items: center; justify-content: center; background-color: #2874F0; color: #fff; margin-bottom: 10px; border:none;">
                  BUY ON FLIPKART
                </a>
              {% endif %}
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
    print(f'Successfully replaced {count} occurrences in main-product.liquid.')
else:
    print('Pattern not found!')
