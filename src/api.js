import Vue from 'vue';
import { Configs } from './config.js';
import Utils from './utils.js';
import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const API = {
  Errors: Object.freeze({
    CodeOK: 0,
    CodeInternalError: 1,
    CodeNotLoggedIn: 2,
    CodeIncorrectLoginInfo: 3,
    CodeIncorrectSignupInfo: 4,
    CodeUserNotActivated: 5,
    CodeUserDoesNotExist: 6,
    CodeRuleDoesNotExist: 7,
    CodeInvalidInput: 8,
    CodeInvalidToken: 9,
    CodeCouldNotSendEmail: 10,
    CodeInvalidAlgorithm: 11,
    CodeResetPasswordDelay: 12,
    CodeInvalidMethod: 13
  }),

  state: {
    token: null
  },

  request (method, httpMethod, data, callback) {
    var url = `${Configs.API_URL}/${method}`;

    let dataForLog = Vue.util.extend({}, data);
    this._filterParamsForLog(dataForLog);
    Vue.$log.warn("Sending request", url, httpMethod, dataForLog);

    axios({
      method: httpMethod,
      url: url,
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dataForLog = Vue.util.extend({}, response.data);
      this._filterParamsForLog(dataForLog);
      Vue.$log.warn("Success response:", url, dataForLog);
      callback(response.data.Status === 'OK', response.data);
    }).catch(error => {
      Vue.$log.warn("Error response:", url, error);
      callback(false, null, error);
    });
  },
  loginData (data) {
    var base = { token: this.state.token };
    if (data !== null && data !== undefined) {
      Object.keys(data).forEach((k) => { base[k] = data[k]; });
    }
    return base;
  },
  setToken (val) {
    this.state.token = val;
  },

  //
  // API methods
  //
  whoAmI (callback) {
    this.request('whoami', 'post', this.loginData(), (r, d) => {
      if (r) {
        callback(d.Message);
      } else {
        callback(null);
      }
    });
  },
  list (callback) {
    this.request('list', 'post', this.loginData(), (r, d) => {
      if (r) {
        callback(d.Rules);
      } else {
        callback(null);
      }
    });
  },
  login (email, password, callback) {
    var data = { email: email, password: password };
    this.request('login', 'post', data, (r, d) => {
      if (r) {
        callback(true, d.Token, d.LoginCount);
      } else {
        callback(false, null, null, d !== null ? d.Code : null);
      }
    });
  },
  logout (callback) {
    this.request('logout', 'post', this.loginData(), (r) => {
      callback(r);
    });
  },
  signup (email, password, callback) {
    var data = { email: email, password: password };
    this.request('signup', 'post', data, (r, d) => {
      if (r) {
        callback(true);
      } else {
        callback(false, d !== null ? d.Code : null);
      }
    });
  },
  create (name, length, prefix, suffix, algorithm, callback) {
    var data = { name: name };
    if (length !== null && length !== undefined) {
      data["length"] = length;
    }
    if (prefix !== null && prefix !== undefined) {
      data["prefix"] = prefix;
    }
    if (suffix !== null && suffix !== undefined) {
      data["suffix"] = suffix;
    }
    if (algorithm !== null && algorithm !== undefined) {
      data["algorithm"] = algorithm;
    }
    this.request('create', 'post', this.loginData(data), (r) => {
      if (r) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },
  delete (name, callback) {
    var data = { name: name };
    this.request('delete', 'post', this.loginData(data), (r) => {
      if (r) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },
  resetPassword (email, callback) {
    var data = { email: email };
    this.request('resetpassword', 'post', data, (r, d) => {
      if (r) {
        callback(true);
      } else {
        callback(false, d.Code);
      }
    });
  },
  setPassword (email, token, password, callback) {
    var data = { email: email, token: token, newpassword: password };
    this.request('resetpassword', 'post', data, (r, d) => {
      if (r) {
        callback(true);
      } else {
        callback(false, d.Code);
      }
    });
  },
  load (key, callback) {
    this.request('load', 'post', this.loginData(), (r, d) => {
      if (r && d !== null && d !== undefined) {
        var encrypted = d.EncryptedData;
        var hasData = encrypted !== null && encrypted !== undefined &&
            (typeof encrypted !== 'string' || encrypted.trim() !== '');
        if (hasData) {
          var decrypted = Utils.shapassDecrypt(key, encrypted);
          decrypted = JSON.parse(decrypted);
          callback(true, encrypted, decrypted);
        } else {
          callback(true, encrypted, null);
        }
      } else {
        callback(false, null, null);
      }
    });
  },
  save (key, userData, callback) {
    var encrypted = Utils.shapassEncrypt(key, userData);
    var data = { data: encrypted };
    this.request('save', 'post', this.loginData(data), (r) => {
      if (r) {
        callback(true, encrypted);
      } else {
        callback(false, null);
      }
    });
  },
  resendVerification (email, callback) {
    var data = { email: email };
    this.request('resendverification', 'post', data, (r) => {
      if (r) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },

  //
  // Internal methods
  //

  _filterParamsForLog (params) {
    if (isProduction) {
      ['password', 'LoginCount', 'Token', 'token'].forEach((p) => {
        if (params[p] !== undefined && params[p] !== null) {
          params[p] = '[FILTERED]';
        }
      });
    }
  },

};

export default API;
