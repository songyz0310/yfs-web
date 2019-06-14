import ScrollTabs from "scroll-tabs";

import {
  domify,
  query as domQuery,
  queryAll as domQueryAll,
  remove as domRemove,
  attr as domAttr,
  classes as domClasses,
  closest as domClosest,
  delegate as domDelegate,
} from 'min-dom'

import {
  forEach,
  get,
  keys,
  isEmpty,
  isArray,
  xor,
  debounce,
  flattenDeep,
} from "lodash";

import {
  isToggle,
  isSelect,
  isContentEditable,
  getPropertyPlaceholders,
  getFormControls,
  getFormControlValues,
  valuesEqual,
  extractEntries,
  extractGroups,
  setSelectValue,
  setInputValue,
  setToggleValue,
  setTextValue,
  isImplicitRoot,
  getBusinessObject,
  HIDE_CLASS,
  DEBOUNCE_DELAY,
} from "./PanelSupport";

/**
 * A properties panel implementation.
 *
 * To use it provide a `propertiesProvider` component that knows
 * about which properties to display.
 *
 * Properties edit state / visibility can be intercepted
 * via a custom {@link PropertiesActivator}.
 *
 * @class
 * @constructor
 *
 * @param {Object} config
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 * @param {PropertiesProvider} propertiesProvider
 * @param {Canvas} canvas
 * @param {CommandStack} commandStack
 */
export default function PropertiesPanel(config, eventBus, modeling, propertiesProvider, commandStack, canvas) {

  this._eventBus = eventBus;
  this._modeling = modeling;
  this._commandStack = commandStack;
  this._canvas = canvas;
  this._propertiesProvider = propertiesProvider;

  this._init(config);
}

PropertiesPanel.$inject = [
  'config.propertiesPanel',
  'eventBus',
  'modeling',
  'propertiesProvider',
  'commandStack',
  'canvas'
];

PropertiesPanel.prototype._init = function (config) {

  var canvas = this._canvas,
    eventBus = this._eventBus;

  //添加到画布后,选择根元素
  eventBus.on('root.added', e => {
    var element = e.element;

    if (isImplicitRoot(element)) {
      return;
    }
    this.update(element);
  });

  eventBus.on('selection.changed', e => {
    var newElement = e.newSelection[0];

    var rootElement = canvas.getRootElement();

    if (isImplicitRoot(rootElement)) {
      return;
    }

    this.update(newElement);
  });

  // add / update tab-bar scrolling
  eventBus.on([
    'propertiesPanel.changed',
    'propertiesPanel.resized'
  ], (event) => {

    var tabBarNode = domQuery('.bpp-properties-tab-bar', this._container);

    if (!tabBarNode) {
      return;
    }

    var scroller = ScrollTabs.get(tabBarNode);

    if (!scroller) {

      //初始化滚动Tab页
      scroller = ScrollTabs(tabBarNode, {
        selectors: {
          tabsContainer: '.bpp-properties-tabs-links',
          tab: '.bpp-properties-tabs-links li',
          ignore: '.bpp-hidden',
          active: '.bpp-active'
        }
      });


      scroller.on('scroll', (newActiveNode, oldActiveNode, direction) => {

        var linkNode = domQuery('[data-tab-target]', newActiveNode);

        var tabId = domAttr(linkNode, 'data-tab-target');

        this.activateTab(tabId);
      });
    }

    // 对选项卡更改和/或选项卡容器调整大小做出反应，并确保活动选项卡完全显示
    scroller.update();
  });

  eventBus.on('elements.changed', e => {

    var current = this._current;
    var element = current && current.element;

    if (element) {
      if (e.elements.indexOf(element) !== -1) {
        this.update(element);
      }
    }
  });

  eventBus.on('elementTemplates.changed', () => {
    var current = this._current;
    var element = current && current.element;

    if (element) {
      this.update(element);
    }
  });

  eventBus.on('diagram.destroy', () => {
    this.detach();
  });

  this._container = domify('<div class="bpp-properties-panel"></div>');

  this._bindListeners(this._container);

  if (config && config.parent) {
    this.attachTo(config.parent);
  }
};


