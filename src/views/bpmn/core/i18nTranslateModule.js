import Chinese from "./i18n/Chinese";

window.____warn = {};

function customTranslate(template, replacements) {
  if (Chinese[template] == undefined) {
    Chinese[template] = template;
    console.info("汉语国际化字段缺失：key:" + template);
    ____warn[template] = template;
    console.info(JSON.stringify(____warn))
    return template;
  }
  replacements = replacements || {};

  // Translate
  template = Chinese[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}


export default {
  translate: ["value", customTranslate]
};
