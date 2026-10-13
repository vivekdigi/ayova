import re

with open('flipkart.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace viewBox with tight bounding box
content = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0.8 18.2 3.6"', content)
content = re.sub(r'width="\d+"', 'width="182"', content)
content = re.sub(r'height="\d+"', 'height="36"', content)

with open('flipkart_tight.svg', 'w', encoding='utf-8') as f:
    f.write(content)

print('Wrote flipkart_tight.svg with 0 0.8 18.2 3.6')
