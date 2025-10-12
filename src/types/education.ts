/**
 * TypeScript interfaces for education credentials
 *
 * Defines the structure for academic degrees and educational background.
 * Minimal structure with optional fields for future expansion.
 */

/**
 * Education credential entry
 *
 * Represents a degree or educational achievement with institution information.
 * Optional fields support future enhancements without requiring data migration.
 */
export interface Education {
  // Core required fields
  degree: string; // Degree type and level (e.g., "Bachelor of Science")
  major: string; // Field of study (e.g., "Computer Science")
  institution: string; // University or institution name (e.g., "Oregon State University")

  // Optional fields for future expansion
  location?: string; // Institution location (e.g., "Corvallis, OR")
  graduationDate?: string; // Graduation date or year (e.g., "2020" or "May 2020")
  gpa?: string; // Grade point average if notable (e.g., "3.8/4.0")
  honors?: string[]; // Academic honors or distinctions (e.g., ["Cum Laude", "Dean's List"])
  relevantCoursework?: string[]; // Notable courses relevant to portfolio
}
