#!/usr/bin/env python3
"""
TAAFT.com HIPAA-Compliant Tools Scraper

Scrapes theresanaiforthat.com for HIPAA-compliant AI tools and outputs
structured JSON data suitable for import into the Athen-ai catalog.

Usage:
    python scripts/scrape-taaft-hipaa.py [--output path/to/output.json]
"""

import argparse
import json
import time
from dataclasses import dataclass, asdict
from typing import List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


@dataclass
class AITool:
    """Represents an AI tool with HIPAA compliance information."""
    name: str
    description: str
    url: str
    category: str
    rating: Optional[float] = None
    review_count: Optional[int] = None
    views: Optional[int] = None
    pricing: Optional[str] = None
    hipaa_mentioned: bool = False
    source: str = "TAAFT"


class TAAFTScraper:
    """Scraper for TAAFT.com HIPAA-compliant tools."""

    BASE_URL = "https://theresanaiforthat.com"
    SEARCH_QUERIES = [
        "hipaa compliant",
        "hipaa",
        "baa",  # Business Associate Agreement
        "healthcare compliant",
    ]

    def __init__(self, delay_seconds: float = 1.0):
        """
        Initialize scraper.

        Args:
            delay_seconds: Delay between requests to be respectful
        """
        self.delay = delay_seconds
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                         'AppleWebKit/537.36 (KHTML, like Gecko) '
                         'Chrome/121.0.0.0 Safari/537.36'
        })

    def scrape_search_results(self, query: str) -> List[AITool]:
        """
        Scrape HIPAA tools from a search query.

        Args:
            query: Search term (e.g., "hipaa compliant")

        Returns:
            List of AITool objects
        """
        search_url = f"{self.BASE_URL}/s/{query.replace(' ', '+').lower()}/"
        print(f"Scraping: {search_url}")

        response = self.session.get(search_url)
        response.raise_for_status()
        time.sleep(self.delay)

        soup = BeautifulSoup(response.text, 'html.parser')
        tools = []

        # Find all tool links
        tool_links = soup.find_all('a', href=lambda h: h and '/ai/' in h)
        seen_urls = set()

        for link in tool_links:
            tool_url = urljoin(self.BASE_URL, link.get('href', ''))

            # Skip duplicates, non-tool links, and comment links
            if (tool_url in seen_urls or
                '/ai/' not in tool_url or
                '/comment/' in tool_url or
                '?ref=' in tool_url):
                continue
            seen_urls.add(tool_url)

            # Extract basic info from search result card
            card = link.find_parent(['div', 'article'])
            if not card:
                continue

            name = link.get_text(strip=True) or self._extract_name_from_url(tool_url)
            description = self._extract_description(card)
            category = self._extract_category(card)

            # Check if HIPAA is mentioned in the visible text
            card_text = card.get_text().lower()
            hipaa_mentioned = any(term in card_text for term in ['hipaa', 'baa', 'phi'])

            # If it appears in a HIPAA search, assume it's relevant
            # (even if the card doesn't explicitly mention HIPAA)
            if not hipaa_mentioned and any(term in query.lower() for term in ['hipaa', 'baa']):
                hipaa_mentioned = True

            tool = AITool(
                name=name,
                description=description,
                url=tool_url,
                category=category,
                hipaa_mentioned=hipaa_mentioned
            )
            tools.append(tool)

        print(f"Found {len(tools)} tools for query '{query}'")
        return tools

    def enrich_tool_details(self, tool: AITool) -> AITool:
        """
        Fetch additional details from the tool's individual page.

        Args:
            tool: AITool with basic info

        Returns:
            Enriched AITool with schema.org data
        """
        print(f"Enriching: {tool.name}")

        response = self.session.get(tool.url)
        response.raise_for_status()
        time.sleep(self.delay)

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract schema.org JSON-LD
        schema_script = soup.find('script', type='application/ld+json')
        if schema_script:
            try:
                schema_data = json.loads(schema_script.string)
                # Handle @graph structure
                if '@graph' in schema_data:
                    for item in schema_data['@graph']:
                        if item.get('@type') == 'SoftwareApplication':
                            tool.category = item.get('applicationCategory', tool.category)

                            rating = item.get('aggregateRating', {})
                            tool.rating = rating.get('ratingValue')
                            tool.review_count = rating.get('reviewCount')

                            stats = item.get('interactionStatistic', {})
                            tool.views = stats.get('userInteractionCount')
                            break
            except json.JSONDecodeError:
                pass

        # Extract description if not already set
        if not tool.description:
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                tool.description = meta_desc.get('content', '')

        # Check description for HIPAA mentions
        if tool.description:
            desc_lower = tool.description.lower()
            tool.hipaa_mentioned = tool.hipaa_mentioned or any(
                term in desc_lower for term in ['hipaa', 'baa', 'phi', 'health insurance portability']
            )

        return tool

    def _extract_name_from_url(self, url: str) -> str:
        """Extract tool name from URL."""
        parts = url.rstrip('/').split('/')
        name = parts[-1].replace('-', ' ').title()
        return name

    def _extract_description(self, card) -> str:
        """Extract description from tool card."""
        # Try to find description paragraph
        desc_elem = card.find(['p', 'div'], class_=lambda c: c and any(
            term in c.lower() for term in ['desc', 'summary', 'text']
        ))
        if desc_elem:
            return desc_elem.get_text(strip=True)

        # Fallback: get text from card
        text = card.get_text(separator=' ', strip=True)
        # Take first 200 chars
        return text[:200] + '...' if len(text) > 200 else text

    def _extract_category(self, card) -> str:
        """Extract category from tool card."""
        # Look for category badges/labels
        category_elem = card.find(['span', 'div'], class_=lambda c: c and any(
            term in c.lower() for term in ['category', 'tag', 'badge']
        ))
        if category_elem:
            return category_elem.get_text(strip=True)
        return "AI Tool"

    def scrape_all(self, enrich: bool = True) -> List[AITool]:
        """
        Scrape all HIPAA-related tools from multiple search queries.

        Args:
            enrich: Whether to fetch detailed info for each tool

        Returns:
            Deduplicated list of AITool objects
        """
        all_tools = {}  # Use dict to deduplicate by URL

        for query in self.SEARCH_QUERIES:
            try:
                tools = self.scrape_search_results(query)
                for tool in tools:
                    if tool.url not in all_tools:
                        all_tools[tool.url] = tool
            except Exception as e:
                print(f"Error scraping '{query}': {e}")

        tools_list = list(all_tools.values())
        print(f"\nTotal unique tools found: {len(tools_list)}")

        if enrich:
            print("\nEnriching tool details...")
            enriched_tools = []
            for tool in tools_list:
                try:
                    enriched = self.enrich_tool_details(tool)
                    enriched_tools.append(enriched)
                except Exception as e:
                    print(f"Error enriching {tool.name}: {e}")
                    enriched_tools.append(tool)
            tools_list = enriched_tools

        # Filter to only tools with HIPAA mentions
        hipaa_tools = [t for t in tools_list if t.hipaa_mentioned]
        print(f"\nTools with HIPAA mentions: {len(hipaa_tools)}")

        return hipaa_tools


def main():
    parser = argparse.ArgumentParser(description='Scrape TAAFT for HIPAA-compliant tools')
    parser.add_argument('--output', '-o', default='data/taaft-hipaa-tools.json',
                       help='Output JSON file path')
    parser.add_argument('--no-enrich', action='store_true',
                       help='Skip fetching detailed info for each tool')
    parser.add_argument('--delay', type=float, default=1.0,
                       help='Delay between requests in seconds')
    args = parser.parse_args()

    scraper = TAAFTScraper(delay_seconds=args.delay)
    tools = scraper.scrape_all(enrich=not args.no_enrich)

    # Convert to JSON-serializable format
    tools_dict = [asdict(tool) for tool in tools]

    # Save to file
    import os
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, 'w') as f:
        json.dump(tools_dict, f, indent=2)

    print(f"\nSaved {len(tools_dict)} HIPAA-compliant tools to {args.output}")

    # Print summary
    categories = {}
    for tool in tools:
        categories[tool.category] = categories.get(tool.category, 0) + 1

    print("\nCategory breakdown:")
    for category, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {category}: {count}")


if __name__ == '__main__':
    main()
