import assert from "node:assert/strict";
import test from "node:test";
import { ESLint } from "eslint";

import plugin from "../src/eslint/eslint-plugin-i18n/index.ts";

const createEslint = () =>
  new ESLint({
    ignore: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        plugins: {
          i18n: plugin,
        },
      },
      {
        files: ["**/*.json"],
        processor: "i18n/json",
        rules: {
          "i18n/match-dictionaries": ["warn", ["title", "subtitle"]],
        },
      },
    ],
  });

test("json processor integrates with match-dictionaries rule", async () => {
  const eslint = createEslint();

  const [missingKeyResult] = await eslint.lintText('{"title":"Title"}', {
    filePath: "ru.json",
  });

  assert.equal(missingKeyResult.messages.length, 1);
  assert.equal(missingKeyResult.messages[0]?.severity, 1);
  assert.equal(
    missingKeyResult.messages[0]?.ruleId,
    "i18n/match-dictionaries"
  );
  assert.match(
    missingKeyResult.messages[0]?.message ?? "",
    /Missing keys: 'subtitle'/
  );

  const [matchingDictionaryResult] = await eslint.lintText(
    '{"title":"Title","subtitle":"Subtitle"}',
    {
      filePath: "en.json",
    }
  );

  assert.equal(matchingDictionaryResult.messages.length, 0);
});
