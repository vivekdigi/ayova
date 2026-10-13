import re

with open('flipkart.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find min and max x and y
# Look at the numbers in the path coordinates
coords = re.findall(r'[-+]?\d*\.\d+|\d+', content)
# We can test viewBox="0 0.8 18 3.8"
new_content = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0.8 18 3.8"', content)
new_content = re.sub(r'width="\d+"', 'width="80"', new_content)
new_content = re.sub(r'height="\d+"', 'height="18"', new_content)

with open('flipkart_tight.svg', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Wrote flipkart_tight.svg')
