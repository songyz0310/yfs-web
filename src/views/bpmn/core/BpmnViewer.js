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
import SignavioCompatModule from "bpmn-js-signavio-compat";

//重写PaletteModule，以实现工具栏改进
import PaletteModule from './features/palette';

import bpmnXml from "../support/bpmn-default";


//该类重写 bpmn-js/lib/Modeler
export default function BpmnViewer(canvas, properties) {

    if (!canvas) {
        throw new Error("创建BpmnViewer异常,缺少必要的canvas参数");
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
        // 添加控制板
        propertiesPanel: {
            parent: properties
        },
        additionalModules: [
            //坐标原点
            DiagramOriginModule,
            //子流程扩展
            SignavioCompatModule,
            // 右边工具栏属性
            propertiesProviderModule,
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

inherits(BpmnViewer, Viewer);

BpmnViewer.Viewer = Viewer;
BpmnViewer.NavigatedViewer = NavigatedViewer;

/**
 * Create a new diagram to start modeling.
 *
 * @param {Function} [done]
 */
BpmnViewer.prototype.createDiagram = function(done) {
    return this.importXML(bpmnXml, done);
};

BpmnViewer.prototype.importBpmnXml = function(bpmnXml) {
    this.importXML(bpmnXml, (err, parseWarnings) => {
        if (err)
            console.error(err);

        if (parseWarnings.length > 0)
            console.error(parseWarnings);
    });
}

BpmnViewer.prototype.getBpmnXml = function() {
    let bpmnXml;
    this.saveXML((err, xml, definitions) => {
        bpmnXml = xml;
    });
    return bpmnXml;
}
BpmnViewer.prototype.getBpmnSvg = function() {
    let bpmnSvg
    this.saveSVG((err, svg) => {
        bpmnSvg = svg;
    });
    return bpmnSvg;
}

BpmnViewer.prototype.test = function() {

    console.info("进入测试方法")

    this._modules = [];

}

/**
 * Create a moddle instance, attaching ids to it.
 *
 * @param {Object} options
 */
BpmnViewer.prototype._createModdle = function(options) {
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
BpmnViewer.prototype._collectIds = function(definitions, context) {

    var moddle = definitions.$model,
        ids = moddle.ids,
        id;

    // remove references from previous import
    ids.clear();

    for (id in context.elementsById) {
        ids.claim(id, context.elementsById[id]);
    }
};

//交互模块
BpmnViewer.prototype._interactionModules = [
    // non-modeling components
    KeyboardMoveModule, //通过键盘（Ctrl+箭头）控制画布移动
    MoveCanvasModule, //通过鼠标拖动控制画布移动
    TouchModule, //提供触控支持
    ZoomScrollModule //通过鼠标滚轮进行放大缩小（未生效）
];

//建模模块
BpmnViewer.prototype._modelingModules = [
    // modeling components
    AlignElementsModule, //对齐模块？
    AutoPlaceModule, //通过快捷菜单创建元素时自动放置
    AutoScrollModule, //如果当前光标靠近边框则自动启动画布滚动
    AutoResizeModule, //此模块是自动调整父 BPMN 元素大小的提供程序
    BendpointsModule, //向连接添加可编辑折弯点的服务。
    ContextPadModule, //上下文模块？
    CopyPasteModule, //复制粘贴节点
    DistributeElementsModule, //分发元素模块？
    EditorActionsModule, //注册并执行 BPMN 特定编辑器操作？(貌似与下边的键盘绑定有依赖关系)
    KeyboardModule, //BPMN 2.0 特定键盘绑定。
    KeyboardMoveSelectionModule, //键盘控制选中元素移动（开启之后浏览器内存涨的较快）
    LabelEditingModule, //节点名称编辑模块
    ModelingModule, //基础建模模块
    MoveModule, //开启拖拽移动节点
    PaletteModule, //BPMN 2.0 元素的调色板提供程序。(左侧工具栏相关设置)
    ReplacePreviewModule, //替换上下文中可替换的所有元素的视觉对象？
    ResizeModule, //控制节点大小？
    SnappingModule, //捕捉模块(如果池是在流程图内创建的, 则 BPMN 特定的捕捉功能会捕捉到流程元素上)
    SearchModule //提供搜索 BPMN 元素的能力(Ctrl+F开启搜索框)
];


// modules the modeler is composed of
//
// - viewer modules
// - interaction modules
// - modeling modules

BpmnViewer.prototype._modules = [].concat(
    BpmnViewer.prototype._modules,
    BpmnViewer.prototype._interactionModules,
    BpmnViewer.prototype._modelingModules)