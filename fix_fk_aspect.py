import re

with open('flipkart.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace width="1200" height="800" with viewBox aspect ratio
content = re.sub(r'width="1200"', 'width="123.5"', content)
content = re.sub(r'height="800"', 'height="37.5"', content)

with open('flipkart_fixed.svg', 'w', encoding='utf-8') as f:
    f.write(content)

print('Wrote flipkart_fixed.svg')
