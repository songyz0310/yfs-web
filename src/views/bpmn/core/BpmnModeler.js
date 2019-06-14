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

import PropertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import CamundaModdleExtenstion from "camunda-bpmn-moddle/resources/camunda";
import DiagramOriginModule from "diagram-js-origin";
import SignavioCompatModule from "bpmn-js-signavio-compat";

import bpmnXml from "../support/bpmn-default";

//重写，以实现工具栏(图标个数)
import ModelerPaletteModule from './override/module/PaletteProvider';
//重写，以实现控制属性面板
import ModelerPropertiesPanelModule from "./override/module/ModelerPropertiesPanelModule";
//重写，以实现工具栏，提示框样式修改
import "./override/html/TooltipPalette";
//重写，以实现快捷菜单（图标个数）
import "./override/provider/ContextPadPalette";
//重写，以实现快捷菜单，提示框样式修改
import "./override/html/ContextPad";


/**
 * 该类重写 bpmn - js / lib / Modeler
 * 
 * @param {Document} canvas 
 * @param {String} properties 
 */
export default function BpmnModeler(canvas, properties) {

  if (!canvas) {
    throw new Error("创建BpmnModeler异常,缺少必要的canvas参数");
  }

  properties = properties || "#js-properties-panel";

  let options = {
    container: canvas,
    keyboard: {
      bindTo: document
    },
    // 添加控制板
    propertiesPanel: {
      parent: properties
    },
    additionalModules: [
      // 左边工具栏以及节点
      PropertiesProviderModule,
      //拖拽原点
      DiagramOriginModule,
      //子流程扩展
      SignavioCompatModule,
      // 右边的工具栏
      ModelerPropertiesPanelModule
    ],
    moddleExtensions: {
      camunda: CamundaModdleExtenstion
    }
  };

  Viewer.call(this, options);

  // hook ID collection into the modeler
  this.on('import.parse.complete', function (event) {
    if (!event.error) {
      this._collectIds(event.definitions, event.context);
    }
  }, this);

  this.on('diagram.destroy', function () {
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
BpmnModeler.prototype.createDiagram = function (done) {
  return this.importXML(bpmnXml, done);
};

/**
 * 导入bpmn xml 
 * @param {String} bpmnXml
 */
BpmnModeler.prototype.importBpmnXml = function (bpmnXml) {
  this.importXML(bpmnXml, (err, parseWarnings) => {
    if (err)
      console.error(err);

    if (parseWarnings.length > 0)
      console.error(parseWarnings);
  });
}

BpmnModeler.prototype.getBpmnXml = function () {
  let bpmnXml;
  this.saveXML((err, xml, definitions) => {
    bpmnXml = xml;
  });
  return bpmnXml;
}

BpmnModeler.prototype.getBpmnSvg = function () {
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
BpmnModeler.prototype._createModdle = function (options) {
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
BpmnModeler.prototype._collectIds = function (definitions, context) {

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
  ModelerPaletteModule,
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
