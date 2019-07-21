import { Configs } from './config.js';
import axios from 'axios';

const API = {
  state: {
    token: null
  },
  request (method, httpMethod, data, callback) {
    var url = `${Configs.API_URL}/${method}`;
    var params = new URLSearchParams();
    if (data !== null && data !== undefined) {
      Object.keys(data).forEach((k) => {
        params.append(k, data[k]);
      });
    }
    console.log("Sending request", url, httpMethod, params.toString());
    axios({
      method: httpMethod,
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      console.log("Success response:", url, response.data);
      callback(response.data.Status === 'OK', response.data);
    }).catch(error => {
      console.log("Error response:", url, error);
      callback(false, null, error);
    });
  },
  loginData () {
    return { loginToken: this.state.token };
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
    this.request('list', 'post', data, (r, d) => {
      if (r) {
        callback(true, d.Token);
      } else {
        callback(false, null);
      }
    });
  },
  logout (callback) {
    this.request('logout', 'post', this.loginData(), (r, d) => {
      callback(r);
    });
  },
};

export default API;
