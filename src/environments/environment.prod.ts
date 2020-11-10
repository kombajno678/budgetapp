import { domain, clientId, audience } from '../../auth_config.json';

export const environment = {
  production: true,
  apiUrl : 'https://flask-test-app-01.herokuapp.com',
  auth: {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: [`https://flask-test-app-01.herokuapp.com/*`],
  },
};
