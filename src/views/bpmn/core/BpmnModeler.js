import inherits from 'inherits';

import BaseModeler from 'bpmn-js/lib/BaseModeler';

import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';

import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';
import AutoPlaceModule from 'bpmn-js/lib/features/auto-place';
import AutoResizeModule from 'bpmn-js/lib/features/auto-resize';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ConnectModule from 'diagram-js/lib/features/connect';
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview';
import ContextPadModule from 'bpmn-js/lib/features/context-pad';
import CopyPasteModule from 'bpmn-js/lib/features/copy-paste';
import CreateModule from 'diagram-js/lib/features/create';
import DistributeElementsModule from 'bpmn-js/lib/features/distribute-elements';
import EditorActionsModule from 'bpmn-js/lib/features/editor-actions';
import GridSnappingModule from 'bpmn-js/lib/features/grid-snapping';
import InteractionEventsModule from 'bpmn-js/lib/features/interaction-events';
import KeyboardModule from 'bpmn-js/lib/features/keyboard';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LabelEditingModule from 'bpmn-js/lib/features/label-editing';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import PaletteModule from 'bpmn-js/lib/features/palette';
import ReplacePreviewModule from 'bpmn-js/lib/features/replace-preview';
import ResizeModule from 'diagram-js/lib/features/resize';
import SnappingModule from 'bpmn-js/lib/features/snapping';
import SearchModule from 'bpmn-js/lib/features/search';

import PropertiesPanelModule from 'bpmn-js-properties-panel';
import PropertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import CamundaModdleExtenstion from "camunda-bpmn-moddle/resources/camunda";
import DiagramOriginModule from "diagram-js-origin";
import SignavioCompatModule from "bpmn-js-signavio-compat";

import i18nTranslateModule from "./i18nTranslateModule";
import emptyBpmn from "../resources/empty.bpmn";

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
      PropertiesPanelModule,
      //国际化
      i18nTranslateModule
    ],
    moddleExtensions: {
      camunda: CamundaModdleExtenstion
    }
  };

  BaseModeler.call(this, options);

  this.importBpmnXml(emptyBpmn);
}

inherits(BpmnModeler, BaseModeler);

BpmnModeler.Viewer = Viewer;
BpmnModeler.NavigatedViewer = NavigatedViewer;


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
  ConnectModule,
  ConnectionPreviewModule,
  ContextPadModule,
  CopyPasteModule,
  CreateModule,
  DistributeElementsModule,
  EditorActionsModule,
  GridSnappingModule,
  InteractionEventsModule,
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
  Viewer.prototype._modules,
  BpmnModeler.prototype._interactionModules,
  BpmnModeler.prototype._modelingModules
);
