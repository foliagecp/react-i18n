import Polyglot from "node-polyglot";
import { createContext, FC, ReactNode, useMemo } from "react";

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

export const LanguageContext = createContext({} as Polyglot);

const LanguageProvider: FC<LanguageProviderProps> = ({
  locale,
  defaultLang,
  children,
  dictionaries,
}) => {
  const phrases =
    locale === defaultLang
      ? dictionaries[locale]
      : Object.assign(dictionaries[defaultLang], dictionaries[locale]);

  const engine = useMemo(
    () => new Polyglot({ phrases, locale: locale }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={engine}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
