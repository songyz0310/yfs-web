import {
  assign,
  isFunction,
  isArray,
  forEach,
  isDefined
} from 'min-dash';

import {
  delegate as domDelegate,
  event as domEvent,
  attr as domAttr,
  query as domQuery,
  classes as domClasses,
  domify as domify
} from 'min-dom';

import ContextPad from 'diagram-js/lib/features/context-pad/ContextPad';


import tooltip from '../../../tooltip';

var entrySelector = '.entry';

ContextPad.prototype._updateAndOpen = function (element) {

  // debugger
  //重写快捷菜单提示渲染方法

  var entries = this.getEntries(element),
    pad = this.getPad(element),
    html = pad.html;

  forEach(entries, function (entry, id) {
    var grouping = entry.group || 'default',
      control = domify(entry.html || '<div class="entry" draggable="true"></div>'),
      container;

    domAttr(control, 'data-action', id);

    container = domQuery('[data-group=' + grouping + ']', html);
    if (!container) {
      container = domify('<div class="group" data-group="' + grouping + '"></div>');
      html.appendChild(container);
    }

    container.appendChild(control);

    if (entry.className) {
      addClasses(control, entry.className);
    }

    if (entry.title) {
      domAttr(control, 'title', entry.title);
      addClasses(control, "bpmn-node-tooltip");
    }

    if (entry.imageUrl) {
      control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
    }
  });

  tooltip({
    selector: '.bpmn-node-tooltip',
    offsetX: 15,
    offsetY: -30,
  });

  domClasses(html).add('open');

  this._current = {
    element: element,
    pad: pad,
    entries: entries
  };

  this._eventBus.fire('contextPad.open', {
    current: this._current
  });
};


ContextPad.prototype.getPad = function (element) {
  if (this.isOpen()) {
    return this._current.pad;
  }

  var self = this;

  var overlays = this._overlays;

  var html = domify('<div class="djs-context-pad"></div>');

  var overlaysConfig = assign({
    html: html
  }, this._overlaysConfig);

  domDelegate.bind(html, entrySelector, 'click', function (event) {
    self.trigger('click', event);
  });

  domDelegate.bind(html, entrySelector, 'dragstart', function (event) {
    self.trigger('dragstart', event);
  });

  // stop propagation of mouse events
  domEvent.bind(html, 'mousedown', function (event) {
    event.stopPropagation();
  });

  this._overlayId = overlays.add(element, 'context-pad', overlaysConfig);

  var pad = overlays.get(this._overlayId);

  this._eventBus.fire('contextPad.create', {
    element: element,
    pad: pad
  });

  return pad;
};


// helpers //////////////////////

function addClasses(element, classNames) {

  var classes = domClasses(element);

  var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
  actualClassNames.forEach(function (cls) {
    classes.add(cls);
  });
}
