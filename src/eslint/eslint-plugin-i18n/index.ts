import { matchDictionaries } from "./rules";
import { json } from "./processors";
const prefix = "eslint-plugin";
const name = "i18n";
const prefixedName = `${prefix}-${name}`;
const version = "0.0.1";
const matchDictionaryName = "match-dictionaries";

export default {
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
