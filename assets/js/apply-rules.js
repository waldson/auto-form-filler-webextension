import faker from 'faker';
import jQuery from 'jquery';

function _runFunction(code, jQuery, input, faker, values) {
  const prefixScript = __aff_state.globalScript ? __aff_state.globalScript : '';
  try {
    return (new Function('input, faker, $, values', prefixScript + code + ''))(input, faker, jQuery, values);
  } catch (e) {
    console.error(e.getMessage());
    return null;
  }
}


if (__aff_state.locale) {
  faker.locale = __aff_state.locale;
}

const values = {};

document.querySelectorAll('[name]').forEach((item) => {
  var $item   = jQuery(item);
  const rules = __aff_state.rules;

  const name = $item.attr('name');
  if (!name) {
    return;
  }


  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i];
    const regex = new RegExp(rule.regex);

    if (regex.test(name)) {
      switch (rule.valueType) {
        case 'static':
        case 'static_long':
          values[name] = rule.value;
          $item.val(rule.value).keypress();
          break;
        case 'dynamic':
          const result = _runFunction(rule.value, jQuery, $item, faker, values);
          if (result) {
            values[name] = result;
            $item.val(result).keypress();
            return;
          }
        default:
          return;
      }
    }
  }
});
