import assert from "node:assert/strict";
import minifyHTML from "../main.js";
import runTest from "../../../../utils/tester.js";

/**
 * BASIC HTML
 */

runTest(
  "Minify HTML - simple tag",
  minifyHTML(`<div></div>`),
  "<div></div>"
);

runTest(
  "Minify HTML - remove newlines and indentation",
  minifyHTML(`
    <div>
      <span></span>
    </div>
  `),
  "<div><span></span></div>"
);

runTest(
  "Minify HTML - remove comments",
  minifyHTML(`<div><!-- comment --><span></span></div>`),
  "<div><span></span></div>"
);

/**
 * ATTRIBUTES
 */

runTest(
  "Minify HTML - attributes spacing",
  minifyHTML(`<div   class="box"    id="a"></div>`),
  `<div class="box" id="a"></div>`
);

runTest(
  "Minify HTML - single attribute",
  minifyHTML(`<img    src="x.png"    />`),
  `<img src="x.png"/>`
);

runTest(
  "Minify HTML - attribute with spaces in value",
  minifyHTML(`<div title="hello   world"></div>`),
  `<div title="hello   world"></div>`
);

/**
 * TEXT NODES (IMPORTANT)
 */

runTest(
  "Minify HTML - preserve text whitespace",
  minifyHTML(`<span> hello   world </span>`),
  `<span> hello   world </span>`
);

runTest(
  "Minify HTML - text between tags",
  minifyHTML(`
    <p>
      Hello
      <b>World</b>
    </p>
  `),
  `<p>Hello <b>World</b></p>`
);

runTest(
  "Minify HTML - multiline text nodes collapse to single space",
  minifyHTML(`
    <p class="hero__description">
      Website error, web app issues, database broken,
      or sudden production down? We help find the root cause
      and fix it.
    </p>
  `),
  `<p class="hero__description">Website error, web app issues, database broken, or sudden production down? We help find the root cause and fix it.</p>`
);

runTest(
  "Minify HTML - inline element between text nodes",
  minifyHTML(`
    <p class="hero__note">
      No need to know what the problem is.
      <strong>That's our part.</strong>
    </p>
  `),
  `<p class="hero__note">No need to know what the problem is. <strong>That's our part.</strong></p>`
);

runTest(
  "Minify HTML - inline element followed by text",
  minifyHTML(`
    <p>
      <span class="terminal__success">✓</span>
      DNS
    </p>
  `),
  `<p><span class="terminal__success">✓</span> DNS</p>`
);

/**
 * SELF CLOSING & VOID
 */

runTest(
  "Minify HTML - self closing tag",
  minifyHTML(`<br />`),
  `<br/>`
);

runTest(
  "Minify HTML - multiple void elements",
  minifyHTML(`
    <img src="a.png" />
    <img src="b.png" />
  `),
  `<img src="a.png"/><img src="b.png"/>`
);

/**
 * SVG
 */

runTest(
  "Minify SVG - simple svg",
  minifyHTML(`
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  `),
  `<svg width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>`
);

runTest(
  "Minify SVG - preserve text",
  minifyHTML(`<text x="0" y="0"> Hello SVG </text>`),
  `<text x="0" y="0"> Hello SVG </text>`
);

/**
 * XML / DOCTYPE
 */

runTest(
  "Minify HTML - doctype preserved",
  minifyHTML(`
    <!DOCTYPE html>
    <html>
      <body></body>
    </html>
  `),
  `<!DOCTYPE html><html><body></body></html>`
);

runTest(
  "Minify XML - xml declaration",
  minifyHTML(`<?xml version="1.0" ?><root> a </root>`),
  `<?xml version="1.0"?><root> a </root>`
);

/**
 * EDGE CASES
 */

runTest(
  "Minify HTML - empty input",
  minifyHTML(``),
  ``
);

runTest(
  "Minify HTML - only whitespace",
  minifyHTML(`   \n   `),
  ``
);

