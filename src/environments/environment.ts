import { domain, clientId, audience } from '../../auth_config.json';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/',
  auth: {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: [`http://localhost:5000/*`],
  },
};
