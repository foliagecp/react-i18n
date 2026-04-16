import type { Linter } from "eslint";

const createJsonProcessor = (
  packageName: string,
  dictionaryName: string
): Linter.Processor => ({
  meta: { name: "eslint-processor-json" },
  preprocess(text: string, fileName: string) {
    if (!fileName.endsWith(".json")) return [];
    try {
      return [`export default ${JSON.stringify(JSON.parse(text))};`];
    } catch {
      return [];
    }
  },
  postprocess(messages: Linter.LintMessage[][]) {
    return (messages[0] ?? []).filter(
      (m) => m.fatal || m.ruleId === `${packageName}/${dictionaryName}`
    );
  },
});

export default createJsonProcessor;
