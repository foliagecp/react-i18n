import Polyglot from "node-polyglot";
import { FC, ReactNode, useMemo } from "react";
import { LanguageContext } from "./LanguageContext";

type Dictionary = {
  [phrase: string]: string;
};

type Dictionaries = {
  [locale: string]: Dictionary;
};

interface LanguageProviderProps {
  defaultLang: string;
  locale: string;
  children: ReactNode;
  dictionaries: Dictionaries;
}

const LanguageProvider: FC<LanguageProviderProps> = ({
  locale,
  defaultLang,
  children,
  dictionaries,
}) => {
  const phrases = useMemo(
    () =>
      locale === defaultLang
        ? dictionaries[locale]
        : {
            ...dictionaries[defaultLang],
            ...dictionaries[locale],
          },
    [defaultLang, dictionaries, locale]
  );

  const engine = useMemo(
    () => new Polyglot({ phrases, locale }),
    [locale, phrases]
  );

  return (
    <LanguageContext.Provider value={engine}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext } from "./LanguageContext";
export default LanguageProvider;
