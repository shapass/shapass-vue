import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ResetPassword from './ResetPassword.vue';
import vSelect from 'vue-select';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCopy, faPlusSquare, faMinusSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMobileDetection from "vue-mobile-detection";
import VTooltip from 'v-tooltip';

Vue.use(VueRouter);

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
  duration: 4000,
  singleton: true
});
Vue.use(VueClipboard);
Vue.component('v-select', vSelect);
Vue.use(require('vue-shortkey'));
Vue.use(VueMobileDetection);
Vue.use(VTooltip, { defaultDelay: 500 });

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
    shapass: function(input, algo, length=32) {
      if (algo === 'sha256-str') {
        return btoa(sha256(input)).substr(0, length);
      } else if (algo === 'sha256-bin') {
        return base64js.fromByteArray(sha256.digest(input)).substr(0, length);
      } else {
        return "";
      }
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
    }
  }
});

const routes = [
  { path: '/', component: App },
  { path: '/reset-password', component: ResetPassword }
];

const router = new VueRouter({
  routes
});

var app = new Vue({
  router
}).$mount('#content');

console.log("mobile?", app.$isMobile());
VTooltip.enabled = !app.$isMobile(); //window.innerWidth > 768;
