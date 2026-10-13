import xml.etree.ElementTree as ET
import re

with open('flipkart_repo.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect paths
paths = re.findall(r'<path[^>]+d="([^"]+)"', content)

# Extract all (x, y) numbers from path commands
all_x = []
all_y = []
for p in paths:
    # Find all pairs of floats
    nums = [float(x) for x in re.findall(r'[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', p)]
    for i in range(0, len(nums) - 1, 2):
        all_x.append(nums[i])
        all_y.append(nums[i+1])

if all_x and all_y:
    min_x, max_x = min(all_x), max(all_x)
    min_y, max_y = min(all_y), max(all_y)
    print(f'X range: {min_x} to {max_x} (width: {max_x - min_x})')
    print(f'Y range: {min_y} to {max_y} (height: {max_y - min_y})')
    
    # Let's set viewBox with small padding
    pad_x = (max_x - min_x) * 0.04
    pad_y = (max_y - min_y) * 0.08
    vb = f'{min_x - pad_x:.2f} {min_y - pad_y:.2f} {max_x - min_x + 2*pad_x:.2f} {max_y - min_y + 2*pad_y:.2f}'
    print('Suggested viewBox:', vb)
    
    new_svg = re.sub(r'viewBox="[^"]+"', f'viewBox="{vb}"', content)
    new_svg = re.sub(r'width="[^"]+"', 'width="100%"', new_svg)
    new_svg = re.sub(r'height="[^"]+"', 'height="100%"', new_svg)
    with open('flipkart_cropped.svg', 'w', encoding='utf-8') as f_out:
        f_out.write(new_svg)
    print('Wrote flipkart_cropped.svg')
