import {
  assign
} from 'min-dash';

import {
  i18nMsg
} from "../../../../../utils/i18n";

/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function ModelerPaletteProvider(
  palette, create, elementFactory,
  spaceTool, lassoTool, handTool,
  globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

ModelerPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];


ModelerPaletteProvider.prototype.getPaletteEntries = function (element) {
  //重写工具栏初始化方法
  //通过控制actions，控制菜单个数

  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({
        type: type
      }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate(i18nMsg("bpmn.action.create", "Create") + ' {type}', {
        type: i18nMsg("bpmn." + shortType)
      }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createParticipant(event, collapsed) {
    create.start(event, elementFactory.createParticipantShape(collapsed));
  }



  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: i18nMsg("bpmn.tip.handTool", 'Activate the hand tool'),
      action: {
        click: function (event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: i18nMsg("bpmn.tip.lassoTool", 'Activate the lasso tool'),
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: i18nMsg("bpmn.tip.spaceTool", 'Activate the create/remove space tool'),
      action: {
        click: function (event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: i18nMsg("bpmn.tip.connectTool", 'Activate the global connect tool'),
      action: {
        click: function (event) {
          globalConnect.toggle(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none'
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
    ),
    'create.parallel-gateway': createAction(
      'bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel'

    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.task': createAction(
      'bpmn:UserTask', 'activity', 'bpmn-icon-user-task'
    ),
    'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object'
    ),
    'create.data-store': createAction(
      'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store'
    ),
    'create.subprocess-expanded': createAction(
      'bpmn:SubProcess', 'activity', 'bpmn-icon-subprocess-expanded',
      i18nMsg("bpmn.action.create", "Create") + " " + i18nMsg("bpmn.ExpandedSubProcess", "expanded SubProcess"), {
        isExpanded: true
      }
    ),
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: i18nMsg("bpmn.action.create", "Create") + " " + i18nMsg("bpmn.PoolParticipant", "Pool/Participant"),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    }
  });

  return actions;
};