PropertiesPanel.prototype.attachTo = function (parentNode) {

  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  // unwrap jQuery if provided
  if (parentNode.get && parentNode.constructor.prototype.jquery) {
    parentNode = parentNode.get(0);
  }

  if (typeof parentNode === 'string') {
    parentNode = domQuery(parentNode);
  }

  var container = this._container;

  parentNode.appendChild(container);

  this._emit('attach');
};

PropertiesPanel.prototype.detach = function () {

  var container = this._container,
    parentNode = container.parentNode;

  if (!parentNode) {
    return;
  }

  this._emit('detach');

  parentNode.removeChild(container);
};

/**
 * Select the given tab within the properties panel.
 *
 * @param {Object|String} tab
 */
PropertiesPanel.prototype.activateTab = function (tab) {

  var tabId = typeof tab === 'string' ? tab : tab.id;

  var current = this._current;

  var panelNode = current.panel;

  var allTabNodes = domQueryAll('.bpp-properties-tab', panelNode),
    allTabLinkNodes = domQueryAll('.bpp-properties-tab-link', panelNode);

  forEach(allTabNodes, function (tabNode) {

    var currentTabId = domAttr(tabNode, 'data-tab');

    domClasses(tabNode).toggle('bpp-active', tabId === currentTabId);
  });

  forEach(allTabLinkNodes, function (tabLinkNode) {

    var tabLink = domQuery('[data-tab-target]', tabLinkNode),
      currentTabId = domAttr(tabLink, 'data-tab-target');

    domClasses(tabLinkNode).toggle('bpp-active', tabId === currentTabId);
  });
};

//更新属性面板的 DOM 表示形式
PropertiesPanel.prototype.update = function (element) {
  var current = this._current;

  // no actual selection change(没有实际的选择更改)
  var needsCreate = true;

  if (typeof element === 'undefined') {
    //如果没有选择元素,则使用 BPMN 关系图的根元素生成属性面板
    element = this._canvas.getRootElement();
  }

  var newTabs = this._propertiesProvider.getTabs(element);

  if (current && current.element === element) {
    //看看我们是否可以重用现有的面板
    needsCreate = this._entriesChanged(current, newTabs);
  }

  if (needsCreate) {

    let activeTabId;
    if (current) {
      // 从现有面板获取活动选项卡,然后再将其删除
      var activeTabNode = domQuery('.bpp-properties-tab.bpp-active', current.panel);

      if (activeTabNode) {
        activeTabId = domAttr(activeTabNode, 'data-tab');
      }
      // 删除旧面板
      domRemove(current.panel);
    }

    this._current = this._create(element, newTabs);

    // 从删除面板或第一个选项卡激活已保存的活动选项卡
    (activeTabId) ? this.activateTab(activeTabId): this.activateTab(this._current.tabs[0]);
  }

  if (this._current) {
    // 确保正确的选项卡内容可见
    this._updateActivation(this._current);
  }

  this._emit('changed');
};

/**
 * 如果两个组中的一个具有不同于另一个组的条目, 则返回 true。
 *
 * @param  {Object} current
 * @param  {Object} newTabs
 * @return {Booelan}
 */
PropertiesPanel.prototype._entriesChanged = function (current, newTabs) {

  var oldEntryIds = keys(current.entries),
    newEntryIds = keys(extractEntries(newTabs));

  return !isEmpty(xor(oldEntryIds, newEntryIds));
};

PropertiesPanel.prototype._emit = function (event) {
  this._eventBus.fire('propertiesPanel.' + event, {
    panel: this,
    current: this._current
  });
};

