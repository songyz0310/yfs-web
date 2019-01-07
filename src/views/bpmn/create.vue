<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas"/>
    <div id="js-properties-panel" class="panel"/>
    <el-row style="position: absolute;top: 10px;right: 310px;">
      <el-button round @click="validate(0)">校验流程</el-button>
      <el-button type="danger" round @click="validate(1)">校验流程</el-button>
    </el-row>
  </div>
</template>
<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import axios from 'axios'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

export default {
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      processName: '',
      bpmnXml:
        '<?xml version="1.0" encoding="UTF-8"?>\r\n' +
        '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\r\n' +
        '  <bpmn2:process id="Process_1" isExecutable="false">\r\n' +
        '    <bpmn2:startEvent id="StartEvent_1">\r\n' +
        '      <bpmn2:outgoing>SequenceFlow_0ijrl9i</bpmn2:outgoing>\r\n' +
        '    </bpmn2:startEvent>\r\n' +
        '    <bpmn2:task id="Task_1jkcjs0" name="第一步">\r\n' +
        '      <bpmn2:incoming>SequenceFlow_0ijrl9i</bpmn2:incoming>\r\n' +
        '      <bpmn2:outgoing>SequenceFlow_0d34fwt</bpmn2:outgoing>\r\n' +
        '    </bpmn2:task>\r\n' +
        '    <bpmn2:sequenceFlow id="SequenceFlow_0ijrl9i" sourceRef="StartEvent_1" targetRef="Task_1jkcjs0" />\r\n' +
        '    <bpmn2:endEvent id="EndEvent_0hhkhlx">\r\n' +
        '      <bpmn2:incoming>SequenceFlow_0d34fwt</bpmn2:incoming>\r\n' +
        '    </bpmn2:endEvent>\r\n' +
        '    <bpmn2:sequenceFlow id="SequenceFlow_0d34fwt" sourceRef="Task_1jkcjs0" targetRef="EndEvent_0hhkhlx" />\r\n' +
        '  </bpmn2:process>\r\n' +
        '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\r\n' +
        '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\r\n' +
        '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\r\n' +
        '        <dc:Bounds x="175" y="179" width="36" height="36" />\r\n' +
        '      </bpmndi:BPMNShape>\r\n' +
        '      <bpmndi:BPMNShape id="Task_1jkcjs0_di" bpmnElement="Task_1jkcjs0">\r\n' +
        '        <dc:Bounds x="256" y="157" width="100" height="80" />\r\n' +
        '      </bpmndi:BPMNShape>\r\n' +
        '      <bpmndi:BPMNEdge id="SequenceFlow_0ijrl9i_di" bpmnElement="SequenceFlow_0ijrl9i">\r\n' +
        '        <di:waypoint x="211" y="197" />\r\n' +
        '        <di:waypoint x="256" y="197" />\r\n' +
        '      </bpmndi:BPMNEdge>\r\n' +
        '      <bpmndi:BPMNShape id="EndEvent_0hhkhlx_di" bpmnElement="EndEvent_0hhkhlx">\r\n' +
        '        <dc:Bounds x="421" y="179" width="36" height="36" />\r\n' +
        '      </bpmndi:BPMNShape>\r\n' +
        '      <bpmndi:BPMNEdge id="SequenceFlow_0d34fwt_di" bpmnElement="SequenceFlow_0d34fwt">\r\n' +
        '        <di:waypoint x="356" y="197" />\r\n' +
        '        <di:waypoint x="421" y="197" />\r\n' +
        '      </bpmndi:BPMNEdge>\r\n' +
        '    </bpmndi:BPMNPlane>\r\n' +
        '  </bpmndi:BPMNDiagram>\r\n' +
        '</bpmn2:definitions>'
    }
  },
  mounted() {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      // 添加控制板
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        // 右边的工具栏
        propertiesPanelModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    })

    // 下载画图

    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('commandStack.changed', () => {
      this.saveDiagram(xml => {
        this.bpmnXml = xml
        console.info(xml)
      })
    })

    this.createNewDiagram(this.bpmnModeler)
  },
  methods: {
    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(this.bpmnXml, function(err) {
        if (err) {
          console.error(err)
        }
      })
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    },
    validate(type) {
      axios
        .post(
          'http://127.0.0.1:9090/m-workflow/command/process/validate',
          {
            bpmnXml: this.bpmnXml
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(response => {
          const data = response.data
          console.log(data)
          if (data.ecode !== 0) {
            data.result.forEach((err, i) => {
              if (type === 0) {
                this.$message(err.defaultDescription)
              } else {
                setTimeout(() => {
                  this.$notify({
                    title: err.problem,
                    message: err.defaultDescription,
                    position: 'top-right',
                    duration: 5000 + 5000 * i
                  })
                }, 300 * i)
              }
            })
          } else {
            if (type === 0) {
              this.$message('流程没有异常')
            } else {
              this.$notify({
                title: '流程校验',
                message: '流程没有异常',
                position: 'bottom-right'
              })
            }
          }
        })
        .catch(error => {
          console.log(error)
        })

      console.info('校验')
    }
  }
}
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
</style>
