<template>
  <div>
    <nav class="panel is-shadowless is-radiusless" :class="{'is-success': value.id, 'is-warning': !value.id}">
      <p class="panel-heading is-radiusless" style="margin-bottom: 12px">
        {{ panelTitle }}
      </p>
      <div class="panel-block">
        <form>
          <div class="field">
            <label class="label">Name:</label>
            <div class="control">
              <input class="input" v-model.trim="ruleName" ref="name"/>
            </div>
          </div>
          <div class="field">
            <label class="label">Field Name Matcher (RegExp):</label>
            <input class="input" v-model="ruleRegex"/>
          </div>
          <div class="field">
            <label class="label">Value Type</label>
            <div class="control">
              <div class="select" id="faker-locale">
                <select v-model="ruleValueType">
                  <option value="static">Static (Single Line)</option>
                  <option value="static_long">Static (Multiple Lines)</option>
                  <option value="dynamic">Dynamic</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Value</label>
            <div class="control">
              <input class="input" v-model.trim="ruleValue" v-if="ruleValueType == 'static'"></textarea>
              <textarea class="textarea" v-model.trim="ruleValue" v-if="ruleValueType == 'static_long'"></textarea>
              <editor v-model.trim="ruleValue" v-if="ruleValueType == 'dynamic'" @init="editorInit" lang="javascript" theme="chrome" width="100%" height="300" ></editor>
            </div>
          </div>
          <div class="field">
            <label class="label">Priority</label>
            <div class="control">
              <input type="number" class="input" v-model.trim="rulePriority">
            </div>
          </div>
          <div class="field">
            <button
              type="button"
              class="button is-success"
              @click="onSave"
              :disabled="!isValid"
            >
              Save
            </button>
            <button
              type="button"
              class="button is-danger is-light"
              @click="onCancel"
            >
              Cancel
            </button>
            <button
              id="delete-button"
              type="button"
              class="button is-small is-text has-text-danger"
              @click="onDelete"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'RuleEditor',
  props: ['value'],
  components: {
    editor: require('vue2-ace-editor')
  },
  methods: {
    editorInit: function(editor) {
      require('brace/ext/language_tools');
      require('brace/mode/javascript');
      require('brace/theme/chrome');
      require('brace/snippets/javascript');
      editor.setOptions({
        fontSize: 16
      });
    },
    onSave() {
      this.$emit(
        "onConfirm",
        JSON.parse(JSON.stringify(this.value))
      );
    },
    onDelete() {
      if (confirm('Are you sure you want to delete this rule?')) {
        this.$emit(
          "onDelete",
          JSON.parse(JSON.stringify(this.value))
        );
      }
    },
    onCancel() {
      this.$emit("onCancel");
    },
    _objSet(name, value) {
        const rule = Object.assign(
          {},
          {
            ...this.value
          }
        );
        rule[name] = value;
        this.$emit('input', rule);
    },
    _objGet(name, defaultValue = '') {
      if (this.value && this.value[name]) {
        return this.value[name];
      }

      return defaultValue;
    }
  },
  computed: {
    panelTitle() {
      if (!this.value.name) {
        return 'New Rule';
      }
      return this.value.name;
    },
    isValid() {
      const keys = ['name', 'regex', 'valueType', 'value', 'priority'];

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!this.value[key]) {
          return false;
        }
      }
      const numberRegex = /^[0-9]+$/;
      if (!this.value.priority || !numberRegex.test(this.value.priority)) {
        return false;
      }
      return true;
    },
    ruleName: {
      get() {
        return this._objGet('name', '');
      },
      set(name) {
        this._objSet('name', name);
      }
    },
    ruleRegex: {
      get() {
        return this._objGet('regex', '');
      },
      set(name) {
        this._objSet('regex', name);
      }
    },
    ruleValueType: {
      get() {
        return this._objGet('valueType', '');
      },
      set(valueType) {
        this._objSet('valueType', valueType);
      }
    },
    ruleValue: {
      get() {
        return this._objGet('value', '');
      },
      set(value) {
        this._objSet('value', value);
      }
    },
    rulePriority: {
      get() {
        return this._objGet('priority', '');
      },
      set(priority) {
        this._objSet('priority', priority);
      }
    }
  },
  mounted() {
    this.$refs.name.focus();
  }
}
</script>
<style lang="scss" scoped>
form {
  width: 100%;
}
#delete-button {
  float: right;
}
</style>
