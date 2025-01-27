import { Linter } from "eslint";

export default (packageName: string, dictionaryName: string) => ({
  meta: { name: "eslint-processor-json" },
  preprocess(text: string, fileName: string) {
    const tokens = fileName.split(".");
    const isJson = tokens.at(-1) === "json";
    return isJson ? [text] : [];
  },
  postprocess(messages: Linter.LintMessage[][]) {
    return messages[0].filter(
      (m) => m.ruleId === `${packageName}/${dictionaryName}`
    );
  },
});
