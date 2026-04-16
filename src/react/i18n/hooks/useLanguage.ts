import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageContext";

type TranslateOptions = { count: number };

const useLanguage = <Keys>() => {
  const engine = useContext(LanguageContext);

  if (engine === null) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return {
    translate: (key: Keys, options?: TranslateOptions) => {
      const { count: smart_count, ...rest } = options || {};
      if (engine.has(key as string)) {
        return engine.t(key as string, { smart_count, ...rest });
      } else {
        return key;
      }
    },
  };
};

export default useLanguage;
