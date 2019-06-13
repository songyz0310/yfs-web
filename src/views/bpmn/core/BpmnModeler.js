import inherits from 'inherits';

import Ids from 'ids';

import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer";

import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';

import AutoPlaceModule from 'bpmn-js/lib/features/auto-place';
import AutoResizeModule from 'bpmn-js/lib/features/auto-resize';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ContextPadModule from 'bpmn-js/lib/features/context-pad';
import CopyPasteModule from 'bpmn-js/lib/features/copy-paste';
import DistributeElementsModule from 'bpmn-js/lib/features/distribute-elements';
import EditorActionsModule from 'bpmn-js/lib/features/editor-actions';
import KeyboardModule from 'bpmn-js/lib/features/keyboard';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LabelEditingModule from 'bpmn-js/lib/features/label-editing';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import ReplacePreviewModule from 'bpmn-js/lib/features/replace-preview';
import ResizeModule from 'diagram-js/lib/features/resize';
import SnappingModule from 'bpmn-js/lib/features/snapping';
import SearchModule from 'bpmn-js/lib/features/search';

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import DiagramOriginModule from "diagram-js-origin";
import CliModule from "bpmn-js-cli";
import SignavioCompatModule from "bpmn-js-signavio-compat";

//重写PaletteModule，以实现工具栏改进
import PaletteModule from './features/palette';

import "./features/palette/OverrideToolPalette";

import bpmnXml from "../support/bpmn-default";

//该类重写 bpmn-js/lib/Modeler
export default function BpmnModeler(canvas, properties) {

    if (!canvas) {
        throw new Error("创建BpmnModeler异常,缺少必要的canvas参数");
    }

    if (typeof canvas == "string") {
        canvas = document.querySelector(canvas);
    }

    properties = properties || "#js-properties-panel";

    // 建模，官方文档这里讲的很详细
    let options = {
        container: canvas,
        keyboard: {
            bindTo: document
        },
        cli: {
            bindTo: "cli"
        },
        // 添加控制板
        propertiesPanel: {
            parent: properties
        },
        additionalModules: [
            // 左边工具栏以及节点
            propertiesProviderModule,
            //拖拽原点
            DiagramOriginModule,
            //命令扩展
            CliModule,
            //子流程扩展
            SignavioCompatModule,
            // 右边的工具栏
            propertiesPanelModule
        ],
        moddleExtensions: {
            camunda: camundaModdleDescriptor
        }
    };

    Viewer.call(this, options);

    // hook ID collection into the modeler
    this.on('import.parse.complete', function(event) {
        if (!event.error) {
            this._collectIds(event.definitions, event.context);
        }
    }, this);

    this.on('diagram.destroy', function() {
        this.get('moddle').ids.clear();
    }, this);
}

inherits(BpmnModeler, Viewer);

BpmnModeler.Viewer = Viewer;
BpmnModeler.NavigatedViewer = NavigatedViewer;

/**
 * Create a new diagram to start modeling.
 *
 * @param {Function} [done]
 */
BpmnModeler.prototype.createDiagram = function(done) {
    return this.importXML(bpmnXml, done);
};

BpmnModeler.prototype.importBpmnXml = function(bpmnXml) {
    this.importXML(bpmnXml, (err, parseWarnings) => {
        if (err)
            console.error(err);

        if (parseWarnings.length > 0)
            console.error(parseWarnings);
    });
}

BpmnModeler.prototype.getBpmnXml = function() {
    let bpmnXml;
    this.saveXML((err, xml, definitions) => {
        bpmnXml = xml;
    });
    return bpmnXml;
}
BpmnModeler.prototype.getBpmnSvg = function() {
    let bpmnSvg
    this.saveSVG((err, svg) => {
        bpmnSvg = svg;
    });
    return bpmnSvg;
}

/**
 * Create a moddle instance, attaching ids to it.
 *
 * @param {Object} options
 */
BpmnModeler.prototype._createModdle = function(options) {
    var moddle = Viewer.prototype._createModdle.call(this, options);

    // attach ids to moddle to be able to track
    // and validated ids in the BPMN 2.0 XML document
    // tree
    moddle.ids = new Ids([32, 36, 1]);

    return moddle;
};

/**
 * Collect ids processed during parsing of the
 * definitions object.
 *
 * @param {ModdleElement} definitions
 * @param {Context} context
 */
BpmnModeler.prototype._collectIds = function(definitions, context) {

    var moddle = definitions.$model,
        ids = moddle.ids,
        id;

    // remove references from previous import
    ids.clear();

    for (id in context.elementsById) {
        ids.claim(id, context.elementsById[id]);
    }
};

BpmnModeler.prototype._interactionModules = [
    // non-modeling components
    KeyboardMoveModule,
    MoveCanvasModule,
    TouchModule,
    ZoomScrollModule
];

BpmnModeler.prototype._modelingModules = [
    // modeling components
    AlignElementsModule,
    AutoPlaceModule,
    AutoScrollModule,
    AutoResizeModule,
    BendpointsModule,
    ContextPadModule,
    CopyPasteModule,
    DistributeElementsModule,
    EditorActionsModule,
    KeyboardModule,
    KeyboardMoveSelectionModule,
    LabelEditingModule,
    ModelingModule,
    MoveModule,
    PaletteModule,
    ReplacePreviewModule,
    ResizeModule,
    SnappingModule,
    SearchModule
];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

BpmnModeler.prototype._modules = [].concat(
    BpmnModeler.prototype._modules,
    BpmnModeler.prototype._interactionModules,
    BpmnModeler.prototype._modelingModules);