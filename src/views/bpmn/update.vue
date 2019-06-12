<template>
  <div ref="content" class="containers1">
    <div ref="canvas" class="canvas">这里是控制台</div>
    <input type="number" @input="input" v-model.number="nb">
    <span>个数：{{size}}</span>
  </div>
</template>
<script>
// 引入相关的依赖
import BpmnJS from "bpmn-js";
import axios from "axios";

export default {
  data() {
    return {
      nb: 0,
      size: 0,
      canvas: null,
      container: null,
      viewer1: null,
      bpmnSvg: "",
      bpmnXml:
        '<?xml version="1.0" encoding="UTF-8"?>\r\n' +
        '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\r\n' +
        '  <bpmn2:process id="Process_1" isExecutable="true">\r\n' +
        '    <bpmn2:startEvent id="StartEvent_1">\r\n' +
        "      <bpmn2:outgoing>SequenceFlow_0ijrl9i</bpmn2:outgoing>\r\n" +
        "    </bpmn2:startEvent>\r\n" +
        '    <bpmn2:userTask id="Task_1jkcjs0" name="接单">\r\n' +
        "      <bpmn2:incoming>SequenceFlow_0ijrl9i</bpmn2:incoming>\r\n" +
        "      <bpmn2:outgoing>SequenceFlow_1ez1gm4</bpmn2:outgoing>\r\n" +
        "    </bpmn2:userTask>\r\n" +
        '    <bpmn2:sequenceFlow id="SequenceFlow_0ijrl9i" sourceRef="StartEvent_1" targetRef="Task_1jkcjs0" />\r\n' +
        '    <bpmn2:sequenceFlow id="SequenceFlow_1ez1gm4" sourceRef="Task_1jkcjs0" targetRef="Task_15k6dio" />\r\n' +
        '    <bpmn2:userTask id="Task_15k6dio" name="预约">\r\n' +
        "      <bpmn2:incoming>SequenceFlow_1ez1gm4</bpmn2:incoming>\r\n" +
        "    </bpmn2:userTask>\r\n" +
        "  </bpmn2:process>\r\n" +
        '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\r\n' +
        '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\r\n' +
        '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\r\n' +
        '        <dc:Bounds x="107" y="179" width="36" height="36" />\r\n' +
        "      </bpmndi:BPMNShape>\r\n" +
        '      <bpmndi:BPMNShape id="Task_1jkcjs0_di" bpmnElement="Task_1jkcjs0">\r\n' +
        '        <dc:Bounds x="192" y="255" width="100" height="80" />\r\n' +
        "      </bpmndi:BPMNShape>\r\n" +
        '      <bpmndi:BPMNEdge id="SequenceFlow_0ijrl9i_di" bpmnElement="SequenceFlow_0ijrl9i">\r\n' +
        '        <di:waypoint x="143" y="197" />\r\n' +
        '        <di:waypoint x="168" y="197" />\r\n' +
        '        <di:waypoint x="168" y="295" />\r\n' +
        '        <di:waypoint x="192" y="295" />\r\n' +
        "      </bpmndi:BPMNEdge>\r\n" +
        '      <bpmndi:BPMNEdge id="SequenceFlow_1ez1gm4_di" bpmnElement="SequenceFlow_1ez1gm4">\r\n' +
        '        <di:waypoint x="292" y="295" />\r\n' +
        '        <di:waypoint x="312" y="295" />\r\n' +
        '        <di:waypoint x="312" y="197" />\r\n' +
        '        <di:waypoint x="340" y="197" />\r\n' +
        "      </bpmndi:BPMNEdge>\r\n" +
        '      <bpmndi:BPMNShape id="UserTask_1veeyop_di" bpmnElement="Task_15k6dio">\r\n' +
        '        <dc:Bounds x="340" y="157" width="100" height="80" />\r\n' +
        "      </bpmndi:BPMNShape>\r\n" +
        "    </bpmndi:BPMNPlane>\r\n" +
        "  </bpmndi:BPMNDiagram>\r\n" +
        "</bpmn2:definitions>"
    };
  },
  mounted() {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content;
    // 获取到属性ref为“canvas”的dom节点
    this.canvas = this.$refs.canvas;

    this.viewer1 = new BpmnJS();
    this.viewer1.attachTo(".canvas");

    this.viewer1.importXML(this.bpmnXml, err => {
      if (err) {
        console.log("error rendering", err);
      } else {
        this.viewer1.get("canvas").zoom("fit-viewport");
      }
    });

    axios
      .get(
        "http://127.0.0.1:9200/_count",
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        console.info(response)
      })
      .catch(err2 => {
        console.info(err2);
        this.$notify.error({
          title: "错误",
          message: "流程初始化异常",
          position: "bottom-right"
        });
      });
  },
  methods: {
    input() {
      console.info(this.nb);
    }
  }
};
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "bpmn-js/dist/assets/diagram-js.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
/*右边工具栏样式*/
@import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
.containers {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  height: 90%;
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
  & > li {
    display: inline-block;
    margin: 5px;
    & > a {
      color: #999;
      background: #eee;
      cursor: not-allowed;
      padding: 8px;
      border: 1px solid #ccc;
      &.active {
        color: #333;
        background: #fff;
        cursor: pointer;
      }
    }
  }
}
.bpp-properties-panel input,
.bpp-properties-panel button,
.bpp-properties-panel textarea,
.bpp-properties-panel [contenteditable] {
  padding: 2px 5px;
  line-height: 25px;
}
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
