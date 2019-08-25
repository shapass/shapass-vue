import { Configs } from './config.js';
import API from './api.js';

const Steps = Object.freeze({
  LANDING: 'landing',
  APP: 'app',
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET: 'reset-password',
});

const CurrentUser = {
  state: {
    email: null,         // email when logged in
    token: null,         // login token when logged in
    step: Steps.LANDING, // controls where the user is at at the moment
    loading: false,      // true while actions are happening (e.g. sending api request)
  },

  signup (email, password, callback) {
    this.state.loading = true;
    API.signup(email, password, (r) => {
      this.state.loading = false;
      callback(r);
    });
  },

  login (email, password, callback) {
    this.state.loading = true;
    API.login(email, password, (r, token) => {
      if (r) {
        this._setLoggedIn(email, token);
        this.saveCookie();
      } else {
        this._setLoggedOut();
      }
      this.state.loading = false;
      callback(r);
    });
  },

  logout (callback) {
    this.state.loading = true;
    API.logout((r) => {
      if (r) {
        this._setLoggedOut();
      }
      this.state.loading = false;
      callback(r);
    });
  },

  getStep () {
    return this.state.step;
  },
  saveCookie () {
    this._setCookie(Configs.LOGIN_COOKIE_NAME, this.state.token, 1);
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
  isLoggedIn () {
    return this.state.email !== null;
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
