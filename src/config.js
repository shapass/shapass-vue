export const Configs = Object.freeze({
  MAX_LENGTH: 64,                          // maximum length for a generated pw
  MIN_LENGTH: 4,                           // minimum length for a generated pw
  DEFAULT_LENGTH: 32,                      // default length for a generated pw
  SHAPASS_SERVICE: 'shapass',              // name of the service when generating pw for shapass
  LOGIN_COOKIE_NAME: 'shapasslogin',       // name of the cookie to save the user token
  // API_URL: 'https://shapass.com/api'    // URL of the API
  API_URL: 'http://localhost:8000'
});
