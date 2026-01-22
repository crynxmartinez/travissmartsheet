import json

data = json.load(open('projects_data.json'))

print('Row numbers range:')
rows = [p['row'] for p in data]
print(f'  Min row: {min(rows)}')
print(f'  Max row: {max(rows)}')
print(f'  Total: {len(rows)}')
print()

print('Last 15 projects (highest row numbers = latest):')
for p in sorted(data, key=lambda x: -x['row'])[:15]:
    name = p['name'][:40]
    cust = p['customer'][:20] if p['customer'] else '-'
    print(f"  Row {p['row']}: {name} | {cust}")

print()
print('Projects with dates:')
with_dates = [p for p in data if p.get('est_metal_date') or p.get('contractor_date')]
print(f'  With estimated metal date: {sum(1 for p in data if p.get("est_metal_date"))}')
print(f'  With contractor date: {sum(1 for p in data if p.get("contractor_date"))}')
