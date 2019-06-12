const bpmnXml = '<?xml version="1.0" encoding="UTF-8"?>\r\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" xmlns:i1stcs="http://www.1stcs.cn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\r\n' +
    '  <bpmn2:process id="Process_1" isExecutable="true">\r\n' +
    '    <bpmn2:startEvent id="StartEvent_1">\r\n' +
    "      <bpmn2:outgoing>SequenceFlow_0ijrl9i</bpmn2:outgoing>\r\n" +
    "    </bpmn2:startEvent>\r\n" +
    '    <bpmn2:sequenceFlow id="SequenceFlow_0ijrl9i" sourceRef="StartEvent_1" targetRef="Task_15k6dio" />\r\n' +
    '    <bpmn2:sequenceFlow id="SequenceFlow_1hos2kx" sourceRef="Task_15k6dio" targetRef="Task_1eq2rd2" />\r\n' +
    '    <bpmn2:sequenceFlow id="SequenceFlow_0507n8j" sourceRef="Task_1eq2rd2" targetRef="Task_0qwf2zt" />\r\n' +
    '    <bpmn2:sequenceFlow id="SequenceFlow_1yqrf1w" sourceRef="Task_0qwf2zt" targetRef="Task_1olaw521" />\r\n' +
    '    <bpmn2:userTask id="Task_15k6dio" name="预约">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_0ijrl9i</bpmn2:incoming>\r\n" +
    "      <bpmn2:outgoing>SequenceFlow_1hos2kx</bpmn2:outgoing>\r\n" +
    "    </bpmn2:userTask>\r\n" +
    '    <bpmn2:userTask id="Task_1eq2rd2" name="出发">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_1hos2kx</bpmn2:incoming>\r\n" +
    "      <bpmn2:outgoing>SequenceFlow_0507n8j</bpmn2:outgoing>\r\n" +
    "    </bpmn2:userTask>\r\n" +
    '    <bpmn2:userTask id="Task_0qwf2zt" name="到场">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_0507n8j</bpmn2:incoming>\r\n" +
    "      <bpmn2:outgoing>SequenceFlow_1yqrf1w</bpmn2:outgoing>\r\n" +
    "    </bpmn2:userTask>\r\n" +
    '    <bpmn2:userTask id="Task_1olaw521" name="完成">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_1yqrf1w</bpmn2:incoming>\r\n" +
    "      <bpmn2:outgoing>SequenceFlow_11b1l12</bpmn2:outgoing>\r\n" +
    "    </bpmn2:userTask>\r\n" +
    '    <bpmn2:sequenceFlow id="SequenceFlow_11b1l12" sourceRef="Task_1olaw521" targetRef="Task_0jc7zpo" />\r\n' +
    '    <bpmn2:userTask id="Task_0jc7zpo" name="评价">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_11b1l12</bpmn2:incoming>\r\n" +
    "      <bpmn2:outgoing>SequenceFlow_1hny7ah</bpmn2:outgoing>\r\n" +
    "    </bpmn2:userTask>\r\n" +
    '    <bpmn2:endEvent id="EndEvent_1obgqul">\r\n' +
    "      <bpmn2:incoming>SequenceFlow_1hny7ah</bpmn2:incoming>\r\n" +
    "    </bpmn2:endEvent>\r\n" +
    '    <bpmn2:sequenceFlow id="SequenceFlow_1hny7ah" sourceRef="Task_0jc7zpo" targetRef="EndEvent_1obgqul" />\r\n' +
    "  </bpmn2:process>\r\n" +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\r\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\r\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\r\n' +
    '        <dc:Bounds x="116" y="179" width="36" height="36" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_0ijrl9i_di" bpmnElement="SequenceFlow_0ijrl9i">\r\n' +
    '        <di:waypoint x="152" y="197" />\r\n' +
    '        <di:waypoint x="201" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_1hos2kx_di" bpmnElement="SequenceFlow_1hos2kx">\r\n' +
    '        <di:waypoint x="301" y="197" />\r\n' +
    '        <di:waypoint x="342" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_0507n8j_di" bpmnElement="SequenceFlow_0507n8j">\r\n' +
    '        <di:waypoint x="442" y="197" />\r\n' +
    '        <di:waypoint x="482" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_1yqrf1w_di" bpmnElement="SequenceFlow_1yqrf1w">\r\n' +
    '        <di:waypoint x="582" y="197" />\r\n' +
    '        <di:waypoint x="611" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    '      <bpmndi:BPMNShape id="UserTask_1veeyop_di" bpmnElement="Task_15k6dio">\r\n' +
    '        <dc:Bounds x="201" y="157" width="100" height="80" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNShape id="UserTask_1oveaoc_di" bpmnElement="Task_1eq2rd2">\r\n' +
    '        <dc:Bounds x="342" y="157" width="100" height="80" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNShape id="UserTask_022h2s4_di" bpmnElement="Task_0qwf2zt">\r\n' +
    '        <dc:Bounds x="482" y="157" width="100" height="80" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNShape id="UserTask_0ezhl06_di" bpmnElement="Task_1olaw521">\r\n' +
    '        <dc:Bounds x="611" y="157" width="100" height="80" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_11b1l12_di" bpmnElement="SequenceFlow_11b1l12">\r\n' +
    '        <di:waypoint x="711" y="197" />\r\n' +
    '        <di:waypoint x="751" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    '      <bpmndi:BPMNShape id="UserTask_1623q0t_di" bpmnElement="Task_0jc7zpo">\r\n' +
    '        <dc:Bounds x="751" y="157" width="100" height="80" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNShape id="EndEvent_1obgqul_di" bpmnElement="EndEvent_1obgqul">\r\n' +
    '        <dc:Bounds x="888" y="179" width="36" height="36" />\r\n' +
    "      </bpmndi:BPMNShape>\r\n" +
    '      <bpmndi:BPMNEdge id="SequenceFlow_1hny7ah_di" bpmnElement="SequenceFlow_1hny7ah">\r\n' +
    '        <di:waypoint x="851" y="197" />\r\n' +
    '        <di:waypoint x="888" y="197" />\r\n' +
    "      </bpmndi:BPMNEdge>\r\n" +
    "    </bpmndi:BPMNPlane>\r\n" +
    "  </bpmndi:BPMNDiagram>\r\n" +
    "</bpmn2:definitions>";


export {
    bpmnXml
};