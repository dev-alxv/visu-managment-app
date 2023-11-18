import packageInfo from '../../package.json';

export const apiConfig = {
  apiURL: new URL('https://app.immoviewer.com/')
}

export const environment = {
  production: true,
  forTestPurpose: false,
  appVersion: packageInfo.version,
  buildNumber: '',
  iv_main_api_v3: `${apiConfig.apiURL.href}rest/v3`,
  iv_main_api_v2: `${apiConfig.apiURL.href}rest/v2`,
  iv_main_api_v1: `${apiConfig.apiURL.href}rest/v1`,
  visu_api_v1: `${apiConfig.apiURL.href}rest-visu/v1`
};
