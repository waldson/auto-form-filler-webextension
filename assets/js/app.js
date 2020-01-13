import store from './store';

window.browser = (function() {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

const fillForms = () => {
  window.browser.tabs.query(
    {active: true, currentWindow: true}
  ).then(tabs => {
    window.browser.tabs.executeScript(
      tabs[0].id,
      {
        code: 'var __aff_state = ' + JSON.stringify(store.state) + ';'
      }
    ).then(() => {
      window.browser.tabs.executeScript(
        tabs[0].id,
        {
          file: "/dist/apply-rules.js"
        }
      );
    });
  });
};

window.browser.browserAction.onClicked.addListener(fillForms);
window.browser.commands.onCommand.addListener((command) => {
  if (command == 'fill-forms') {
    fillForms();
    return;
  }

  if (command == 'show-settings') {
    window.browser.runtime.openOptionsPage();
    return;
  }
});