PropertiesPanel.prototype._bindListeners = function (container) {

  // handles a change for a given event
  var handleChange = (event) => {

    // see if we handle a change inside a [data-entry] element.
    // if not, drop out
    var inputNode = event.delegateTarget,
      entryNode = domClosest(inputNode, '[data-entry]'),
      entryId, entry;

    // change from outside a [data-entry] element, simply ignore
    if (!entryNode) {
      return;
    }

    entryId = domAttr(entryNode, 'data-entry');
    entry = this.getEntry(entryId);

    var values = getFormControlValues(entryNode);

    if (event.type === 'change') {

      // - if the "data-on-change" attribute is present and a value is changed,
      //   then the associated action is performed.
      // - if the associated action returns "true" then an update to the business
      //   object is done
      // - if it does not return "true", then only the DOM content is updated
      var onChangeAction = domAttr(inputNode, 'data-on-change');

      if (onChangeAction) {
        var isEntryDirty = this.executeAction(entry, entryNode, onChangeAction, event);

        if (!isEntryDirty) {
          return this.update(this._current.element);
        }
      }
    }
    this.applyChanges(entry, values, entryNode);
    this.updateState(entry, entryNode);
  };

  // debounce update only elements that are target of key events,
  // i.e. INPUT and TEXTAREA. SELECTs will trigger an immediate update anyway.
  domDelegate.bind(container, 'input, textarea, [contenteditable]', 'input', debounce(handleChange, DEBOUNCE_DELAY));
  domDelegate.bind(container, 'input, textarea, select, [contenteditable]', 'change', handleChange);

  // handle key events
  domDelegate.bind(container, 'select', 'keydown', function (e) {

    // DEL
    if (e.keyCode === 46) {
      e.stopPropagation();
      e.preventDefault();
    }
  });

  domDelegate.bind(container, '[data-action]', 'click', (event) => {

    // triggers on all inputs
    var inputNode = event.delegateTarget,
      entryNode = domClosest(inputNode, '[data-entry]');

    var actionId = domAttr(inputNode, 'data-action'),
      entryId = domAttr(entryNode, 'data-entry');

    var entry = this.getEntry(entryId);

    var isEntryDirty = this.executeAction(entry, entryNode, actionId, event);

    if (isEntryDirty) {
      var values = getFormControlValues(entryNode);

      this.applyChanges(entry, values, entryNode);
    }

    this.updateState(entry, entryNode);
  });

  var handleInput = (event, element) => {
    // triggers on all inputs
    var inputNode = event.delegateTarget;

    var entryNode = domClosest(inputNode, '[data-entry]');

    // only work on data entries
    if (!entryNode) {
      return;
    }

    var eventHandlerId = domAttr(inputNode, 'data-blur'),
      entryId = domAttr(entryNode, 'data-entry');

    var entry = this.getEntry(entryId);

    var isEntryDirty = this.executeAction(entry, entryNode, eventHandlerId, event);

    if (isEntryDirty) {
      var values = getFormControlValues(entryNode);

      this.applyChanges(entry, values, entryNode);
    }

    this.updateState(entry, entryNode);
  }

  domDelegate.bind(container, '[data-blur]', 'blur', handleInput, true);

  // make tab links interactive
  domDelegate.bind(container, '.bpp-properties-tabs-links [data-tab-target]', 'click', (event) => {
    event.preventDefault();

    var delegateTarget = event.delegateTarget;

    var tabId = domAttr(delegateTarget, 'data-tab-target');

    // activate tab on link click
    this.activateTab(tabId);
  });

};

PropertiesPanel.prototype.updateState = function (entry, entryNode) {
  this.updateShow(entry, entryNode);
  this.updateDisable(entry, entryNode);
};

/**
 * Update the visibility of the entry node in the DOM
 */
PropertiesPanel.prototype.updateShow = function (entry, node) {

  var current = this._current;

  if (!current) {
    return;
  }

  var showNodes = domQueryAll('[data-show]', node) || [];

  forEach(showNodes, function (showNode) {

    var expr = domAttr(showNode, 'data-show');
    var fn = get(entry, expr);
    if (fn) {
      var scope = domClosest(showNode, '[data-scope]') || node;
      var shouldShow = fn(current.element, node, showNode, scope) || false;
      if (shouldShow) {
        domClasses(showNode).remove(HIDE_CLASS);
      } else {
        domClasses(showNode).add(HIDE_CLASS);
      }
    }
  });
};

/**
 * Evaluates a given function. If it returns true, then the
 * node is marked as "disabled".
 */
PropertiesPanel.prototype.updateDisable = function (entry, node) {
  var current = this._current;

  if (!current) {
    return;
  }

  var nodes = domQueryAll('[data-disable]', node) || [];

  forEach(nodes, function (currentNode) {
    var expr = domAttr(currentNode, 'data-disable');
    var fn = get(entry, expr);
    if (fn) {
      var scope = domClosest(currentNode, '[data-scope]') || node;
      var shouldDisable = fn(current.element, node, currentNode, scope) || false;
      domAttr(currentNode, 'disabled', shouldDisable ? '' : null);
    }
  });
};

