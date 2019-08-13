import { Configs } from './config.js';
import API from './api.js';

const CurrentUser = {
  state: {
    email: null,      // email when logged in
    token: null,      // login token when logged in
    step: 'Landing',  // login step: 'Login', 'SignUp', null, 'Landing'
    loading: false,
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
        this.setLoggedIn(email, token);
        this.saveCookie();
      } else {
        this.setLoggedOut();
      }
      this.state.loading = false;
      callback(r);
    });
  },
  setLoggedIn (email, token=undefined) {
    this.state.email = email;
    if (token !== null && token !== undefined) {
      this.state.token = token;
      API.setToken(token);
    }
    //this.state.step = null;
  },

  logout (callback) {
    this.state.loading = true;
    API.logout((r) => {
      if (r) {
        this.setLoggedOut();
      }
      this.state.loading = false;
      callback(r);
    });
  },
  setLoggedOut () {
    this.state.email = null;
    this.state.token = null;
    API.setToken(null);
    this.removeCookie();
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
    return (this.isLoggingIn() || this.isSigningUp()) && !this.isLoggedIn();
  },
  isLoggedIn () {
    return this.state.email !== null;
  },
  isLoggingIn () {
    return this.state.step === 'Login';
  },
  isSigningUp () {
    return this.state.step === 'SignUp';
  },
  atApp () {
    return this.state.step === null;
  },
  atLanding () {
    return this.state.step === 'Landing';
  },
  setAtLanding () {
    this.state.step = 'Landing';
  },
  setAtApp () {
    this.state.step = null;
  },
  setLoggingIn () {
    this.state.step = 'Login';
  },
  setSigningUp () {
    this.state.step = 'SignUp';
  },
  checkLoggedIn (callback) {
    this.state.loading = true;
    var token = this.loadCookie();
    API.setToken(token);
    API.whoAmI(email => {
      if (email !== null && email !== undefined) {
        this.setLoggedIn(email, token);
        callback(true);
      } else {
        callback(false);
      }
      this.state.loading = false;
    });
  },

  isLoading () {
    return this.state.loading;
  },

  //
  // Internal methods
  //
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
