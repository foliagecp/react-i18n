# Foliage react i18n

This project provides a React i18n plugin with an ESLint rule for validating i18n dictionaries in JSON format. It ensures consistency across translation keys in your project by validating dictionary files and keeping them synchronized. This library uses **[Polyglot.js](https://github.com/airbnb/polyglot.js)**, a lightweight internationalization (i18n) library developed by Airbnb.

## Features

- **Internationalization** support in React.
- **ESLint Rule for Dictionary Validation**: Automatically validates your i18n dictionary files (JSON) to ensure that all translation keys are consistent.
- **Customizable Dictionary Paths**: Easily configure dictionary file paths and exclude default language dictionaries from validation.
- **Warnings on Missing Keys**: Get a warning when there are discrepancies in translation keys.

---

## Installation

**The library is hosted in the GitHub registry**. To install a package from the GitHub registry, you first need to configure the `.npmrc` file to point to the GitHub Package Registry.

### 2. Configure .npmrc

`.npmrc`

```ini
# Configure the registry for the @foliagecp scope to use GitHub Package Registry
@foliagecp:registry=https://npm.pkg.github.com
```

### 2. Install Dependencies

```bash
npm install @foliagecp/react-i18n
```

---

# Usage

## Structure example

```
src/
  └── i18n/
    ├── en.json # English translations
    ├── fr.json # French translations
    └── index.ts # Central file for managing dictionaries and types
  ...
eslint.config.mjs
i18nkeys.js # The list of required keys that should exist in all dictionaries
```

## 1. Dictionary Files

The plugin expects your dictionary files to be in JSON format, with keys representing translation keys and values representing the translated strings.

`en.json` (English dictionary)

```json
{
  "hello_world": "Hello, World!",
  "welcome_message": "Welcome to our application"
}
```

`fr.json` (French dictionary)

```json
{
  "hello_world": "Bonjour, le monde!",
  "welcome_message": "Bienvenue dans notre application"
}
```

## TypeScript Typings for Dictionaries

This plugin also supports TypeScript for type safety in your translation keys. You can define your dictionaries and get autocompletion for keys and tokens.

### Example TypeScript Integration

You can import these dictionaries and define types like so:

`index.ts`

```ts
import en from "./en.json";
import fr from "./fr.json";

const dictionaries = { en, fr };

export type DICTIONARY_KEY = keyof typeof dictionaries; // Represents the keys for the available dictionaries, e.g., 'en' | 'fr'.
export type DICTIONARY_TOKENS = keyof typeof en; // Represents the keys for the translation tokens within a default dictionary, e.g., 'hello_world' | 'welcome_message'.

export default dictionaries;
```

_This file should be created by the developer in their project to manage dictionaries and define types for translation keys and tokens._

## 2. React Plugin Usage

##### 1. Root Component

```jsx
import { LanguageProvider } from "@foliagecp/react-i18n";
import { LANG, DEFAULT_LANG } from 'path_to_your_values';
import dictionaries from "path_to_your_dictionaries"; // Adjust the path to where your dictionaries are stored (index.ts from example)

const RootComponent = ({ children }) => {
  return (
    <LanguageProvider
      locale={LANG} // The current language to be displayed (e.g., 'en', 'fr')
      dictionaries={dictionaries} // The dictionaries object you imported earlier.
      defaultLang={DEFAULT_LANG} //The default language code (e.g., 'en')
    >
      <html lang={LANG}>
        <body>{children}</body>
      </html>
    </LanguageProvider>;
  );
};

export default RootComponent;
```

##### 2. Component usage

Within any component, you can use the useLanguage hook **(based on react context)** to access translation keys. The hook will automatically handle the translations for the current locale.

```jsx
import { DICTIONARY_TOKENS } from 'path_to_your_dictionaries'; // Import dictionary tokens for type safety
import { useLanguage } from '@foliagecp/react-i18n'; // Import the useLanguage hook

const SomeComponent = ({ children }) => {
  const language = useLanguage<DICTIONARY_TOKENS>();
  return (
    <Button>
      {language.translate('hello_world')}
    </Button>
  );
};

export default SomeComponent;
```

- `useLanguage`: This hook returns an object with a translate method that you can use to get translations for the specified keys (e.g., 'hello_world').
- `DICTIONARY_TOKENS`: Type-safe translation keys, ensuring you only pass valid keys. (optional)

If you don't want to repeatedly specify the type for `DICTIONARY_TOKENS` every time you use the useLanguage hook, you can wrap it in a custom hook. This custom hook will encapsulate the type logic and provide a cleaner API for your components.

```ts
import { DICTIONARY_TOKENS } from "path_to_your_dictionaries"; // Import dictionary tokens for type safety
import { useLanguage } from "@foliagecp/react-i18n"; // Import the useLanguage hook

export function useLocale() {
  const language = useLanguage<DICTIONARY_TOKENS>();
  return language.translate;
}
```

This approach gives you full type safety, autocompletion, and an easy way to manage translations across your React components.

### Key Additions:

1. **Root Component**: Shows how to wrap your application in a `LanguageProvider` to provide translations globally.
2. **Component Usage**: Demonstrates how to use the `useLanguage` hook in your components for type-safe translations.
3. **TypeScript Integration**: Continues to emphasize type safety in your dictionaries and translation keys.

This should cover the integration of the React plugin in your app, giving both a practical example and the necessary TypeScript typings for a smooth developer experience.

## 3. ESLint Configuration

In your .eslint.config.mjs add the following configuration:

```js
import { eslintI18nPlugin } from "@foliagecp/react-i18n";

const config = [
  {
    files: ["**/path_to_dictionary_dir/*.json"], // Path to your dictionary files
    ignores: ["**/path_to_dictionary_dir/default_lang.json"], // Exclude the default language JSON from validation
    plugins: {
      i18n: eslintI18nPlugin,
    },
    processor: eslintI18nPlugin.processors.json,
    rules: {
      "i18n/match-dictionaries": ["warn", i18nKeys], // Rule to ensure dictionary consistency
    },
  },
];

export default config;
```

## ESLint Rule: i18n/match-dictionaries

This rule ensures that all translation keys are consistent across your dictionaries. It compares all translation keys from each JSON dictionary file and gives a warning if any keys are missing.

#### Rule Options

`i18nKeys`: The list of required keys that should exist in all dictionaries. This can be defined as part of your config and ensures that any missing keys will be flagged.

Define keys

```js
const i18nKeys = ["hello_world", "welcome_message"];
```

Or you use the script

```js
import { readFile } from "fs/promises";

const path = new URL(
  "path_to_dictionary_dir/default_lang.json",
  import.meta.url
);
const defaultDictionary = JSON.parse(await readFile(path));

export default Object.keys(defaultDictionary);
```

If a dictionary file is missing one of these keys, it will trigger a warning or error. Depends on Eslint config.

**Note:** This README is written with the configuration and guidelines based on **ESLint version 9.0**. Some instructions and examples may depend on features or syntax introduced in this specific version. If you're using a different version of ESLint, be sure to check the relevant documentation for compatibility.

## License

Unless otherwise noted, the Foliage source files are distributed under the Apache Version 2.0 license found in the LICENSE file.