PropertiesPanel.prototype.executeAction = function (entry, entryNode, actionId, event) {
  var current = this._current;

  if (!current) {
    return;
  }

  var fn = get(entry, actionId);
  if (fn) {
    var scopeNode = domClosest(event.target, '[data-scope]') || entryNode;
    return fn.apply(entry, [current.element, entryNode, event, scopeNode]);
  }
};

/**
 * Apply changes to the business object by executing a command
 */
PropertiesPanel.prototype.applyChanges = function (entry, values, containerElement) {

  var element = this._current.element;

  // ensure we only update the model if we got dirty changes
  if (valuesEqual(values, entry.oldValues)) {
    return;
  }

  var command = entry.set(element, values, containerElement);

  var commandToExecute;

  if (isArray(command)) {
    if (command.length) {
      commandToExecute = {
        cmd: 'properties-panel.multi-command-executor',
        context: flattenDeep(command)
      };
    }
  } else {
    commandToExecute = command;
  }

  if (commandToExecute) {
    this._commandStack.execute(commandToExecute.cmd, commandToExecute.context || {
      element: element
    });
  } else {
    this.update(element);
  }
};

/**
 * apply validation errors in the DOM and show or remove an error message near the entry node.
 */
PropertiesPanel.prototype.applyValidationErrors = function (validationErrors, entryNode) {

  var valid = true;

  var controlNodes = getFormControls(entryNode, true);

  forEach(controlNodes, function (controlNode) {

    var name = domAttr(controlNode, 'name') || domAttr(controlNode, 'data-name');

    var error = validationErrors && validationErrors[name];

    var errorMessageNode = domQuery('.bpp-error-message', controlNode.parentNode);

    if (error) {
      valid = false;

      if (!errorMessageNode) {
        errorMessageNode = domify('<div></div>');

        domClasses(errorMessageNode).add('bpp-error-message');

        // insert errorMessageNode after controlNode
        controlNode.parentNode.insertBefore(errorMessageNode, controlNode.nextSibling);
      }

      errorMessageNode.innerHTML = error;

      domClasses(controlNode).add('invalid');
    } else {
      domClasses(controlNode).remove('invalid');

      if (errorMessageNode) {
        controlNode.parentNode.removeChild(errorMessageNode);
      }
    }
  });

  return valid;
};

/**
 * Check if the entry contains valid input
 */
PropertiesPanel.prototype.validate = function (entry, values, entryNode) {
  var current = this._current;

  var valid = true;

  entryNode = entryNode || domQuery('[data-entry="' + entry.id + '"]', current.panel);

  if (values instanceof Array) {
    var listContainer = domQuery('[data-list-entry-container]', entryNode),
      listEntryNodes = listContainer.children || [];

    // create new elements
    for (var i = 0; i < values.length; i++) {
      var listValue = values[i];

      if (entry.validateListItem) {

        var validationErrors = entry.validateListItem(current.element, listValue, entryNode, i),
          listEntryNode = listEntryNodes[i];

        valid = this.applyValidationErrors(validationErrors, listEntryNode) && valid;
      }
    }
  } else {
    if (entry.validate) {
      this.validationErrors = entry.validate(current.element, values, entryNode);

      valid = this.applyValidationErrors(this.validationErrors, entryNode) && valid;
    }
  }

  return valid;
};

PropertiesPanel.prototype.getEntry = function (id) {
  return this._current && this._current.entries[id];
};

PropertiesPanel.prototype._create = function (element, tabs) {

  if (!element) {
    return null;
  }

  var containerNode = this._container;

  var panelNode = this._createPanel(element, tabs);

  containerNode.appendChild(panelNode);

  var entries = extractEntries(tabs);
  var groups = extractGroups(tabs);

  return {
    tabs: tabs,
    groups: groups,
    entries: entries,
    element: element,
    panel: panelNode
  };
};

/**
 * Update variable parts of the entry node on element changes.
 *
 * @param {djs.model.Base} element
 * @param {EntryDescriptor} entry
 * @param {Object} values
 * @param {HTMLElement} entryNode
 * @param {Number} idx
 */
