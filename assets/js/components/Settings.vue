<template>
<section class="section">
    <div class="container">
      <h1 class="title is-3" style="justify-content: center; has-text-centered">
        <img src="assets/img/logo.png" alt="" class="is-inline-block">
        Auto Form Filler Settings
      </h1>
      <div class="columns">
        <div class="column is-one-quarter">
          <aside class="menu">
            <p class="menu-label">
              General
            </p>
            <ul class="menu-list">
              <li><a :class="{'is-active': isInSettings }" @click="gotoSettings">Settings</a></li>
            </ul>
            <p class="menu-label">
              Rules
            </p>
            <article class="message is-warning is-small" v-if="rules.length == 0">
              <div class="message-body">
                You don't have any rules yet.
              </div>
            </article>
            <ul class="menu-list" id="rules">
              <li v-for="(rule, idx) in rules">
                <a href="javascript:void"
                  @click="editRule(rule)"
                  type="button"
                  :key="rule.id"
                  :class="{'is-active': isActive(rule), 'is-odd' : idx % 2 == 0}"
                  >
                  {{ rule.name }}
                </a>
              </li>
            </ul>
            <button
              id="add-rule-button"
              class="button is-success is-small is-fullwidth"
              type="button"
              @click="addRule"
            >
              Add rule
            </button>
          </aside>
        </div>
        <div class="column">
          <rule-editor
            v-if="!isInSettings"
            v-model="currentRule"
            @onCancel="gotoSettings"
            @onConfirm="onRuleEditorConfirm"
            @onDelete="onRuleEditorDelete"
          />
          <settings-editor v-if="isInSettings" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import RuleEditor from '@components/RuleEditor';
import SettingsEditor from '@components/SettingsEditor';
import uuidv4 from 'uuid/v4';

export default {
  name: 'Settings',
  data() {
    return {
      currentScreen: 'settings',
      currentRule: {
        name: '',
        enabled: true,
        regex: '',
        valueType: 'static',
        value: '',
        priority: 10,
        id: null
      }
    }
  },
  methods: {
    editRule(rule) {
      this.currentRule   = rule;
      this.currentScreen = 'ruleEditor';
    },
    gotoSettings() {
      this.resetCurrentRule();
      this.currentScreen = 'settings';
    },
    addRule() {
      this.resetCurrentRule();
      this.currentScreen = 'ruleEditor';
    },
    onRuleEditorConfirm(rule) {
      const isEdit = rule.id != null;
      if (!isEdit) {
        rule.id = uuidv4();
      }
      this.resetCurrentRule();
      this.$store.commit('saveRule', rule);
      this.editRule(rule)
    },
    onRuleEditorDelete(rule) {
      this.$store.commit('deleteRule', rule);
      this.gotoSettings();
    },
    resetCurrentRule() {
      this.currentRule = {
        name: '',
        enabled: true,
        regex: '',
        valueType: 'static',
        value: '',
        priority: 10,
        id: null
      };
    },
    isActive(rule) {
      if (this.currentScreen != 'ruleEditor' || !this.currentRule.id) {
        return false;
      }
      return this.currentRule.id == rule.id;
    }
  },
  computed: {
    rules() {
      return this.$store.state.rules;
    },
    isInSettings() {
      return this.currentScreen == 'settings';
    }
  },
  components: {
    RuleEditor,
    SettingsEditor
  },
  mounted() {
    console.warn(this.rules);
  }
}
</script>
<style lang="scss" scoped>
form {
  width: 100%;
}
#add-rule-button {
  margin-top: 20px;
}
#rules {
  max-height: 500px;
  overflow-y: auto;
}
.is-odd {
  background-color: #ededed;
}
</style>
