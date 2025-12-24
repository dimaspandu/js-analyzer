/**
 * getDestructureEndIndex(tokens, startIndex)
 *
 * Finds the end index of a destructuring pattern.
 * Supports both object `{ ... }` and array `[ ... ]` destructuring.
 *
 * Example patterns it can handle:
 *   { a, b }
 *   { a: { b, c }, d }
 *   [a, b, [c, d]]
 *   { a, b: [c, { d }] }
 *
 * Returns:
 * - The index of the matching `}` or `]`
 * - `null` if no matching closing brace/bracket is found
 */
export default function getDestructureEndIndex(tokens, startIndex) {
  const openTok = tokens[startIndex];

  // Validate start token
  if (!openTok || openTok.type !== "punctuator" || !["{", "["].includes(openTok.value)) {
    return null;
  }

  const openValue = openTok.value;
  const closeValue = openValue === "{" ? "}" : "]";

  let depth = 0;

  for (let i = startIndex; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.type === "punctuator") {
      if (t.value === openValue) {
        if (i !== startIndex) depth++;
      } else if (t.value === closeValue) {
        if (depth === 0) return i;
        depth--;
      }
    }
  }

  return null; // No matching closing token found
}
