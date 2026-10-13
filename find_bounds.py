import re

with open('flipkart_wvl.svg', 'r', encoding='utf-8') as f:
    s = f.read()

# Find all path d attributes
paths = re.findall(r'd="([^"]+)"', s)
all_coords = []
for p in paths:
    nums = [float(x) for x in re.findall(r'[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?', p)]
    for i in range(0, len(nums) - 1, 2):
        all_coords.append((nums[i], nums[i+1]))

xs = [c[0] for c in all_coords]
ys = [c[1] for c in all_coords]
print(f'Actual elements: X min {min(xs)} max {max(xs)}, Y min {min(ys)} max {max(ys)}')
