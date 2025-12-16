/**
 * stringifyCSSTokens(tokens)
 * ------------------------------------------------------------
 * Reconstructs a CSS source string from a flat token stream.
 *
 * This stringifier is intentionally minimal:
 * - It does not validate CSS grammar
 * - It does not normalize spacing or formatting
 * - It preserves all original token values verbatim
 *
 * The function is designed to be the final step in a
 * tokenizer → transformer → stringifier pipeline.
 *
 * Expected token shape:
 *   {
 *     type: string,
 *     value: string
 *   }
 *
 * @param {Array<Object>} tokens
 * @returns {string}
 */
export default function stringifyCSSTokens(tokens) {
  // Guard against invalid or empty input
  if (!Array.isArray(tokens) || tokens.length === 0) return "";

  // Concatenate token values in their original order
  return tokens.map(t => t.value).join("");
}
