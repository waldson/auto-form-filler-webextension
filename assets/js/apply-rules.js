import faker from 'faker';
import jQuery from 'jquery';

function _runFunction(code, jQuery, input, faker, values, matches) {
  const prefixScript = __aff_state.globalScript ? __aff_state.globalScript : '';
  try {
    return (new Function('input, faker, $, values, matches', prefixScript + code + ''))(input, faker, jQuery, values, matches);
  } catch (e) {
    console.error('Validation error: ' + e.message);
    return null;
  }
}

function setValue($input, text) {
  $input.val(text);
  const changeEvent = new Event('change');
  const inputEvent  = new Event('input');

  const input       = $input[0];

  input.dispatchEvent(inputEvent);
  input.dispatchEvent(changeEvent);
}



if (__aff_state.locale) {
  faker.locale = __aff_state.locale;
}

const values = {};

jQuery('[name]').filter(':input').each(function () {
  var $item   = jQuery(this);
  const rules = __aff_state.rules;

  const name = $item.attr('name');
  if (!name) {
    return;
  }


  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i];
    const regex = new RegExp(rule.regex);

    if (regex.test(name)) {
      const matches = regex.exec(name);
      switch (rule.valueType) {
        case 'static':
        case 'static_long':
          values[name] = rule.value;
          setValue($item, rule.value);
          break;
        case 'dynamic':
          const result = _runFunction(rule.value, jQuery, $item, faker, values, matches);
          if (result) {
            values[name] = result;
            setValue($item, result);
            return;
          }
        default:
          return;
      }
    }
  }
});
