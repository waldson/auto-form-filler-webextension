import './browser-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

Vue.use(Vuex);

const store = {
  state: {
    locale: '',
    globalScript: '',
    rules: [],
    version: 1
  },
  mutations: {
    saveRule(state, rule) {
      const newRule = JSON.parse(JSON.stringify(rule));
      const index = state.rules.findIndex(function (el) {
        if (el.id == newRule.id) {
          return true;
        }
      });
      if (index < 0) {
        state.rules.push(newRule);
      } else {
        state.rules[index] = newRule;
      }
      state.rules = JSON.parse(JSON.stringify(state.rules)).sort(function (a, b) {
        const aPriority = parseInt(a.priority);
        const bPriority = parseInt(b.priority);

        if (aPriority == bPriority) {
          if (a.name == b.name) {
            return 0
          }
          return a.name.localeCompare(b.name);
        }

        return aPriority > bPriority ? 1 : -1;
      });
      // state.rules.push(newRule);
    },
    reloadState(state, newState) {
      state.rules        = newState.rules;
      state.locale       = newState.locale;
      state.globalScript = newState.globalScript;
    },
    deleteRule(state, rule) {
      const index = state.rules.findIndex(function (el) {
        if (el.id == rule.id) {
          return true;
        }
      });

      if (index < 0) {
        return;
      }
      state.rules.splice(index, 1);
    },
    updateFakerLocale(state, locale) {
      state.locale = locale;
    },
    resetSettings(state) {
      state.locale = '';
      state.globalScript = '';
    },
    updateGlobalScript(state, globalScript) {
      state.globalScript = globalScript;
    }
  },
  actions: {},
  getters: {}
};

 const vuexStore = new Vuex.Store(store);

vuexStore.subscribe((mutation, state) => {
  window.browser.storage.local.set({
    state: JSON.parse(JSON.stringify(state))
  });
});
window.browser.storage.local.get('state').then((response) => {
  if (response.state) {
    vuexStore.commit('reloadState', response.state);
  }
}).catch(e => {
  console.error(e);
});

export default vuexStore;
