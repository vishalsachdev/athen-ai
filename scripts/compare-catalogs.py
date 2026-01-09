#!/usr/bin/env python3
"""
Compare TAAFT scraped tools with Athen-ai catalog

Generates a report showing:
- Tools in TAAFT but not in Athen-ai (expansion opportunities)
- Tools in both (verification)
- Coverage statistics
"""

import argparse
import json
from typing import List, Dict, Set


def load_json(filepath: str) -> List[Dict]:
    """Load JSON file."""
    with open(filepath) as f:
        return json.load(f)


def normalize_name(name: str) -> str:
    """Normalize tool name for comparison."""
    return name.lower().strip().replace(' ', '').replace('-', '')


def compare_catalogs(taaft_tools: List[Dict], athen_tools: List[Dict]) -> Dict:
    """
    Compare TAAFT and Athen-ai catalogs.

    Returns:
        Dict with comparison results
    """
    # Normalize names for fuzzy matching
    taaft_names = {normalize_name(t['name']): t for t in taaft_tools}
    athen_names = {normalize_name(t['name']): t for t in athen_tools}

    # Find overlaps and gaps
    only_in_taaft = {k: v for k, v in taaft_names.items() if k not in athen_names}
    only_in_athen = {k: v for k, v in athen_names.items() if k not in taaft_names}
    in_both = {k: (taaft_names[k], athen_names[k]) for k in taaft_names if k in athen_names}

    return {
        'only_in_taaft': list(only_in_taaft.values()),
        'only_in_athen': list(only_in_athen.values()),
        'in_both': list(in_both.values()),
        'stats': {
            'total_taaft': len(taaft_tools),
            'total_athen': len(athen_tools),
            'overlap': len(in_both),
            'coverage_pct': round(len(in_both) / len(taaft_tools) * 100, 1) if taaft_tools else 0
        }
    }


def generate_markdown_report(comparison: Dict, output_path: str):
    """Generate a markdown report from comparison results."""

    report_lines = [
        "# TAAFT vs Athen-ai Catalog Comparison Report",
        "",
        f"Generated: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## Summary",
        "",
        f"- **TAAFT HIPAA tools**: {comparison['stats']['total_taaft']}",
        f"- **Athen-ai catalog**: {comparison['stats']['total_athen']}",
        f"- **Tools in both**: {comparison['stats']['overlap']}",
        f"- **Coverage**: {comparison['stats']['coverage_pct']}%",
        "",
        "## Tools in TAAFT but NOT in Athen-ai",
        "",
        f"**{len(comparison['only_in_taaft'])} expansion opportunities**",
        ""
    ]

    # Sort by views (if available)
    only_taaft = sorted(
        comparison['only_in_taaft'],
        key=lambda t: t.get('views', 0) or 0,
        reverse=True
    )

    report_lines.append("| Tool | Description | Category | Rating | Views |")
    report_lines.append("|------|-------------|----------|--------|-------|")

    for tool in only_taaft[:50]:  # Top 50
        name = tool.get('name', 'Unknown')
        desc = tool.get('description', '')[:80] + '...' if len(tool.get('description', '')) > 80 else tool.get('description', '')
        category = tool.get('category', 'N/A')
        rating = f"{tool.get('rating', 'N/A')}/5" if tool.get('rating') else 'N/A'
        views = tool.get('views', 'N/A')

        report_lines.append(f"| [{name}]({tool.get('url', '#')}) | {desc} | {category} | {rating} | {views} |")

    report_lines.extend([
        "",
        "## Tools in Athen-ai but NOT in TAAFT",
        "",
        f"**{len(comparison['only_in_athen'])} tools** (may use different names or be custom additions)",
        ""
    ])

    for tool in comparison['only_in_athen'][:20]:  # First 20
        name = tool.get('name', 'Unknown')
        report_lines.append(f"- {name}")

    report_lines.extend([
        "",
        "## Tools in Both Catalogs",
        "",
        f"**{len(comparison['in_both'])} tools verified** ✓",
        "",
        "These tools appear in both TAAFT and Athen-ai catalogs, confirming their HIPAA compliance status.",
        ""
    ])

    for taaft_tool, athen_tool in sorted(comparison['in_both'][:30], key=lambda x: x[0].get('views', 0) or 0, reverse=True):
        name = taaft_tool.get('name')
        views = taaft_tool.get('views', 'N/A')
        rating = f"{taaft_tool.get('rating')}/5" if taaft_tool.get('rating') else 'N/A'
        report_lines.append(f"- **{name}** - {views} views, {rating}")

    # Recommendations
    report_lines.extend([
        "",
        "## Recommendations",
        "",
        "### High Priority Additions",
        ""
    ])

    # Top tools by views not in Athen-ai
    high_priority = [t for t in only_taaft if (t.get('views') or 0) > 1000][:10]
    for tool in high_priority:
        report_lines.append(
            f"- **{tool['name']}** ({tool.get('views')} views, {tool.get('rating', 'N/A')}/5): "
            f"{tool.get('description', 'No description')[:100]}..."
        )

    if not high_priority:
        report_lines.append("*No high-traffic tools found missing from catalog*")

    # Write report
    with open(output_path, 'w') as f:
        f.write('\n'.join(report_lines))

    print(f"Report generated: {output_path}")


def main():
    parser = argparse.ArgumentParser(description='Compare TAAFT and Athen-ai catalogs')
    parser.add_argument('--taaft', required=True, help='Path to TAAFT scraped JSON')
    parser.add_argument('--athen', help='Path to Athen-ai catalog JSON (if separate file)')
    parser.add_argument('--output', '-o', default='reports/catalog-comparison.md',
                       help='Output markdown report path')
    args = parser.parse_args()

    # Load TAAFT data
    taaft_tools = load_json(args.taaft)
    print(f"Loaded {len(taaft_tools)} tools from TAAFT")

    # Load Athen-ai catalog
    # TODO: Replace with actual catalog source when integrated
    if args.athen:
        athen_tools = load_json(args.athen)
    else:
        # Fallback: use current hardcoded tools from your catalog
        # You would import from src/data/tools.ts or equivalent
        athen_tools = [
            {"name": "ChatGPT", "category": "AI Assistant"},
            {"name": "Claude", "category": "AI Assistant"},
            # ... other tools from your catalog
        ]
        print("Warning: Using placeholder Athen-ai catalog. Specify --athen for accurate comparison.")

    print(f"Loaded {len(athen_tools)} tools from Athen-ai")

    # Compare
    comparison = compare_catalogs(taaft_tools, athen_tools)

    # Generate report
    import os
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    generate_markdown_report(comparison, args.output)

    # Print summary
    print("\n" + "="*50)
    print(f"TAAFT tools: {comparison['stats']['total_taaft']}")
    print(f"Athen-ai tools: {comparison['stats']['total_athen']}")
    print(f"Overlap: {comparison['stats']['overlap']}")
    print(f"Coverage: {comparison['stats']['coverage_pct']}%")
    print(f"Missing from Athen-ai: {len(comparison['only_in_taaft'])}")
    print("="*50)


if __name__ == '__main__':
    main()
