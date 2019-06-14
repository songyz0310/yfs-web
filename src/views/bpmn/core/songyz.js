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

import PropertiesPanelModule from "bpmn-js-properties-panel";
import PropertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import DiagramOriginModule from "diagram-js-origin";
import SignavioCompatModule from "bpmn-js-signavio-compat";


DiagramOriginModule, //开启坐标原点模块
SignavioCompatModule, //子流程扩展
PropertiesProviderModule, // 右边工具栏属性
PropertiesPanelModule, // 右边的工具栏模块



//交互模块
_interactionModules = [
  // non-modeling components
  KeyboardMoveModule, //通过键盘（Ctrl+箭头）控制画布移动
  MoveCanvasModule, //通过鼠标拖动控制画布移动
  TouchModule, //提供触控支持
  ZoomScrollModule //通过鼠标滚轮进行放大缩小
];

//建模模块
_modelingModules = [
  // modeling components
  AlignElementsModule, //对齐模块？
  AutoPlaceModule, //通过快捷菜单创建元素时自动放置
  AutoScrollModule, //如果当前选中了元素且光标靠近边框时则自动启动画布滚动
  AutoResizeModule, //此模块是自动调整父 BPMN 元素大小的提供程序
  BendpointsModule, //向连接添加可编辑折弯点的服务。
  ContextPadModule, //节点的快捷菜单模块
  CopyPasteModule, //复制粘贴节点
  DistributeElementsModule, //分发元素模块？
  EditorActionsModule, //注册并执行 BPMN 特定编辑器操作？(貌似与下边的键盘绑定有依赖关系)
  KeyboardModule, //BPMN 2.0 特定键盘绑定。
  SearchModule, //提供搜索 BPMN 元素的能力(Ctrl+F开启搜索框)
  KeyboardMoveSelectionModule, //键盘控制选中元素移动（开启之后浏览器内存涨的较快）
  LabelEditingModule, //节点名称编辑模块
  ModelingModule, //基础建模模块
  MoveModule, //开启拖拽移动节点
  PaletteProvider, //BPMN 2.0 元素的调色板提供程序。(左侧工具栏相关设置)
  ReplacePreviewModule, //替换上下文中可替换的所有元素的视觉对象？
  ResizeModule, //控制节点大小？
  SnappingModule, //捕捉模块(如果池是在流程图内创建的, 则 BPMN 特定的捕捉功能会捕捉到流程元素上)
];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

_modules = [].concat(
  _modules,
  _interactionModules,
  _modelingModules)
