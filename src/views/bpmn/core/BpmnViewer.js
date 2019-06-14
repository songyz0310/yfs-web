import inherits from 'inherits';

import Ids from 'ids';

import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer";

import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import ModelingModule from 'bpmn-js/lib/features/modeling';
import PropertiesPanelModule from "bpmn-js-properties-panel";
import PropertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import CamundaModdleExtenstion from "camunda-bpmn-moddle/resources/camunda";

import DiagramOriginModule from "diagram-js-origin";

import bpmnXml from "../support/bpmn-default";

/**
 * 该类重写 bpmn - js / lib / Modeler
 * 
 * @param {Document} canvas 
 * @param {String} properties 
 */
export default function BpmnViewer(canvas, properties) {

  if (!canvas) {
    throw new Error("创建BpmnViewer异常,缺少必要的canvas参数");
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

inherits(BpmnViewer, Viewer);

BpmnViewer.Viewer = Viewer;
BpmnViewer.NavigatedViewer = NavigatedViewer;

/**
 * Create a new diagram to start modeling.
 *
 * @param {Function} [done]
 */
BpmnViewer.prototype.createDiagram = function (done) {
  return this.importXML(bpmnXml, done);
};

/**
 * 导入bpmn xml 
 * @param {String} bpmnXml
 */
BpmnViewer.prototype.importBpmnXml = function (bpmnXml) {
  this.importXML(bpmnXml, (err, parseWarnings) => {
    if (err)
      console.error(err);

    if (parseWarnings.length > 0)
      console.error(parseWarnings);
  });
}

BpmnViewer.prototype.getBpmnXml = function () {
  let bpmnXml;
  this.saveXML((err, xml, definitions) => {
    bpmnXml = xml;
  });
  return bpmnXml;
}

BpmnViewer.prototype.getBpmnSvg = function () {
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
BpmnViewer.prototype._createModdle = function (options) {
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
BpmnViewer.prototype._collectIds = function (definitions, context) {

  var moddle = definitions.$model,
    ids = moddle.ids,
    id;

  // remove references from previous import
  ids.clear();

  for (id in context.elementsById) {
    ids.claim(id, context.elementsById[id]);
  }
};

BpmnViewer.prototype._modelingModules = [
  ModelingModule, //基础建模模块
  KeyboardMoveModule, //通过键盘（Ctrl+箭头）控制画布移动
  MoveCanvasModule, //通过鼠标拖动控制画布移动
  TouchModule, //提供触控支持
  ZoomScrollModule, //通过鼠标滚轮进行放大缩小
  DiagramOriginModule, //开启坐标原点模块
  PropertiesProviderModule, // 右边工具栏属性
  PropertiesPanelModule, // 右边的工具栏模块
];

BpmnViewer.prototype._modules = [].concat(
  BpmnViewer.prototype._modules,
  BpmnViewer.prototype._modelingModules)
