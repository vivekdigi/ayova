import re

with open('flipkart.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect paths that are NOT clipPaths
paths = re.findall(r'<path[^>]+>', content)
print('Paths not in defs/clipPath:')
for p in paths:
    if 'clipPath' not in p and ('fill=' in p or 'stroke=' in p):
        print(p[:150])
