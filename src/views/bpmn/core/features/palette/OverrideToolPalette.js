import {
    isFunction,
    isArray,
    forEach
} from 'min-dash';

import {
    domify,
    query as domQuery,
    attr as domAttr,
    clear as domClear,
    classes as domClasses,
    matches as domMatches,
    delegate as domDelegate,
    event as domEvent
} from 'min-dom';

import Palette from 'diagram-js/lib/features/palette/Palette';

import tooltip from '../../../tooltip';

Palette.prototype._update = function() {

    console.info("重写方法实现");

    var entriesContainer = domQuery('.djs-palette-entries', this._container),
        entries = this._entries = this.getEntries();

    domClear(entriesContainer);

    forEach(entries, function(entry, id) {

        var grouping = entry.group || 'default';

        var container = domQuery('[data-group=' + grouping + ']', entriesContainer);
        if (!container) {
            container = domify('<div class="group" data-group="' + grouping + '"></div>');
            entriesContainer.appendChild(container);
        }

        var html = entry.html || (
            entry.separator ?
            '<hr class="separator" />' :
            '<div class="entry" draggable="true"></div>');

        var control = domify(html);
        container.appendChild(control);

        if (!entry.separator) {
            domAttr(control, 'data-action', id);

            if (entry.title) {
                domAttr(control, 'data-toggle', "tooltip");
                domAttr(control, 'data-placement', "right");
                domAttr(control, 'title', entry.title);
            }

            if (entry.className) {
                addClasses(control, entry.className);
            }

            if (entry.imageUrl) {
                control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
            }
        }
    });

    tooltip('[data-toggle="tooltip"]');

    // open after update
    this.open();
};

function addClasses(element, classNames) {

    var classes = domClasses(element);

    var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
    actualClassNames.forEach(function(cls) {
        classes.add(cls);
    });
}