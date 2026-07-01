// SEO Feature — Validation Utilities
// JSON and XML validators to prevent invalid data from being saved

// ─────────────────────────────────────────────
// JSON-LD Validator
// Returns null if valid, error message string if invalid
// ─────────────────────────────────────────────
export function validateJsonLd(raw: string): string | null {
  const trimmed = raw.trim()

  if (!trimmed) {
    return null // empty is allowed (no schema set)
  }

  try {
    const parsed = JSON.parse(trimmed)

    if (typeof parsed !== 'object' || parsed === null) {
      return 'Schema must be a valid JSON object or array.'
    }

    return null // valid
  } catch (err) {
    if (err instanceof SyntaxError) {
      return `Invalid JSON: ${err.message}`
    }
    return 'Invalid JSON format.'
  }
}

// ─────────────────────────────────────────────
// XML Validator (basic well-formedness check)
// Returns null if valid, error message if invalid
// ─────────────────────────────────────────────
export function validateXml(raw: string): string | null {
  const trimmed = raw.trim()

  if (!trimmed) {
    return 'Sitemap content cannot be empty.'
  }

  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(trimmed, 'application/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        const errorText = parseError.textContent ?? 'Invalid XML.'
        return `XML parse error: ${errorText.split('\n')[0]}`
      }
      return null // valid
    } catch {
      return 'Failed to parse XML.'
    }
  }

  // Fallback: basic tag balance check
  if (!trimmed.startsWith('<?xml') && !trimmed.startsWith('<')) {
    return 'Content does not appear to be valid XML.'
  }

  return null
}

// ─────────────────────────────────────────────
// Format JSON for display (pretty print)
// ─────────────────────────────────────────────
export function formatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

// ─────────────────────────────────────────────
// Check character limits for SEO fields
// ─────────────────────────────────────────────
export const SEO_LIMITS = {
  seoTitle: { ideal: 60, max: 70 },
  metaDescription: { ideal: 155, max: 165 },
}

export function getTitleStatus(value: string): 'good' | 'warning' | 'over' {
  const len = value.length
  if (len === 0) return 'good'
  if (len <= SEO_LIMITS.seoTitle.ideal) return 'good'
  if (len <= SEO_LIMITS.seoTitle.max) return 'warning'
  return 'over'
}

export function getDescriptionStatus(value: string): 'good' | 'warning' | 'over' {
  const len = value.length
  if (len === 0) return 'good'
  if (len <= SEO_LIMITS.metaDescription.ideal) return 'good'
  if (len <= SEO_LIMITS.metaDescription.max) return 'warning'
  return 'over'
}
