import Vue from 'vue';
import Settings from '@components/Settings.vue';
import store from './store';

require('../scss/app.scss');


window.browser = (function() {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

new Vue({
  store,
  el: '#app',
  render: h => h(Settings)
});

