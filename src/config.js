export const Configs = Object.freeze({
  MAX_LENGTH: 44,                          // maximum length for a generated pw
  MIN_LENGTH: 4,                           // minimum length for a generated pw
  DEFAULT_LENGTH: 32,                      // default length for a generated pw
  SHAPASS_SERVICE: 'shapass',              // name of the service when generating pw for shapass
  LOGIN_COOKIE_NAME: 'shapasslogin',       // name of the cookie to save the user token
  API_URL: 'https://shapass.com/api',      // URL of the API
  PASSWORD_VISIBILITY_TIMEOUT: 8000,       // time before passwords are hidden
  DEFAULT_ALGORITHM: 'sha256-bin',         // sha256-str, sha256-bin, sha256-bin-alfanum
  REMEMBER_ME_DAYS: 90,                    // keep the login cookie for this amount of days

  boundedOutputLength: function(l) {
    if (l < Configs.MIN_LENGTH) {
      return Configs.MIN_LENGTH;
    } else if (l > Configs.MAX_LENGTH) {
      return Configs.MAX_LENGTH;
    } else {
      return l;
    }
  }
});
