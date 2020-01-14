import store from './store';

const fillForms = () => {
  window.browser.tabs.query(
    {active: true, currentWindow: true}
  ).then(tabs => {
    window.browser.storage.local.get('state').then((response) => {
      if (response.state) {
        window.browser.tabs.executeScript(
          tabs[0].id,
          {
            code: 'var __aff_state = ' + JSON.stringify(response.state) + ';'
          }
        ).then(() => {
          window.browser.tabs.executeScript(
            tabs[0].id,
            {
              file: "/dist/apply-rules.js"
            }
          );
        });
      }
    }).catch(e => {
      console.error(e);
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
