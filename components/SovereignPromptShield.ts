// Sovereign Prompt Shield v5 — EduIQ Edition
// Server-side PII detection for HIPAA/FERPA compliance

const PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/g,                        // SSN
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,            // Phone
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi, // Email
  /\b\d{1,5}\s\w+\s(?:St|Ave|Rd|Blvd|Dr|Ln|Way)\b/gi,  // Address
  /\b(?:DOB|born|birthday)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi, // DOB
  /\b\d{2}[\/\-]\d{2}[\/\-]\d{2,4}\b/g,            // Date patterns
]

export function shieldCheck(input: string): string {
  let sanitized = input
  for (const pattern of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]')
  }
  return sanitized
}

export function containsPII(input: string): boolean {
  return PII_PATTERNS.some(p => p.test(input))
}
