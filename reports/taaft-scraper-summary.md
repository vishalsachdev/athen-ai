# TAAFT HIPAA-Compliant Tools Scraper - Summary Report

**Date**: 2026-01-09
**Branch**: `feature/scrape-taaft-hipaa-tools`
**Commit**: e38e02b

---

## Executive Summary

Successfully scraped **91 HIPAA-compliant AI tools** from theresanaiforthat.com (TAAFT) for potential inclusion in the Athen-ai catalog. Of these, **31 tools are healthcare/medical specific** and highly relevant for clinician workflows.

### Key Metrics

| Metric | Count |
|--------|-------|
| Total HIPAA-compliant tools | 91 |
| Healthcare/medical tools | 31 |
| Other HIPAA tools (security, compliance, etc.) | 60 |
| Tools with ratings | ~70% |
| Average rating (rated tools) | 4.2/5 |

---

## Top 10 Healthcare Tools (by Popularity)

| Rank | Tool | Views | Rating | Category |
|------|------|-------|--------|----------|
| 1 | **S10 AI** | 5,314 | 3.7/5 | Medical documentation |
| 2 | **Abridge** | 4,892 | 5.0/5 | Medical conversations |
| 3 | **SOAP Note AI** | 4,385 | 5.0/5 | SOAP notes |
| 4 | **Freed AI** | 3,623 | 3.7/5 | Medical documentation |
| 5 | **Dorascribe** | 3,599 | 5.0/5 | Medical documentation |
| 6 | **Sunoh** | 1,756 | 5.0/5 | Medical documentation |
| 7 | **Sully** | 1,563 | 5.0/5 | Healthcare |
| 8 | **Emmo** | 1,375 | 5.0/5 | Blood test interpretation |
| 9 | **Mentalyc** | 1,370 | 3.0/5 | Psychotherapy notes |
| 10 | **Mpilo** | 991 | 3.7/5 | Medical notes |

---

## Category Breakdown

### Healthcare/Medical Categories

| Category | Tool Count |
|----------|-----------|
| Medical documentation | 8 |
| Healthcare (general) | 4 |
| Medical transcription | 3 |
| SOAP notes | 2 |
| Therapy notes | 2 |
| Other categories | 12 |

**Insight**: Medical documentation tools dominate (8 tools), followed by general healthcare platforms (4 tools). This aligns well with Athen-ai's focus on clinical notes and documentation workflows.

---

## High-Priority Tools for Athen-ai Integration

### 1. S10 AI
- **Category**: Medical documentation
- **Popularity**: 5,314 views
- **Rating**: 3.7/5 (3 reviews)
- **Why it matters**: Most popular medical documentation tool, proven market demand
- **URL**: https://theresanaiforthat.com/ai/s10-ai/

### 2. Abridge
- **Category**: Medical conversations
- **Popularity**: 4,892 views
- **Rating**: 5.0/5 (1 review)
- **Why it matters**: Perfect 5-star rating, focuses on clinical conversations (core Athen-ai use case)
- **URL**: https://theresanaiforthat.com/ai/abridge/

### 3. SOAP Note AI
- **Category**: SOAP notes
- **Popularity**: 4,385 views
- **Rating**: 5.0/5 (2 reviews)
- **Why it matters**: Specialized for structured clinical notes (SOAP format), high rating
- **URL**: https://theresanaiforthat.com/ai/soap-note-ai/

### 4. Freed AI
- **Category**: Medical documentation
- **Popularity**: 3,623 views
- **Rating**: 3.7/5 (3 reviews)
- **Why it matters**: Strong popularity, multiple reviews indicate active user base
- **URL**: https://theresanaiforthat.com/ai/freed-ai/

### 5. Dorascribe
- **Category**: Medical documentation
- **Popularity**: 3,599 views
- **Rating**: 5.0/5 (5 reviews)
- **Why it matters**: Perfect rating with most reviews (5), strong validation
- **URL**: https://theresanaiforthat.com/ai/dorascribe/

---

## Workflow Coverage Analysis

Comparing against Athen-ai's target workflows from Issue #2:

| Athen-ai Workflow | TAAFT Tools Available |
|-------------------|---------------------|
| **Clinical notes** | ✅ 8+ tools (Medical documentation, SOAP notes) |
| **Patient instructions** | ⚠️ Limited (some Medical assistance tools) |
| **Prior authorization** | ⚠️ Limited (CoverageCompanion for insurance) |

**Recommendation**: Strong coverage for clinical notes workflow. Consider adding tools for patient instructions and prior authorization in future scrapes.

