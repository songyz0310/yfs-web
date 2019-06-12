import inherits from 'inherits';


import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import DiagramOriginModule from "diagram-js-origin";
import CliModule from "bpmn-js-cli";
import SignavioCompatModule from "bpmn-js-signavio-compat";

import PaletteProvider from './paletteProvider';


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

    Modeler.call(this, options);

    this.on("commandStack.changed", () => {
        let bpmnSvg, bpmnXml;
        this.saveSVG((err, svg) => {
            bpmnSvg = svg;
        });

        this.saveXML((err, xml, definitions) => {
            console.info(xml)
            bpmnXml = xml;
        });

        this.onChange(bpmnXml, bpmnSvg);
    });


}

inherits(BpmnModeler, Modeler);

// debugger;
for (const key in BpmnModeler.prototype.__proto__) {
    let array = BpmnModeler.prototype.__proto__[key];
    if (array instanceof Array) {
        array.forEach(item => {
            if (item.paletteProvider) {

                item.paletteProvider[1] = PaletteProvider;
                console.info(item)
            }
        });
    }
}


BpmnModeler.prototype.importBpmnXml = function(bpmnXml) {
    this.importXML(bpmnXml, (err, parseWarnings) => {
        if (err)
            console.error(err);

        if (parseWarnings.length > 0)
            console.error(parseWarnings);
    });
}
BpmnModeler.prototype.onChange = function(bpmnXml, bpmnSvg) {
    console.info("触发默认变更事件")
}