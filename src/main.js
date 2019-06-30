import Vue from 'vue'
import App from './App.vue'
import vSelect from 'vue-select'

Vue.config.productionTip = false

Vue.component('v-select', vSelect)

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

Vue.mixin({
  methods: {
    shapass: function(input, length=32) {
      return btoa(sha256(input)).substr(0, length);
    },
    randomMask: function() {
      var masks = [
        '___', '---', '===', '***', '###', '%%%', '+++'
      ];
      return masks[Math.floor(Math.random()*masks.length)];
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
