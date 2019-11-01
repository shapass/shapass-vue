import Vue from 'vue';
import VueRouter from 'vue-router';
import vSelect from 'vue-select';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCopy, faPlusSquare, faMinusSquare, faSave, faTrash, faPlayCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMobileDetection from "vue-mobile-detection";
import VTooltip from 'v-tooltip';
import VModal from 'vue-js-modal';

import Utils from './utils.js';

import App from './App.vue';
import ResetPassword from './ResetPassword.vue';
import SignUp from './SignUp.vue';
import SignUpConfirmation from './SignUpConfirmation.vue';
import Login from './Login.vue';

Vue.use(VueRouter);

library.add(faEye);
library.add(faEyeSlash);
library.add(faCopy);
library.add(faPlusSquare);
library.add(faMinusSquare);
library.add(faSave);
library.add(faTrash);
library.add(faPlayCircle);
library.add(faCog);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(Toasted, {
  position: 'top-right',
  duration: 5000,
  singleton: true
});
Vue.use(VueClipboard);
Vue.component('v-select', vSelect);
Vue.use(require('vue-shortkey'));
Vue.use(VueMobileDetection);
Vue.use(VTooltip, { defaultDelay: 500 });
Vue.use(VModal, { dialog: true });

Vue.directive('focus', {
  inserted: function (el, e) {
    var target = null;

    // if not an input, find the first one inside
    if (el.tagName.match(/input/i)) {
      target = el;
    } else {
      target = el.getElementsByTagName('input');
      if (target.length > 0) {
        target = target[0];
      } else {
        target = null;
      }
    }

    // if v-focus has a value it has to be true
    // and we need a target
    if ((!e.hasOwnProperty('value') || e.value) && target !== null) {
      target.focus();
      if (target.value !== undefined && target.value !== null) {
        target.select();
      }
    }
  }
});

Vue.mixin({
  methods: {
    shapass: function(input, algo, length) {
      return Utils.shapass(input, algo, length);
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
    withDisabledButton: function(id, callback) {
      var btn = this.$el.querySelector(id);
      if (btn !== undefined && btn !== null) {
        var bef = btn.disabled;
        btn.disabled = true;
        callback(() => { btn.disabled = bef; });
      } else {
        callback(() => {});
      }
    },
    notEmpty: function(v) {
      return v !== null && v !== undefined && v !== '';
    },
    isValidEmail: function(email) {
      // see https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      return re.test(email);
    },

    // "hack" to prevent browsers from asking if the user wants to save the password
    // the only option that worked, and should be used on "beforeRouteLeave" methods
    // failed attempts:
    // * doing it on "beforeDestroy" inside the component with the input
    // * setting autocomplete="off"
    // * having a fake input with the same name
    // * others from https://stackoverflow.com/questions/41217019/how-to-prevent-a-browser-from-storing-password
    disableSavePassword: function(el) {
      var elements = el.querySelectorAll("input[type=password]");
      elements.forEach((e) => {
        e.value = null;
      });
    }
  }
});

const routes = [
  { path: '/', component: App },
  { path: '/reset-password', component: ResetPassword },
  { path: '/signup', component: SignUp },
  { path: '/confirmation', component: SignUpConfirmation },
  { path: '/login', component: Login },
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

var app = new Vue({
  router
}).$mount('#content');

// console.log("mobile?", app.$isMobile());
VTooltip.enabled = !app.$isMobile(); //window.innerWidth > 768;
