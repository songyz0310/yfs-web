var bpmnXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r\n" + 
"<definitions xmlns=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:flowable=\"http://flowable.org/bpmn\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\"\r\n" + 
"xmlns:omgdc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:omgdi=\"http://www.omg.org/spec/DD/20100524/DI\" typeLanguage=\"http://www.w3.org/2001/XMLSchema\" expressionLanguage=\"http://www.w3.org/1999/XPath\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\r\n" + 
"    <process id=\"111\" name=\"auditProcess\" isExecutable=\"true\">\r\n" + 
"        <startEvent id=\"StartEvent_1\" name=\"开始\"></startEvent>\r\n" + 
"        <userTask id=\"UserTask_1r2qq04\" name=\"第一阶段审批\">\r\n" + 
"            <extensionElements>\r\n" + 
"                <flowable:taskListener event=\"create\" class=\"com.i1stcs.bizcore.workflow.domain.flowable.listener.AuditTaskListener\"></flowable:taskListener>\r\n" + 
"            </extensionElements>\r\n" + 
"        </userTask>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_1oatys1\" sourceRef=\"StartEvent_1\" targetRef=\"UserTask_1r2qq04\"></sequenceFlow>\r\n" + 
"        <exclusiveGateway id=\"ExclusiveGateway_0ktej08\" name=\"是否审批通过\"></exclusiveGateway>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_0t4897k\" sourceRef=\"UserTask_1r2qq04\" targetRef=\"ExclusiveGateway_0ktej08\"></sequenceFlow>\r\n" + 
"        <userTask id=\"UserTask_19ayhg6\" name=\"第二阶段审批\">\r\n" + 
"            <extensionElements>\r\n" + 
"                <flowable:taskListener event=\"create\" class=\"com.i1stcs.bizcore.workflow.domain.flowable.listener.AuditTaskListener\"></flowable:taskListener>\r\n" + 
"            </extensionElements>\r\n" + 
"        </userTask>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_0128cwk\" name=\"是\" sourceRef=\"ExclusiveGateway_0ktej08\" targetRef=\"UserTask_19ayhg6\">\r\n" + 
"            <conditionExpression xsi:type=\"tFormalExpression\">\r\n" + 
"                <![CDATA[${ approval eq true }]]>\r\n" + 
"            </conditionExpression>\r\n" + 
"        </sequenceFlow>\r\n" + 
"        <exclusiveGateway id=\"ExclusiveGateway_1pd4330\" name=\"是否审批通过\"></exclusiveGateway>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_1p4720d\" sourceRef=\"UserTask_19ayhg6\" targetRef=\"ExclusiveGateway_1pd4330\"></sequenceFlow>\r\n" + 
"        <userTask id=\"UserTask_1hr41om\" name=\"第三阶段审批\">\r\n" + 
"            <extensionElements>\r\n" + 
"                <flowable:taskListener event=\"create\" class=\"com.i1stcs.bizcore.workflow.domain.flowable.listener.AuditTaskListener\"></flowable:taskListener>\r\n" + 
"            </extensionElements>\r\n" + 
"        </userTask>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_05i2ncz\" name=\"是\" sourceRef=\"ExclusiveGateway_1pd4330\" targetRef=\"UserTask_1hr41om\">\r\n" + 
"            <conditionExpression xsi:type=\"tFormalExpression\">\r\n" + 
"                <![CDATA[${ approval eq true }]]>\r\n" + 
"            </conditionExpression>\r\n" + 
"        </sequenceFlow>\r\n" + 
"        <endEvent id=\"EndEvent_1v2wj0h\" name=\"结束\"></endEvent>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_1snu7lu\" sourceRef=\"UserTask_1hr41om\" targetRef=\"EndEvent_1v2wj0h\"></sequenceFlow>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_13bocxw\" name=\"否\" sourceRef=\"ExclusiveGateway_0ktej08\" targetRef=\"EndEvent_1v2wj0h\">\r\n" + 
"            <conditionExpression xsi:type=\"tFormalExpression\">\r\n" + 
"                <![CDATA[${ approval ne true }]]>\r\n" + 
"            </conditionExpression>\r\n" + 
"        </sequenceFlow>\r\n" + 
"        <sequenceFlow id=\"SequenceFlow_0ly0vzt\" name=\"否\" sourceRef=\"ExclusiveGateway_1pd4330\" targetRef=\"EndEvent_1v2wj0h\">\r\n" + 
"            <conditionExpression xsi:type=\"tFormalExpression\">\r\n" + 
"                <![CDATA[${ approval ne true }]]>\r\n" + 
"            </conditionExpression>\r\n" + 
"        </sequenceFlow>\r\n" + 
"    </process>\r\n" + 
"    <bpmndi:BPMNDiagram id=\"BPMNDiagram_r6a4y2i1i\">\r\n" + 
"        <bpmndi:BPMNPlane bpmnElement=\"r6a4y2i1i\" id=\"BPMNPlane_r6a4y2i1i\">\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"StartEvent_1\" id=\"BPMNShape_StartEvent_1\">\r\n" + 
"                <omgdc:Bounds height=\"30.0\" width=\"30.0\" x=\"289.0\" y=\"246.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"UserTask_1r2qq04\" id=\"BPMNShape_UserTask_1r2qq04\">\r\n" + 
"                <omgdc:Bounds height=\"80.0\" width=\"100.0\" x=\"375.0\" y=\"221.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"ExclusiveGateway_0ktej08\" id=\"BPMNShape_ExclusiveGateway_0ktej08\">\r\n" + 
"                <omgdc:Bounds height=\"40.0\" width=\"40.0\" x=\"525.0\" y=\"239.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"UserTask_19ayhg6\" id=\"BPMNShape_UserTask_19ayhg6\">\r\n" + 
"                <omgdc:Bounds height=\"80.0\" width=\"100.0\" x=\"615.0\" y=\"210.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"ExclusiveGateway_1pd4330\" id=\"BPMNShape_ExclusiveGateway_1pd4330\">\r\n" + 
"                <omgdc:Bounds height=\"40.0\" width=\"40.0\" x=\"775.0\" y=\"239.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"UserTask_1hr41om\" id=\"BPMNShape_UserTask_1hr41om\">\r\n" + 
"                <omgdc:Bounds height=\"80.0\" width=\"100.0\" x=\"875.0\" y=\"224.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNShape bpmnElement=\"EndEvent_1v2wj0h\" id=\"BPMNShape_EndEvent_1v2wj0h\">\r\n" + 
"                <omgdc:Bounds height=\"28.0\" width=\"28.0\" x=\"1025.0\" y=\"246.0\"></omgdc:Bounds>\r\n" + 
"            </bpmndi:BPMNShape>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_05i2ncz\" id=\"BPMNEdge_SequenceFlow_05i2ncz\">\r\n" + 
"                <omgdi:waypoint x=\"814.2042746113989\" y=\"259.73888888888894\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"874.9999999999994\" y=\"262.0769230769231\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_1oatys1\" id=\"BPMNEdge_SequenceFlow_1oatys1\">\r\n" + 
"                <omgdi:waypoint x=\"318.9499987519259\" y=\"261.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"374.9999999999882\" y=\"261.0\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_0t4897k\" id=\"BPMNEdge_SequenceFlow_0t4897k\">\r\n" + 
"                <omgdi:waypoint x=\"474.95000000000005\" y=\"261.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"500.0\" y=\"261.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"500.0\" y=\"259.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"525.0\" y=\"259.0\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_13bocxw\" id=\"BPMNEdge_SequenceFlow_13bocxw\">\r\n" + 
"                <omgdi:waypoint x=\"545.8986486486486\" y=\"239.9009009009009\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"550.0\" y=\"153.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"1043.0\" y=\"153.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"1039.5211381123247\" y=\"246.0095897492967\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_1p4720d\" id=\"BPMNEdge_SequenceFlow_1p4720d\">\r\n" + 
"                <omgdi:waypoint x=\"714.9499999999999\" y=\"253.45807692307696\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"776.2577282530553\" y=\"257.705035971223\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_1snu7lu\" id=\"BPMNEdge_SequenceFlow_1snu7lu\">\r\n" + 
"                <omgdi:waypoint x=\"974.9499999999989\" y=\"262.2456140350877\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"1025.0084447149632\" y=\"260.4891785647491\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_0128cwk\" id=\"BPMNEdge_SequenceFlow_0128cwk\">\r\n" + 
"                <omgdi:waypoint x=\"563.5581395348837\" y=\"257.6046511627907\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"615.0\" y=\"253.74625000000006\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"            <bpmndi:BPMNEdge bpmnElement=\"SequenceFlow_0ly0vzt\" id=\"BPMNEdge_SequenceFlow_0ly0vzt\">\r\n" + 
"                <omgdi:waypoint x=\"795.8827433628319\" y=\"278.05921750663134\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"800.0\" y=\"367.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"1043.0\" y=\"367.0\"></omgdi:waypoint>\r\n" + 
"                <omgdi:waypoint x=\"1039.5211380595294\" y=\"273.938848019651\"></omgdi:waypoint>\r\n" + 
"            </bpmndi:BPMNEdge>\r\n" + 
"        </bpmndi:BPMNPlane>\r\n" + 
"    </bpmndi:BPMNDiagram>\r\n" + 
"</definitions>";

export default bpmnXml  