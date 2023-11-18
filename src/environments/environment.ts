// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import packageInfo from '../../package.json';

export const apiConfig = {
  apiURL: new URL('https://sandy.immoviewer.com/')
}

export const environment = {
  production: false,
  forTestPurpose: true,
  appVersion: packageInfo.version,
  buildNumber: '',
  iv_main_api_v3: `${apiConfig.apiURL.href}rest/v3`,
  iv_main_api_v2: `${apiConfig.apiURL.href}rest/v2`,
  iv_main_api_v1: `${apiConfig.apiURL.href}rest/v1`,
  visu_api_v1: `${apiConfig.apiURL.href}rest-visu/v1`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
