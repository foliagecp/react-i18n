import { Rule } from "eslint";

type KeyList = string[];

const findMissingKeys = (reference: KeyList, toValidate: KeyList) => {
  return reference.filter((key) => !toValidate.includes(key));
};

const formatKeys = (keys: string[]) => keys.map((k) => `'${k}'`);

const rule: Rule.RuleModule = {
  meta: {
    schema: {
      type: "array",
      minItems: 1,
      maxItems: 1,
      items: [{ type: "array" }],
    },
  },
  create(context: Rule.RuleContext) {
    const referenceKeys: KeyList = context.options[0];
    return {
      ObjectExpression(node) {
        const nodeKeys: KeyList = node.properties
          .map((prop) =>
            prop.type === "Property" && prop.key.type === "Literal"
              ? prop.key.value?.toString() || ""
              : ""
          )
          .filter((v) => v);

        const hasLessKeys = nodeKeys.length < referenceKeys.length;
        const missingKeys = hasLessKeys
          ? findMissingKeys(referenceKeys, nodeKeys)
          : findMissingKeys(nodeKeys, referenceKeys);

        if (!missingKeys.length) {
          return;
        }

        const keysToPrint = formatKeys(missingKeys);
        const message = hasLessKeys
          ? `Missing keys: ${keysToPrint}`
          : `Unnecessary keys: ${keysToPrint}`;

        context.report({ node: node, message });
      },
    };
  },
};

export default rule;
