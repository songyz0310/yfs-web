<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas" />
    <div id="js-properties-panel" class="panel" />
    <bpmn-tool :modeler="bpmnViewer" :content="bpmnContent" />
  </div>
</template>
<script>
import BpmnViewer from "./core/BpmnViewer.js";
import BpmnTool from "./support/BpmnTool";
import ticketBpmn from "./resources/ticket.bpmn";

export default {
  components: {
    BpmnTool
  },
  data() {
    return {
      bpmnViewer: null,
      bpmnContent: false
    };
  },
  mounted() {
    this.bpmnViewer = new BpmnViewer(this.$refs.canvas);
    this.bpmnViewer.importBpmnXml(ticketBpmn);
    this.bpmnContent = this.$refs.content;
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
