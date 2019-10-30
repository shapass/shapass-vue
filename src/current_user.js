import { Configs } from './config.js';
import API from './api.js';

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

  login (email, password, callback) {
    this.state.loading = true;
    API.login(email, password, (r, token, code) => {
      if (r) {
        this._setLoggedIn(email, token);
        this.saveCookie();
      } else {
        this._setLoggedOut();
      }
      this.state.loading = false;
      if (callback) {
        callback(r, code);
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
        this._setLoggedIn(email, token);
        this.state.loading = false;
        callback(true);
      } else {
        this.state.loading = false;
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
    this._setCookie(Configs.LOGIN_COOKIE_NAME, this.state.token, Configs.REMEMBER_ME_DAYS);
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
    API.resetPassword(email, (r) => {
      this.state.loading = false;
      callback(r);
    });
  },
  setPassword (email, token, password, callback) {
    this.state.loading = true;
    API.setPassword(email, token, password, (r) => {
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
      // TODO: generate the data encryption token and save with the other
      API.setToken(token);
    }
  },

  _setLoggedOut () {
    this.state.email = null;
    this.state.token = null;
    API.setToken(null);
    this.removeCookie();
  },

  _setCookie (name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
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
    document.cookie = name+'=; Max-Age=-99999999;';
  }


};

export default CurrentUser;