PropertiesPanel.prototype._bindTemplate = function (element, entry, values, entryNode, idx) {

  var eventBus = this._eventBus;

  function isPropertyEditable(entry, propertyName) {
    return eventBus.fire('propertiesPanel.isPropertyEditable', {
      entry: entry,
      propertyName: propertyName,
      element: element
    });
  }

  var inputNodes = getPropertyPlaceholders(entryNode);

  forEach(inputNodes, function (node) {

    var name,
      newValue,
      editable;

    // we deal with an input element
    if ('value' in node || isContentEditable(node) === 'true') {
      name = domAttr(node, 'name') || domAttr(node, 'data-name');
      newValue = values[name];

      editable = isPropertyEditable(entry, name);
      if (editable && entry.editable) {
        editable = entry.editable(element, entryNode, node, name, newValue, idx);
      }

      domAttr(node, 'readonly', editable ? null : '');
      domAttr(node, 'disabled', editable ? null : '');

      // take full control over setting the value
      // and possibly updating the input in entry#setControlValue
      if (entry.setControlValue) {
        entry.setControlValue(element, entryNode, node, name, newValue, idx);
      } else if (isToggle(node)) {
        setToggleValue(node, newValue);
      } else if (isSelect(node)) {
        setSelectValue(node, newValue);
      } else {
        setInputValue(node, newValue);
      }
    }

    // we deal with some non-editable html element
    else {
      name = domAttr(node, 'data-value');
      newValue = values[name];
      if (entry.setControlValue) {
        entry.setControlValue(element, entryNode, node, name, newValue, idx);
      } else {
        setTextValue(node, newValue);
      }
    }
  });
};

// 进度001
// TODO(nikku): WTF freaking name? Change / clarify.
PropertiesPanel.prototype._updateActivation = function (current) {
  var eventBus = this._eventBus;

  var element = current.element;

  function isEntryVisible(entry) {
    return eventBus.fire('propertiesPanel.isEntryVisible', {
      entry: entry,
      element: element
    });
  }

  function isGroupVisible(group, element, groupNode) {
    if (typeof group.enabled === 'function') {
      return group.enabled(element, groupNode);
    } else {
      return true;
    }
  }

  function isTabVisible(tab, element) {
    if (typeof tab.enabled === 'function') {
      return tab.enabled(element);
    } else {
      return true;
    }
  }

  function toggleVisible(node, visible) {
    domClasses(node).toggle(HIDE_CLASS, !visible);
  }

  //检查活动选项卡是否可见，如果没有: 将第一个选项卡设置为活动选项卡
  var checkActiveTabVisibility = (node, visible) => {
    var isActive = domClasses(node).has('bpp-active');
    if (!visible && isActive) {
      this.activateTab(current.tabs[0]);
    }
  }

  function updateLabel(element, selector, text) {
    var labelNode = domQuery(selector, element);

    if (!labelNode) {
      return;
    }

    labelNode.textContent = text;
  }

  var panelNode = current.panel;

  forEach(current.tabs, (tab) => {

    var tabNode = domQuery('[data-tab=' + tab.id + ']', panelNode);
    var tabLinkNode = domQuery('[data-tab-target=' + tab.id + ']', panelNode).parentNode;

    var tabVisible = false;

    forEach(tab.groups, (group) => {

      var groupVisible = false;

      var groupNode = domQuery('[data-group=' + group.id + ']', tabNode);

      forEach(group.entries, (entry) => {

        var entryNode = domQuery('[data-entry="' + entry.id + '"]', groupNode);

        var entryVisible = isEntryVisible(entry);

        groupVisible = groupVisible || entryVisible;

        toggleVisible(entryNode, entryVisible);

        var values = 'get' in entry ? entry.get(element, entryNode) : {};

        if (values instanceof Array) {
          var listEntryContainer = domQuery('[data-list-entry-container]', entryNode);
          var existingElements = listEntryContainer.children || [];

          for (var i = 0; i < values.length; i++) {
            var listValue = values[i];
            var listItemNode = existingElements[i];
            if (!listItemNode) {
              listItemNode = domify(entry.createListEntryTemplate(listValue, i, listEntryContainer));
              listEntryContainer.appendChild(listItemNode);
            }
            domAttr(listItemNode, 'data-index', i);

            this._bindTemplate(element, entry, listValue, listItemNode, i);
          }

          var entriesToRemove = existingElements.length - values.length;

          for (var j = 0; j < entriesToRemove; j++) {
            // remove orphaned element
            listEntryContainer.removeChild(listEntryContainer.lastChild);
          }

        } else {
          this._bindTemplate(element, entry, values, entryNode);
        }

        // update conditionally visible elements
        this.updateState(entry, entryNode);
        this.validate(entry, values, entryNode);

        // remember initial state for later dirty checking
        entry.oldValues = getFormControlValues(entryNode);
      });

      if (typeof group.label === 'function') {
        updateLabel(groupNode, '.group-label', group.label(element, groupNode));
      }

      groupVisible = groupVisible && isGroupVisible(group, element, groupNode);

      tabVisible = tabVisible || groupVisible;

      toggleVisible(groupNode, groupVisible);
    });

    tabVisible = tabVisible && isTabVisible(tab, element);

    toggleVisible(tabNode, tabVisible);
    toggleVisible(tabLinkNode, tabVisible);

    checkActiveTabVisibility(tabNode, tabVisible);
  });

  // inject elements id into header
  updateLabel(panelNode, '[data-label-id]', getBusinessObject(element).id || '');
};

