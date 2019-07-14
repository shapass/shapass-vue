import Vue from 'vue';
import App from './App.vue';
import vSelect from 'vue-select';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCopy, faPlusSquare, faMinusSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

library.add(faEye);
library.add(faEyeSlash);
library.add(faCopy);
library.add(faPlusSquare);
library.add(faMinusSquare);
library.add(faSave);
library.add(faTrash);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(Toasted, {
  position: 'top-right',
  duration: 3000,
  singleton: true
});
Vue.use(VueClipboard);
Vue.component('v-select', vSelect);
Vue.use(require('vue-shortkey'));

Vue.directive('focus', {
  inserted: function (el, e) {
    if (!e.hasOwnProperty('value') || e.value) {
      el.focus();
      if (el.value !== undefined && el.value !== null) {
        el.select();
      }
    }
  }
});

Vue.mixin({
  methods: {
    shapass: function(input, length=32) {
      return btoa(sha256(input)).substr(0, length);
    },
    randomMask: function() {
      var masks = [
        '*', '_', '-', '!', '~'
      ];
      return masks[Math.floor(Math.random()*masks.length)];
    },
    applyMask: function(str, mask, suffix=null) {
      var result = "";
      var maxLen = str.length;
      if (suffix !== null) {
        maxLen -= suffix.length;
      }
      for (var i = 0; i < maxLen; i++) {
        if (i % 4 == 0) {
          result += str[i];
        } else {
          result += mask;
        }
      }
      if (suffix !== null) {
        result += suffix;
      }
      return result;
    },

    // TODO: move to an API-only component
    // apiMe: function(email, pw, callback) {
    //   axios
    //     .post('https://shapass.com/api/me')
    //     .then(response => {
    //       console.log('success:', response.data);
    //       if (response.data.Status === 'OK') {
    //         callback(true);
    //       } else {
    //         callback(false);
    //       }
    //     })
    //     .catch(error => {
    //       callback(false);
    //     });
    // },
    apiLogin: function(email, pw, callback) {
      axios
      // .post('https://shapass.com/api/login', `{ "email": ${email}, "password": ${pw} }`)
        .post(`https://shapass.com/api/login?email=${email}&password=${pw}`)
        .then(response => {
          console.log('success:', response.data);
          if (response.data.Status === 'OK') {
            callback(true);
          } else {
            callback(false);
          }
        })
        .catch(error => {
          callback(false);
        });
    },
    apiSignUp: function(email, pw, callback) {
      axios
      // .post('https://shapass.com/api/login', `{ "email": ${email}, "password": ${pw} }`)
        .post(`https://shapass.com/api/signup?email=${email}&password=${pw}`)
        .then(response => {
          console.log('success:', response.data);
          if (response.data.Status === 'OK') {
            callback(true);
          } else {
            callback(false);
          }
        })
        .catch(error => {
          callback(false);
        });
    },
    apiLogout: function(callback) {
      axios
        .post('https://shapass.com/api/logout')
        .then(response => {
          console.log('success:', response.data);
          if (response.data.Status === 'OK') {
            callback(true);
          } else {
            callback(false);
          }
        })
        .catch(error => {
          callback(false);
        });
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app');
