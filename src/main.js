import Vue from 'vue';
import App from './App.vue';
import vSelect from 'vue-select';
import Toasted from 'vue-toasted';
import VueClipboard from 'vue-clipboard2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCopy, faPlusSquare, faMinusSquare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMobileDetection from "vue-mobile-detection";

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
Vue.use(VueMobileDetection);

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

new Vue({
  render: h => h(App),
}).$mount('#app');
