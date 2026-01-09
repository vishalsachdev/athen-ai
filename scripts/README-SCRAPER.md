# TAAFT HIPAA Tools Scraper

## Overview

This scraper extracts HIPAA-compliant AI tools from [theresanaiforthat.com](https://theresanaiforthat.com) for potential inclusion in the Athen-ai tool catalog.

## Architecture

### Data Flow

```
Search Queries → Search Results Pages → Individual Tool Pages → Enriched JSON
     │                   │                       │                    │
     └─ Multiple terms   └─ Tool cards          └─ Schema.org        └─ Output file
        - "hipaa compliant"   - Name                - Rating
        - "baa"               - Description         - Views
        - "healthcare"        - URL                 - Category
```

### Key Design Decisions

1. **Multi-Query Strategy**: Uses multiple search terms ("HIPAA compliant", "BAA", "healthcare compliant") to maximize coverage since TAAFT doesn't have a structured compliance filter.

2. **Two-Phase Scraping**:
   - **Phase 1**: Fast scrape of search results to get all tool URLs and basic info
   - **Phase 2** (optional): Visit each tool page to extract structured schema.org data

3. **HIPAA Detection**: Searches for keywords in:
   - Tool name
   - Description
   - Card text content
   - Keywords: `hipaa`, `baa`, `phi`, `health insurance portability`

4. **Respectful Scraping**:
   - Configurable delay between requests (default: 1 second)
   - Proper User-Agent header
   - Error handling to continue on failures

### Data Structure

Each tool is extracted as:

```python
@dataclass
class AITool:
    name: str                    # Tool name
    description: str             # Brief description
    url: str                     # TAAFT tool page URL
    category: str                # Category (Healthcare, Compliance, etc.)
    rating: Optional[float]      # Star rating (0-5)
    review_count: Optional[int]  # Number of reviews
    views: Optional[int]         # View count
    pricing: Optional[str]       # Pricing info
    hipaa_mentioned: bool        # Whether HIPAA is explicitly mentioned
    source: str = "TAAFT"        # Data source identifier
```

## Usage

### Prerequisites

```bash
# Install dependencies
pip install requests beautifulsoup4

# Or use requirements file
pip install -r scripts/requirements.txt
```

### Basic Usage

```bash
# Scrape all HIPAA tools with full details
python scripts/scrape-taaft-hipaa.py

# Fast scrape without enrichment (no individual page visits)
python scripts/scrape-taaft-hipaa.py --no-enrich

# Custom output location
python scripts/scrape-taaft-hipaa.py --output path/to/output.json

# Increase delay to be more respectful (2 seconds between requests)
python scripts/scrape-taaft-hipaa.py --delay 2.0
```

### Output

The scraper generates a JSON file (`data/taaft-hipaa-tools.json` by default) with this structure:

```json
[
  {
    "name": "Hathr AI",
    "description": "HIPAA-compliant AI that secures, summarizes, and streamlines healthcare workflows.",
    "url": "https://theresanaiforthat.com/ai/hathr-ai/",
    "category": "Healthcare",
    "rating": 5.0,
    "review_count": 2,
    "views": 425,
    "pricing": null,
    "hipaa_mentioned": true,
    "source": "TAAFT"
  },
  ...
]
```

## Integration with Athen-ai

### Option 1: Import to Catalog

Create a migration script to import scraped tools:

```python
import json
from src/data/tools import TOOLS

# Load scraped data
with open('data/taaft-hipaa-tools.json') as f:
    taaft_tools = json.load(f)

# Transform to Athen-ai format
for tool in taaft_tools:
    athen_tool = {
        'id': tool['name'].lower().replace(' ', '-'),
        'name': tool['name'],
        'description': tool['description'],
        'category': tool['category'],
        'hipaa_compliant': tool['hipaa_mentioned'],
        'setup_guide_url': tool['url'],  # Link to TAAFT for more info
        'pricing': tool['pricing'],
        'metadata': {
            'source': 'TAAFT',
            'rating': tool['rating'],
            'views': tool['views']
        }
    }
    # Add to catalog if not already present
    if not any(t['name'] == athen_tool['name'] for t in TOOLS):
        TOOLS.append(athen_tool)
```

### Option 2: Create a Comparison Report

```bash
# Generate a report comparing TAAFT tools with current catalog
python scripts/compare-catalogs.py \\
  --taaft data/taaft-hipaa-tools.json \\
  --athen src/data/tools.json \\
  --output reports/catalog-coverage.md
```

### Option 3: Regular Updates

Set up a cron job to periodically refresh the data:

```bash
# Add to crontab (weekly on Sunday at 2 AM)
0 2 * * 0 cd /path/to/athen-ai && python scripts/scrape-taaft-hipaa.py
```

## Limitations

1. **No Public API**: TAAFT doesn't provide a public API, so this relies on HTML scraping which may break if the site structure changes.

2. **Text-Based Detection**: HIPAA compliance is detected via keyword matching, not a structured database field. This may miss tools that:
   - Offer BAA but don't mention it prominently
   - Use alternative phrasing ("health data privacy", "PHI-secure")
   - Are compliant but don't advertise it

3. **Incomplete Data**: Not all tools have complete information:
   - Some lack pricing details
   - Rating/review counts may be low or missing
   - Descriptions vary in quality

4. **Rate Limiting**: Scraping too aggressively may trigger rate limiting or IP blocks. Use appropriate delays.

## Ethical Considerations

- **Respect robots.txt**: Check `https://theresanaiforthat.com/robots.txt`
- **Reasonable delays**: Default 1-second delay between requests
- **User-Agent**: Identifies as a browser, not a bot
- **Attribution**: Maintain `source: "TAAFT"` in output data
- **Terms of Service**: Review TAAFT's ToS for scraping policies

## Troubleshooting

### "Connection refused" or timeouts
- Increase delay: `--delay 2.0`
- Check internet connection
- Verify TAAFT is not down

### "Too few results"
- Try `--no-enrich` to skip individual page fetching
- Check if search terms still work on the site
- Site structure may have changed (update selectors)

### "No HIPAA tools found"
- Verify search URLs manually in browser
- Check if TAAFT changed their search URL format
- Run with debugging: `python -u scripts/scrape-taaft-hipaa.py`

## Future Enhancements

- [ ] Add support for filtering by category (Healthcare, Legal, etc.)
- [ ] Extract pricing tiers and feature lists
- [ ] Capture screenshots of tool UIs
- [ ] Build a diff tool to detect new HIPAA tools over time
- [ ] Add selenium for JavaScript-rendered content
- [ ] Create a scheduled GitHub Action for automated updates