---

## Data Quality Assessment

### Strengths
- ✅ All tools explicitly found via HIPAA searches
- ✅ 70% have ratings and view counts
- ✅ Schema.org data extracted where available
- ✅ Deduplicated and cleaned (removed comment links)

### Limitations
- ⚠️ ~30% of tools missing view counts (newer tools)
- ⚠️ HIPAA compliance is inferred from search presence, not verified
- ⚠️ Descriptions are often brief (TAAFT limitation)
- ⚠️ No pricing data captured consistently

---

## Next Steps

### Immediate Actions

1. **Review Top 10 Tools**
   - Visit each tool's website
   - Verify HIPAA compliance (BAA availability)
   - Document setup complexity

2. **Compare with Current Catalog**
   ```bash
   python scripts/compare-catalogs.py \
     --taaft data/taaft-hipaa-tools.json \
     --athen src/data/tools.json \
     --output reports/catalog-comparison.md
   ```

3. **Prioritize for Integration**
   - Start with tools rated 5.0/5 and >3,000 views
   - Focus on "Medical documentation" and "SOAP notes" categories
   - Verify Epic EHR compatibility (per MVP requirements)

### Future Enhancements

1. **Automated Updates**
   - Schedule weekly scrapes: `cron: 0 2 * * 0`
   - Track new HIPAA tools over time
   - Monitor rating changes

2. **Enhanced Data Collection**
   - Add pricing tier extraction
   - Capture BAA availability explicitly
   - Screenshot tool UIs for catalog

3. **Validation Pipeline**
   - Manual verification of top 10 tools
   - Test signup flows
   - Document OAuth scopes

---

## Technical Details

### Scraper Architecture

```
Search Queries → Results Pages → Individual Pages → JSON Output
     ↓                ↓                  ↓                ↓
"hipaa compliant"  Tool cards      Schema.org      91 tools
"baa"              Metadata        Ratings         (deduplicated)
"healthcare"       Descriptions    View counts
```

### Key Features
- **Multi-query strategy**: 4 search terms for maximum coverage
- **Two-phase scraping**: Fast search + optional enrichment
- **Rate limiting**: 0.5-1 second delays (respectful)
- **Deduplication**: URL-based (handles duplicates across searches)
- **Error handling**: Continues on individual tool failures

### Files Generated

| File | Purpose | Size |
|------|---------|------|
| `data/taaft-hipaa-tools.json` | Scraped tool data (91 tools) | ~50KB |
| `scripts/scrape-taaft-hipaa.py` | Main scraper | ~10KB |
| `scripts/compare-catalogs.py` | Catalog comparison | ~5KB |
| `scripts/summarize-tools.py` | Summary reports | ~2KB |
| `scripts/README-SCRAPER.md` | Documentation | ~8KB |

---

## Risks & Considerations

### Technical Risks
- **Site structure changes**: TAAFT may update HTML, breaking selectors
- **Rate limiting**: Aggressive scraping could trigger blocks
- **Data accuracy**: Tool info on TAAFT may be outdated

### Business Risks
- **HIPAA verification**: Presence in HIPAA search ≠ verified compliance
- **BAA availability**: Must verify each tool offers BAA
- **Integration effort**: Each tool has unique API/setup requirements

### Mitigation
- Monitor scraper failures via error logs
- Manual verification for tools added to catalog
- Start with top-rated tools (lower risk)
- Document BAA status explicitly in catalog

---

## Conclusion

The TAAFT scraper successfully identified **91 HIPAA-compliant tools**, with **31 highly relevant healthcare tools** for Athen-ai. The top 5 tools (S10 AI, Abridge, SOAP Note AI, Freed AI, Dorascribe) represent strong candidates for catalog expansion, with proven popularity and high ratings.

**Recommended Action**: Prioritize manual review of the top 10 tools to verify HIPAA compliance and assess integration complexity for the Athen-ai MVP.

---

## Appendix: Running the Scraper

```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Run scraper (default settings)
python scripts/scrape-taaft-hipaa.py

# Fast mode (skip enrichment)
python scripts/scrape-taaft-hipaa.py --no-enrich

# Custom delay (2 seconds between requests)
python scripts/scrape-taaft-hipaa.py --delay 2.0

# Custom output location
python scripts/scrape-taaft-hipaa.py --output path/to/output.json

# Generate summary report
python scripts/summarize-tools.py
```

---

**Generated by**: Claude Sonnet 4.5
**Repository**: athen-ai
**Branch**: feature/scrape-taaft-hipaa-tools
