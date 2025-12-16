import stringifyHTMLTokens from "../main.js";
import runTest from "../../../utils/tester.js";

runTest(
  "HTML - simple element",
  stringifyHTMLTokens([
    { type: "tagOpen", value: "<div>" },
    { type: "text", value: "Hello" },
    { type: "tagClose", value: "</div>" }
  ]),
  "<div>Hello</div>"
);

runTest(
  "SVG - self closing",
  stringifyHTMLTokens([
    { type: "tagOpen", value: "<circle cx=\"5\" cy=\"5\" r=\"5\" />" }
  ]),
  `<circle cx="5" cy="5" r="5" />`
);
