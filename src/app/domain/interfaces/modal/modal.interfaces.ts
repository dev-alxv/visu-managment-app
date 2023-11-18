import { isDefined } from "src/app/utils/utils";

export class ModalTemplateInputData {

  public modalTitle: string;
  public component: any;
  public inputs: any;
  public controlActions: boolean;
  public logo: boolean;
  public buttonsConfig?: {
    closeButton?: boolean;
    cancelButton?: boolean;
    actionButtonOne?: {
      enable: boolean;
      text: string;
    }
    actionButtonTwo?: {
      enable: boolean;
      text: string;
    }
    actionButtonThree?: {
      enable: boolean;
      text: string;
    }
  }

  constructor(data: ModalTemplateInputData) {
    this.modalTitle = data.modalTitle;
    this.component = data.component;
    this.inputs = data.inputs;
    this.controlActions = data.controlActions;
    this.logo = data.logo;

    //
    this.buttonsConfig = {
      closeButton: isDefined(data.buttonsConfig?.closeButton) ? data.buttonsConfig?.closeButton : true,
      cancelButton: isDefined(data.buttonsConfig?.cancelButton) ? data.buttonsConfig?.cancelButton : false,
    };

    if (data.buttonsConfig && data.buttonsConfig.actionButtonOne) {
      this.buttonsConfig = {
        ...this.buttonsConfig,
        actionButtonOne: {
          enable: data.buttonsConfig?.actionButtonOne?.enable,
          text: data.buttonsConfig?.actionButtonOne?.text
        }
      }
    };

    if (data.buttonsConfig && data.buttonsConfig.actionButtonThree) {
      this.buttonsConfig = {
        ...this.buttonsConfig,
        actionButtonThree: {
          enable: data.buttonsConfig?.actionButtonThree?.enable,
          text: data.buttonsConfig?.actionButtonThree?.text
        }
      }
    };

    if (data.buttonsConfig && data.buttonsConfig.actionButtonTwo) {
      this.buttonsConfig = {
        ...this.buttonsConfig,
        actionButtonTwo: {
          enable: data.buttonsConfig?.actionButtonTwo?.enable,
          text: data.buttonsConfig?.actionButtonTwo?.text
        }
      }
    };
  }
}
