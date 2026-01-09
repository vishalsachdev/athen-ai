#!/usr/bin/env python3
"""Generate a summary report of scraped HIPAA tools."""

import json
import sys

with open('data/taaft-hipaa-tools.json') as f:
    data = json.load(f)

# Filter and sort
healthcare_categories = [
    'Medical documentation', 'Healthcare', 'Medical transcription',
    'SOAP notes', 'Therapy notes', 'Medical conversations',
    'Medical assistance', 'Medical coding', 'Medical notes',
    'Psychotherapy notes', 'Medical dictation', 'Medical advice',
    'Therapy documentation', 'Blood test interpretation',
    'Health insurance guidance', 'Healthcare RCM', 'Automated billing'
]

healthcare_tools = [t for t in data if t.get('category') in healthcare_categories]
other_tools = [t for t in data if t.get('category') not in healthcare_categories]

# Sort by views
healthcare_tools.sort(key=lambda x: int(x.get('views', 0) or 0), reverse=True)

print("=" * 80)
print("TAAFT HIPAA-COMPLIANT TOOLS SUMMARY")
print("=" * 80)
print(f"\nTotal tools scraped: {len(data)}")
print(f"Healthcare/Medical tools: {len(healthcare_tools)}")
print(f"Other HIPAA-compliant tools: {len(other_tools)}")

print("\n" + "=" * 80)
print("TOP 20 HEALTHCARE/MEDICAL TOOLS (by views)")
print("=" * 80)
print(f"\n{'#':<3} {'Tool':<35} {'Views':<8} {'Rating':<8} {'Category'}")
print("-" * 80)

for i, tool in enumerate(healthcare_tools[:20], 1):
    name = tool['name'][:33]
    views = str(tool.get('views', 'N/A'))
    rating = f"{tool.get('rating', 'N/A')}/5" if tool.get('rating') else 'N/A'
    category = tool.get('category', 'Unknown')[:25]
    print(f"{i:<3} {name:<35} {views:<8} {rating:<8} {category}")

print("\n" + "=" * 80)
print("CATEGORY BREAKDOWN (Healthcare/Medical)")
print("=" * 80)

cat_count = {}
for tool in healthcare_tools:
    cat = tool.get('category', 'Unknown')
    cat_count[cat] = cat_count.get(cat, 0) + 1

for cat, count in sorted(cat_count.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {count}")

print("\n" + "=" * 80)
print("SAMPLE HIGH-POTENTIAL TOOLS FOR ATHEN-AI")
print("=" * 80)

for tool in healthcare_tools[:5]:
    print(f"\n• {tool['name']}")
    print(f"  Category: {tool.get('category')}")
    print(f"  Views: {tool.get('views', 'N/A')} | Rating: {tool.get('rating', 'N/A')}/5 ({tool.get('review_count', 0)} reviews)")
    print(f"  URL: {tool['url']}")
