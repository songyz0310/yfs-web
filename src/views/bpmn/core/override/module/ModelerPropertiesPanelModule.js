import translate from 'diagram-js/lib/i18n/translate';
import cmd from "bpmn-js-properties-panel/lib/cmd";

import ModelerPropertiesPanel from '../provider/panel';

export default {
  __depends__: [
    cmd,
    translate
  ],
  __init__: ['modelerPropertiesPanel'],
  modelerPropertiesPanel: ['type', ModelerPropertiesPanel]
};
