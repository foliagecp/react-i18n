import Polyglot from "node-polyglot";
import { createContext } from "react";

export const LanguageContext = createContext<Polyglot | null>(null);
