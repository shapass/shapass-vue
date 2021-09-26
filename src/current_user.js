import { Configs } from './config.js';
import API from './api.js';
import Store from './store.js';

const Steps = Object.freeze({
  LANDING: 'landing',
  APP: 'app',
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET: 'reset-password',
  OTHER: 'other', // just a generic name for whatever other page
});

const CurrentUser = {
  state: {
    id: parseInt(Math.random() * 10000), // just to help with debug

    email: null,         // email when logged in
    token: null,         // login token when logged in
    step: Steps.LANDING, // controls where the user is at at the moment
    loading: false,      // true while actions are happening (e.g. sending api request)
  },

  signup (email, password, callback) {
    this.state.loading = true;
    API.signup(email, password, (r, code) => {
      this.state.loading = false;
      callback(r, code);
    });
  },

  login (email, masterPassword, password, callback) {
    this.state.loading = true;
    API.login(email, password, (r, token, loginCount, code) => {
      if (r) {
        Store.generateEncryptToken(masterPassword, password);
        this._setLoggedIn(email, token);
        this.saveCookie();
      } else {
        this._setLoggedOut();
      }
      this.state.loading = false;
      if (callback) {
        callback(r, loginCount == 0, code);
      }
    });
  },

  logout (callback) {
    this.state.loading = true;
    API.logout((r) => {
      if (r) {
        this._setLoggedOut();
      }
      this.state.loading = false;
      if (callback) {
        callback(r);
      }
    });
  },

  // TODO: force re-login if there's no data encryption token saved
  checkLoggedIn (callback) {
    this.state.loading = true;
    var token = this.loadCookie();
    API.setToken(token);
    API.whoAmI(email => {
      if (email !== null && email !== undefined) {
        if (Store.hasEncryptToken()) {
          this._setLoggedIn(email, token);
          this.state.loading = false;
          callback(true);
        } else { // force login if the user has no token saved
          this.state.loading = false;
          this._setLoggedOut();
          callback(false);
        }
      } else {
        this.state.loading = false;
        this._setLoggedOut(); // not signed in, so make sure all data is cleared
        callback(false);
      }
    });
  },

  isLoggedIn () {
    return this.state.email !== null;
  },

  getStep () {
    return this.state.step;
  },
  saveCookie () {
    this._setCookie(
      Configs.LOGIN_COOKIE_NAME,
      this.state.token,
      Configs.REMEMBER_ME_DAYS,
      Configs.LOGIN_COOKIE_SECURE,
      Configs.LOGIN_COOKIE_SAMESITE
    );
  },
  loadCookie () {
    return this._getCookie(Configs.LOGIN_COOKIE_NAME);
  },
  removeCookie () {
    this._eraseCookie(Configs.LOGIN_COOKIE_NAME);
  },
  isLoggingInOrSigningUp () {
    return !this.isLoggedIn() && (this.isLoggingIn() || this.isSigningUp());
  },
  isLoggingIn () {
    return this.state.step === Steps.LOGIN;
  },
  isSigningUp () {
    return this.state.step === Steps.SIGNUP;
  },
  atApp () {
    return this.state.step === Steps.APP;
  },
  atLanding () {
    return this.state.step === Steps.LANDING;
  },
  setAtLanding () {
    this.state.step = Steps.LANDING;
  },
  setAtApp () {
    this.state.step = Steps.APP;
  },
  setLoggingIn () {
    this.state.step = Steps.LOGIN;
  },
  setSigningUp () {
    this.state.step = Steps.SIGNUP;
  },
  setResettingPassword () {
    this.state.step = Steps.RESET;
  },
  setAtOther () {
    this.state.step = Steps.OTHER;
  },

  isLoading () {
    return this.state.loading;
  },

  resetPassword (email, callback) {
    this.state.loading = true;
    API.resetPassword(email, (r, code) => {
      this.state.loading = false;
      callback(r, code);
    });
  },
  setPassword (email, token, password, callback) {
    this.state.loading = true;
    API.setPassword(email, token, password, (r, code) => {
      this.state.loading = false;
      callback(r, code);
    });
  },

  resendVerification (email, callback) {
    this.state.loading = true;
    API.resendVerification(email, (r) => {
      this.state.loading = false;
      callback(r);
    });
  },


  //
  // Internal methods
  //

  _setLoggedIn (email, token=undefined) {
    this.state.email = email;
    if (token !== null && token !== undefined) {
      this.state.token = token;
      API.setToken(token);
    }
  },

  _setLoggedOut () {
    Store.clearStateAndStorage();
    this.state.email = null;
    this.state.token = null;
    API.setToken(null);
    this.removeCookie();
  },

  // attr_expire_days: int
  // attr_secure: boolean
  // attr_same_site: string
  _setCookie (name, value, attr_expire_days, attr_secure, attr_same_site) {
    var expires = "";
    if (attr_expire_days) {
      var date = new Date();
      date.setTime(date.getTime() + (attr_expire_days*24*60*60*1000));
      expires = "Expires=" + date.toUTCString();
    }
    var secure = attr_secure ? "Secure" : "";
    var same_site = (attr_same_site !== "") ? attr_same_site : "Lax";
    same_site = `SameSite=${attr_same_site}`;
    var path = "Path=/";

    document.cookie = `${name}=${(value || "")}; ${expires}; ${same_site}; ${secure}; ${path}`;
  },
  _getCookie (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  _eraseCookie (name) {
    document.cookie = name+'=; Max-Age=-99999999; SameSite=Strict';
  }


};

export default CurrentUser;