PropertiesPanel.prototype._createPanel = function (element, tabs) {
  var panelNode = domify('<div class="bpp-properties"></div>'),
    headerNode = domify('<div class="bpp-properties-header">' +
      '<div class="label" data-label-id></div>' +
      '<div class="search">' +
      '<input type="search" placeholder="Search for property" />' +
      '<button><span>Search</span></button>' +
      '</div>' +
      '</div>'),
    tabBarNode = domify('<div class="bpp-properties-tab-bar"></div>'),
    tabLinksNode = domify('<ul class="bpp-properties-tabs-links"></ul>'),
    tabContainerNode = domify('<div class="bpp-properties-tabs-container"></div>');

  panelNode.appendChild(headerNode);

  forEach(tabs, (tab, tabIndex) => {

    if (!tab.id) {
      throw new Error('tab must have an id');
    }

    var tabNode = domify('<div class="bpp-properties-tab" data-tab="' + tab.id + '"></div>'),
      tabLinkNode = domify('<li class="bpp-properties-tab-link">' +
        '<a href data-tab-target="' + tab.id + '">' + tab.label + '</a>' +
        '</li>');

    var groups = tab.groups;

    forEach(groups, (group) => {

      if (!group.id) {
        throw new Error('group must have an id');
      }

      var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
        '<span class="group-toggle"></span>' +
        '<span class="group-label">' + group.label + '</span>' +
        '</div>');

      // TODO(nre): use event delegation to handle that...
      groupNode.querySelector('.group-toggle').addEventListener('click', function (evt) {
        domClasses(groupNode).toggle('group-closed');
        evt.preventDefault();
        evt.stopPropagation();
      });
      groupNode.addEventListener('click', function (evt) {
        if (!evt.defaultPrevented && domClasses(groupNode).has('group-closed')) {
          domClasses(groupNode).remove('group-closed');
        }
      });

      forEach(group.entries, (entry) => {

        if (!entry.id) {
          throw new Error('entry must have an id');
        }

        var html = entry.html;

        if (typeof html === 'string') {
          html = domify(html);
        }

        // unwrap jquery
        if (html.get && html.constructor.prototype.jquery) {
          html = html.get(0);
        }

        var entryNode = domify('<div class="bpp-properties-entry" data-entry="' + entry.id + '"></div>');

        forEach(entry.cssClasses || [], function (cssClass) {
          domClasses(entryNode).add(cssClass);
        });

        entryNode.appendChild(html);

        groupNode.appendChild(entryNode);

        // update conditionally visible elements
        this.updateState(entry, entryNode);
      });

      tabNode.appendChild(groupNode);
    });

    tabLinksNode.appendChild(tabLinkNode);
    tabContainerNode.appendChild(tabNode);
  });

  tabBarNode.appendChild(tabLinksNode);

  panelNode.appendChild(tabBarNode);
  panelNode.appendChild(tabContainerNode);

  return panelNode;
};
