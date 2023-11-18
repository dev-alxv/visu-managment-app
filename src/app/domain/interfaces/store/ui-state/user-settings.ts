import { LanguageString } from "src/app/domain/enums/locales/locales.enum";

export interface IUserSettings {
  defaultDisplayLanguage?: LanguageString;
  currentDisplayLanguage?: LanguageString;
}
