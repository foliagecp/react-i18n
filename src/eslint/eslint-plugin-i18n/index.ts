import type { ESLint } from "eslint";
import { matchDictionaries } from "./rules";
import { json } from "./processors";

const prefix = "eslint-plugin";
const name = "i18n";
const prefixedName = `${prefix}-${name}`;
const version = "0.0.4";
const matchDictionaryName = "match-dictionaries";

const plugin: ESLint.Plugin = {
  meta: {
    name: prefixedName,
    version,
  },
  rules: {
    "match-dictionaries": matchDictionaries,
  },
  processors: {
    json: json(name, matchDictionaryName),
  },
};

export default plugin;
