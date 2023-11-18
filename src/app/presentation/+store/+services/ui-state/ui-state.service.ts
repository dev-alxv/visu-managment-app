import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UiStateStore } from '../../global/ui-state/ui-state.store';
import { LanguageString } from 'src/app/domain/enums/locales/locales.enum';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  constructor(
    private uiStateStore: UiStateStore,
    private translateService: TranslateService
  ) {
    this.setDefaultLanguage();
  }

  public init(): void {
    this.uiStateStore.dispatchAction({ action: 'UI_INITIALIZED' });
  }

  private setDefaultLanguage(): void {
    this.uiStateStore.dispatchAction({
      action: 'SET_DEFAULT_DISPLAY_LANGUAGE',
      language: this.translateService.getDefaultLang() as LanguageString
    });
  }

  public changeDisplayLanguageRequest(language: LanguageString): void {
    this.translateService.use(language);

    this.uiStateStore.dispatchAction({
      action: 'CHANGE_DISPLAY_LANGUAGE',
      language: language
    });
  }
}
