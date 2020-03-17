<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas" />
    <div id="js-properties-panel" class="panel" />
    <bpmn-tool :modeler="bpmnModeler" :content="bpmnContent" />
  </div>
</template>
<script>
import BpmnModeler from "./core/BpmnModeler.js";
import BpmnTool from "./support/BpmnTool";
import ticketBpmn from "./resources/ticket.bpmn";

export default {
  components: {
    BpmnTool
  },
  data() {
    return {
      bpmnModeler: null,
      bpmnContent: null,
    };
  },
  mounted() {
    this.bpmnModeler = new BpmnModeler(this.$refs.canvas);
    // this.bpmnModeler.importBpmnXml(ticketBpmn);
    this.bpmnContent=this.$refs.content;
    debugger
  },
  watch: {
    "$i18n.locale"(val) {
      this.bpmnViewer.get("eventBus").fire("i18n.changed");
    }
  },
  methods: {}
};
</script>

<style lang="scss">
@import "./support/modeler.scss";
</style>
