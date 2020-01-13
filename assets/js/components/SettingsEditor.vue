<template>
  <nav class="panel is-shadowless is-radiusless">
    <p class="panel-heading is-radiusless" style="margin-bottom: 12px">
      Settings
    </p>
    <div class="panel-block">
      <form>
        <div class="field">
          <label class="label" for="faker-locale">Faker's Locale</label>
          <div class="control">
            <div class="select" id="faker-locale">
              <select v-model="fakerLocale">
                <option value="">Default</option>
                <option value="az">az</option>
                <option value="cz">cz</option>
                <option value="de">de</option>
                <option value="de_AT">de_AT</option>
                <option value="de_CH">de_CH</option>
                <option value="en">en</option>
                <option value="en_AU">en_AU</option>
                <option value="en_BORK">en_BORK</option>
                <option value="en_CA">en_CA</option>
                <option value="en_GB">en_GB</option>
                <option value="en_IE">en_IE</option>
                <option value="en_IND">en_IND</option>
                <option value="en_US">en_US</option>
                <option value="en_ZA">en_ZA</option>
                <option value="en_au_ocker">en_au_ocker</option>
                <option value="es">es</option>
                <option value="es_MX">es_MX</option>
                <option value="fa">fa</option>
                <option value="fr">fr</option>
                <option value="fr_CA">fr_CA</option>
                <option value="ge">ge</option>
                <option value="id_ID">id_ID</option>
                <option value="it">it</option>
                <option value="ja">ja</option>
                <option value="ko">ko</option>
                <option value="nb_NO">nb_NO</option>
                <option value="nep">nep</option>
                <option value="nl">nl</option>
                <option value="pl">pl</option>
                <option value="pt_BR">pt_BR</option>
                <option value="pt_PT">pt_PT</option>
                <option value="ru">ru</option>
                <option value="sk">sk</option>
                <option value="sv">sv</option>
                <option value="tr">tr</option>
                <option value="uk">uk</option>
                <option value="vi">vi</option>
                <option value="zh_CN">zh_CN</option>
                <option value="zh_TW">zh_TW</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label" for="faker-locale">Global Script</label>
          <div class="control">
            <editor v-model="globalScript" @init="editorInit" lang="javascript" theme="chrome" width="100%" height="300" ></editor>
          </div>
        </div>
        <div class="field">
          <button class="button is-danger is-light" @click="resetSettings" type="button">
            Reset Settings
          </button>
        </div>
      </form>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'SettingsEditor',
  methods: {
    resetSettings() {
      if (confirm('Do you really want to reset your settings?')) {
        this.$store.commit('resetSettings');
      }
    },
    editorInit: function(editor) {
      require('brace/ext/language_tools');
      require('brace/mode/javascript');
      require('brace/theme/chrome');
      require('brace/snippets/javascript');
      editor.setOptions({
        fontSize: 16
      });
    }
  },
  components: {
    editor: require('vue2-ace-editor')
  },
  computed: {
    globalScript: {
      get() {
        if (this.$store.state.globalScript) {
          return this.$store.state.globalScript;
        }
        return '';
      },
      set(value) {
        this.$store.commit('updateGlobalScript', value);
      }
    },
    fakerLocale: {
      get() {
        if (this.$store.state.locale) {
          return this.$store.state.locale;
        }
        return '';
      },
      set(value) {
        this.$store.commit('updateFakerLocale', value);
      }
    },
  }
}
</script>
<style lang="scss" scoped>
form {
  width: 100%;
}
</style>
