<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas"/>
    <div id="js-properties-panel" class="panel"/>
    <!-- 自定义工具框 -->
    <el-button-group class="songyz-tool">
      <el-tooltip class="item" :content="$t('bpmn.tip.zoomIn')" placement="top">
        <el-button @click="viewZoomIn($event)">
          <i class="iconfont icon-zoom-in"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" :content="$t('bpmn.tip.zoomOut')" placement="top">
        <el-button @click="viewZoomOut($event)">
          <i class="iconfont icon-zoom-out"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" :content="$t('bpmn.tip.toTarget')" placement="top">
        <el-button @click="viewReset($event)">
          <i class="iconfont icon-target"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        :content="fullScreen ? $t('bpmn.tip.exitScreenfull') : $t('bpmn.tip.screenfull')"
        placement="top"
      >
        <el-button @click="viewFullScreen($event)">
          <i :class="{iconfont:true, 'icon-enlarge':!fullScreen, 'icon-shrink':fullScreen}"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" :content="$t('bpmn.tip.importFile')" placement="top">
        <el-button @click="cilckFileInput($event)">
          <i class="iconfont icon-folder-open"></i>
          <input ref="bpmnFile" type="file" @change="importBpmnFile" hidden>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" :content="$t('bpmn.tip.downloadBpmnXml')" placement="top">
        <el-button @click="downloadBpmnXml($event)">
          <i class="iconfont icon-download"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" :content="$t('bpmn.tip.downloadBpmnSvg')" placement="top">
        <el-button @click="downloadBpmnSvg($event)">
          <i class="iconfont icon-file-picture"></i>
        </el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>
<script>
import BpmnViewer from "./core/BpmnViewer.js";
import bpmnXml from "./support/bpmn-ticket.js";
import { readFile, fileDownload } from "./file/tools.js";
import { toggleFullScreen } from "./dom/tools.js";

export default {
  data() {
    return {
      fullScreen: false,
      bpmnViewer: null
    };
  },
  mounted() {
    this.bpmnViewer = new BpmnViewer(this.$refs.canvas);
    this.bpmnViewer.importBpmnXml(bpmnXml);
  },
  watch: {
    "$i18n.locale"(val) {
      this.bpmnViewer.get("eventBus").fire("i18n.changed");
    }
  },
  methods: {
    viewFullScreen(event) {
      event.currentTarget.blur();
      this.fullScreen = toggleFullScreen();

      if (this.fullScreen) {
        let pageHeight = screen.height + "px";
        this.$refs.content.style =
          "position: fixed;top: 0;left: 0;z-index: 1101;height: " + pageHeight;
      } else {
        let pageHeight = screen.height - 195 + "px";
        this.$refs.content.style =
          "position: absolute;top: auto;left: auto;;height: " + pageHeight;
      }
    },
    viewReset(event) {
      event.currentTarget.blur();
      this.bpmnViewer.get("zoomScroll").reset();
    },
    viewZoomIn(event) {
      event.currentTarget.blur();
      this.bpmnViewer.get("zoomScroll").stepZoom(1);
    },
    viewZoomOut(event) {
      event.currentTarget.blur();
      this.bpmnViewer.get("zoomScroll").stepZoom(-1);
    },
    cilckFileInput(event) {
      event.currentTarget.blur();
      this.$refs.bpmnFile.dispatchEvent(new MouseEvent("click"));
    },
    importBpmnFile(event) {
      let file = this.$refs.bpmnFile.files[0];
      if (file.name.indexOf(".bpmn") <= 0 && file.name.indexOf(".xml") <= 0) {
        this.$notify.error({
          title: this.$t("bpmn.other.error"),
          message: this.$t("bpmn.other.selectBpmnFile"),
          position: "bottom-right"
        });
        return;
      }

      readFile(file)
        .then(xml => this.bpmnViewer.importBpmnXml(xml))
        .catch(error => {
          this.$notify.error({
            title: this.$t("bpmn.other.error"),
            message: error,
            position: "bottom-right"
          });
        });
    },
    downloadBpmnXml(event) {
      event.currentTarget.blur();
      fileDownload(
        this.bpmnViewer.getBpmnXml(),
        "diagram.bpmn",
        "application/xml"
      );
    },
    downloadBpmnSvg(event) {
      event.currentTarget.blur();
      fileDownload(
        this.bpmnViewer.getBpmnSvg(),
        "diagram.svg",
        "image/svg+xml"
      );
    }
  }
};
</script>

<style lang="scss">
@import "./support/modeler.scss";
</style>
