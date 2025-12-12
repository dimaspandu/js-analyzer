import tokenizer from "../tokenizer/main.js";
import extractModules from "../extractModules/main.js";
import transpileImportTokensToCJS from "../transpileImportTokensToCJS/main.js";
import transpileExportTokensToCJS from "../transpileExportTokensToCJS/main.js";
import stringifyTokens from "../stringifyTokens/main.js";

/**
 * Convert ES Module syntax into CJS + extract metadata.
 * Pipeline:
 * 1. Tokenize
 * 2. Extract metadata
 * 3. Transpile import/export tokens → CJS
 * 4. Recombine tokens into final code
 */
export default function transformModule(code) {
  // 1. Tokenize & filter out non-essential tokens
  const cleanedTokens = tokenizer(code).filter(
    (t) =>
      t.type !== "newline" &&
      t.type !== "whitespace" &&
      t.type !== "comment"
  );

  // 2. Extract metadata about ES imports/exports
  const moduleMeta = extractModules(cleanedTokens);

  // 3. Transpile ESM → CJS (imports first, exports second)
  const cjsTokens = transpileImportTokensToCJS(
    transpileExportTokensToCJS(cleanedTokens)
  );

  // 4. Convert tokens back to string
  const transformedCode = stringifyTokens(cjsTokens);

  return {
    code: transformedCode,
    meta: moduleMeta
  };
}