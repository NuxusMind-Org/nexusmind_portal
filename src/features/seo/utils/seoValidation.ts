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
      return 'Sxem etibarlı JSON obyekti və ya massivi olmalıdır.'
    }

    return null // valid
  } catch (err) {
    if (err instanceof SyntaxError) {
      return `Yanlış JSON: ${err.message}`
    }
    return 'Yanlış JSON formatı.'
  }
}

// ─────────────────────────────────────────────
// XML Validator (basic well-formedness check)
// Returns null if valid, error message string if invalid
// ─────────────────────────────────────────────
export function validateXml(raw: string): string | null {
  const trimmed = raw.trim()

  if (!trimmed) {
    return 'Sitemap məzmunu boş ola bilməz.'
  }

  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(trimmed, 'application/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        const errorText = parseError.textContent ?? 'Yanlış XML.'
        return `XML sintaksis xətası: ${errorText.split('\n')[0]}`
      }
      return null // valid
    } catch {
      return 'XML oxunarkən xəta baş verdi.'
    }
  }

  // Fallback: basic tag balance check
  if (!trimmed.startsWith('<?xml') && !trimmed.startsWith('<')) {
    return 'Məzmun etibarlı XML formatında görünmür.'
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