runTest(
  "Minify HTML - multiline tag with attributes",
  minifyHTML(`
    <button
      class="menu-toggle"
      type="button"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  `),
  `<button class="menu-toggle" type="button"><span></span><span></span><span></span></button>`,
  true
);

/**
 * ATTRIBUTE SEPARATORS (REGRESSION)
 *
 * These use node:assert/strict instead of runTest on purpose. runTest
 * normalises with str.replace(/\s+/g, " ").trim(), which collapses runs of
 * whitespace into one space, so a missing separator is caught but excess
 * whitespace stays invisible. These cases assert the exact string.
 */

// --- Bug A: a valueless attribute absorbed the next attribute ---

// A boolean attribute emits no attr_value token. When it was followed by
// another attribute the separator was dropped, merging the two names into
// one. A browser then sees a single unknown attribute, so both names vanish
// and querySelector("[data-x]") stops matching.
assert.equal(
  minifyHTML('<section class="a" data-x data-y="2">hi</section>'),
  '<section class="a" data-x data-y="2">hi</section>'
);

assert.equal(
  minifyHTML('<input\n  id="a"\n  required\n  name="b"\n>'),
  '<input id="a" required name="b">'
);

// --- Bug B: an attribute starting at column 0 lost its separator ---
//
// The tokenizer discarded newlines inside a tag. At column 0 there is no
// indentation, so no whitespace token existed and the attribute was glued
// onto the previous value. Browsers reparse "a"aria-label="b" as two
// attributes, so this was cleanliness rather than correctness, but the
// minifier is meant to be lossless.

assert.equal(
  minifyHTML('<section\n  class="a"\naria-label="b"\n>hi</section>'),
  '<section class="a" aria-label="b">hi</section>'
);

// --- Both bugs combined with the surrounding shapes ---

assert.equal(
  minifyHTML('<section\n  class="a"\n  data-x="1"\n  data-y="2"\n>hi</section>'),
  '<section class="a" data-x="1" data-y="2">hi</section>',
  "valued, indented"
);

assert.equal(
  minifyHTML('<section\n  class="a"\n  data-x\n  data-y="2"\n>hi</section>'),
  '<section class="a" data-x data-y="2">hi</section>',
  "bare, indented"
);

assert.equal(
  minifyHTML('<section\n  class="a"\n  data-x\n>hi</section>'),
  '<section class="a" data-x>hi</section>',
  "bare last attr"
);

assert.equal(
  minifyHTML('<section\n data-a\n data-b\n>hi</section>'),
  '<section data-a data-b>hi</section>',
  "all bare"
);

assert.equal(
  minifyHTML('<section class="a" data-x="1" data-y="2">hi</section>'),
  '<section class="a" data-x="1" data-y="2">hi</section>',
  "single line valued"
);

assert.equal(
  minifyHTML('<section class="a" data-x data-y="2">hi</section>'),
  '<section class="a" data-x data-y="2">hi</section>',
  "single line bare"
);

// Whitespace hugging "=" is still dropped, so this must not become
// "href =\"b\"" now that attr_name counts as a separator producer.
assert.equal(
  minifyHTML('<a class="a"\n  href = "b"\n>x</a>'),
  '<a class="a" href="b">x</a>',
  "spaces around ="
);

assert.equal(
  minifyHTML('<img\n  src="a.jpg"\n  alt=""\n  loading="lazy"\n/>'),
  '<img src="a.jpg" alt="" loading="lazy"/>',
  "self closing, no space before />"
);

assert.equal(
  minifyHTML('<input\n  type="checkbox"\n  checked\n  disabled\n  name="a"\n>'),
  '<input type="checkbox" checked disabled name="a">',
  "boolean html attributes"
);

assert.equal(
  minifyHTML('<svg\n  xmlns="http://www.w3.org/2000/svg"\n  viewBox="0 0 1 1"\n>'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">',
  "svg attributes keep original casing"
);
