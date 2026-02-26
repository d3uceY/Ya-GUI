/**
 * Formats an ISO date string (or any Date-parseable value) into a
 * locale-aware date string, e.g. "2/26/2026".
 */
export function formatReleaseDate(date: string): string {
    return new Date(date).toLocaleDateString()
}
