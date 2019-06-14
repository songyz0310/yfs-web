import {
  assign,
  forEach,
  isArray
} from 'min-dash';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isExpanded,
  isEventSubProcess
}
from 'bpmn-js/lib/util/DiUtil';

import {
  isAny
}
from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  getChildLanes
}
from 'bpmn-js/lib/features/modeling/util/LaneUtil';
import {
  i18nMsg
} from "../../../../../utils/i18n";

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

ContextPadProvider.prototype.getContextPadEntries = function (element) {

  // debugger
  //重写快捷菜单初始化方法
  //通过控制actions，控制菜单个数

  var contextPad = this._contextPad,
    modeling = this._modeling,

    elementFactory = this._elementFactory,
    connect = this._connect,
    create = this._create,
    popupMenu = this._popupMenu,
    canvas = this._canvas,
    rules = this._rules,
    autoPlace = this._autoPlace,
    translate = this._translate;

  var actions = {};

  if (element.type === 'label') {
    return actions;
  }

  var businessObject = element.businessObject;

  function startConnect(event, element) {
    connect.start(event, element);
  }

  function removeElement(e) {
    modeling.removeElements([element]);
  }

  function getReplaceMenuPosition(element) {

    var Y_OFFSET = 5;

    var diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(element).html;

    var diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect();

    var top = padRect.top - diagramRect.top;
    var left = padRect.left - diagramRect.left;

    var pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    };

    return pos;
  }


  /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      let bpmnType = type.replace(/^bpmn:/, '');
      title = translate(i18nMsg("bpmn.action.append", "Append") +
        ' {type}', {
          type: i18nMsg("bpmn." + bpmnType, bpmnType)
        });
    }

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({
        type: type
      }, options));
      create.start(event, shape, element);
    }


    var append = autoPlace ? function (event, element) {
      var shape = elementFactory.createShape(assign({
        type: type
      }, options));

      autoPlace.append(element, shape);
    } : appendStart;


    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }

  function splitLaneHandler(count) {

    return function (event, element) {
      // actual split
      modeling.splitLane(element, count);

      // refresh context pad after split to
      // get rid of split icons
      contextPad.open(element, true);
    };
  }


  if (isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) && isExpanded(businessObject)) {

    var childLanes = getChildLanes(element);

    assign(actions, {
      'lane-insert-above': {
        group: 'lane-insert-above',
        className: 'bpmn-icon-lane-insert-above',
        title: translate(i18nMsg("bpmn.action.lane_insert_above", "Add Lane above")),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'top');
          }
        }
      }
    });

    if (childLanes.length < 2) {

      if (element.height >= 120) {
        assign(actions, {
          'lane-divide-two': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-two',
            title: translate(i18nMsg("bpmn.action.lane_divide_two", "Divide into two Lanes")),
            action: {
              click: splitLaneHandler(2)
            }
          }
        });
      }

      if (element.height >= 180) {
        assign(actions, {
          'lane-divide-three': {
            group: 'lane-divide',
            className: 'bpmn-icon-lane-divide-three',
            title: translate(i18nMsg("bpmn.action.lane_divide_three", "Divide into three Lanes")),
            action: {
              click: splitLaneHandler(3)
            }
          }
        });
      }
    }

    assign(actions, {
      'lane-insert-below': {
        group: 'lane-insert-below',
        className: 'bpmn-icon-lane-insert-below',
        title: translate(i18nMsg("bpmn.action.lane_insert_below", "Add Lane below")),
        action: {
          click: function (event, element) {
            modeling.addLane(element, 'bottom');
          }
        }
      }
    });

  }

  if (is(businessObject, 'bpmn:FlowNode')) {

    if (is(businessObject, 'bpmn:EventBasedGateway')) {

      assign(actions, {
        'append.receive-task': appendAction(
          'bpmn:ReceiveTask',
          'bpmn-icon-receive-task'
        ),
        'append.message-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-message',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.MessageIntermediateCatchEvent", "MessageIntermediateCatchEvent")
          ), {
            eventDefinitionType: 'bpmn:MessageEventDefinition'
          }
        ),
        'append.timer-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-timer',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.TimerIntermediateCatchEvent", "TimerIntermediateCatchEvent")
          ), {
            eventDefinitionType: 'bpmn:TimerEventDefinition'
          }
        ),
        'append.condtion-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-condition',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.ConditionIntermediateCatchEvent", "ConditionIntermediateCatchEvent")
          ), {
            eventDefinitionType: 'bpmn:ConditionalEventDefinition'
          }
        ),
        'append.signal-intermediate-event': appendAction(
          'bpmn:IntermediateCatchEvent',
          'bpmn-icon-intermediate-event-catch-signal',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.SignalIntermediateCatchEvent", "SignalIntermediateCatchEvent")
          ), {
            eventDefinitionType: 'bpmn:SignalEventDefinition'
          }
        )
      });
    } else

    if (isEventType(businessObject, 'bpmn:BoundaryEvent', 'bpmn:CompensateEventDefinition')) {

      assign(actions, {
        'append.compensation-activity': appendAction(
          'bpmn:Task',
          'bpmn-icon-task',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.CompensationActivity", "compensation activity")
          ), {
            isForCompensation: true
          }
        )
      });
    } else

    if (!is(businessObject, 'bpmn:EndEvent') &&
      !businessObject.isForCompensation &&
      !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
      !isEventSubProcess(businessObject)) {

      assign(actions, {
        'append.end-event': appendAction(
          'bpmn:EndEvent',
          'bpmn-icon-end-event-none'
        ),
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'bpmn-icon-gateway-xor',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.ExclusiveGateway", "ExclusiveGateway")
          )
        ),
        'append.append-task': appendAction(
          'bpmn:UserTask',
          'bpmn-icon-user-task'
        ),
        'append.intermediate-event': appendAction(
          'bpmn:IntermediateThrowEvent',
          'bpmn-icon-intermediate-event-none',
          translate(i18nMsg("bpmn.action.append", "Append") +
            " " + i18nMsg("bpmn.IntermediateThrowEvent", "Intermediate/Boundary Event")
          )
        )
      });
    }
  }

  if (!popupMenu.isEmpty(element, 'bpmn-replace')) {
    // Replace menu entry
    assign(actions, {
      'replace': {
        group: 'edit',
        className: 'bpmn-icon-screw-wrench',
        title: translate(i18nMsg("bpmn.action.change_type", "Change type")),
        action: {
          click: function (event, element) {

            var position = assign(getReplaceMenuPosition(element), {
              cursor: {
                x: event.x,
                y: event.y
              }
            });

            popupMenu.open(element, 'bpmn-replace', position);
          }
        }
      }
    });
  }

  if (isAny(businessObject, [
      'bpmn:FlowNode',
      'bpmn:InteractionNode',
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference'
    ])) {

    assign(actions, {
      'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation'),

      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate(i18nMsg("bpmn.action.connect_using", "Connect using") +
          ' ' +
          (businessObject.isForCompensation ? '' : i18nMsg("bpmn.Sequence", "Sequence/MessageFlow") +
            " " + i18nMsg("bpmn.other.or", "or") + " "
          ) +
          i18nMsg("bpmn.Association", "Association")
        ),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  if (isAny(businessObject, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) {
    assign(actions, {
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate(i18nMsg("bpmn.action.connect_using", "Connect using") +
          " " + i18nMsg("bpmn.DataInputAssociation", "DataInputAssociation")
        ),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    });
  }

  // delete element entry, only show if allowed by rules
  var deleteAllowed = rules.allowed('elements.delete', {
    elements: [element]
  });

  if (isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element;
  }

  if (deleteAllowed) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate(i18nMsg("bpmn.action.remove", "Remove")),
        action: {
          click: removeElement
        }
      }
    });
  }

  return actions;
};


function isEventType(eventBo, type, definition) {

  var isType = eventBo.$instanceOf(type);
  var isDefinition = false;

  var definitions = eventBo.eventDefinitions || [];
  forEach(definitions, function (def) {
    if (def.$type === definition) {
      isDefinition = true;
    }
  });

  return isType && isDefinition;
}
