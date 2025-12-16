export default function stringifyHTMLTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return "";
  return tokens.map(t => t.value).join("");
}
