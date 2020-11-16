import { domain, clientId, audience } from '../../auth_config.json';
import { apiUrl } from './api';

export const environment = {
  production: false,
  apiUrl: apiUrl,
  auth: {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: [apiUrl + `/*`],
  },
};
