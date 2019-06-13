<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas"/>
    <div id="js-properties-panel" class="panel"/>
    <el-button-group class="songyz-tool">
      <el-button @click="viewZoomIn($event)" title="放大">
        <i class="iconfont icon-zoom-in"></i>
      </el-button>
      <el-button @click="viewZoomOut($event)" title="缩小">
        <i class="iconfont icon-zoom-out"></i>
      </el-button>
      <el-button @click="viewReset($event)" title="定位">
        <i class="iconfont icon-target"></i>
      </el-button>
      <el-button @click="viewFullScreen($event)" :title="fullScreen ? '退出全屏' : '全屏'">
        <i :class="{iconfont:true, 'icon-enlarge':!fullScreen, 'icon-shrink':fullScreen}"></i>
      </el-button>
      <el-button @click="cilckFileInput($event)" title="导入文件">
        <i class="iconfont icon-folder-open"></i>
        <input ref="bpmnFile" type="file" @change="importBpmnFile" hidden>
      </el-button>
      <el-button @click="downloadBpmnXml($event)" title="下载BpmnXml">
        <i class="iconfont icon-download"></i>
      </el-button>
      <el-button @click="downloadBpmnSvg($event)" title="下载流程图">
        <i class="iconfont icon-file-picture"></i>
      </el-button>
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
    // bpmn建模器
    this.bpmnViewer = new BpmnViewer(this.$refs.canvas);
    this.bpmnViewer.importBpmnXml(bpmnXml);
  },
  watch: {
    "$i18n.locale"(val) {
      console.info("切换语言了");
      this.bpmnViewer.get("eventBus").fire("i18n.changed");
    }
  },
  methods: {
    viewFullScreen(event) {
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
      event.currentTarget.blur();
    },
    viewReset(event) {
      this.bpmnViewer.get("zoomScroll").reset();
      event.currentTarget.blur();
    },
    viewZoomIn(event) {
      this.bpmnViewer.get("zoomScroll").stepZoom(1);
      event.currentTarget.blur();
    },
    viewZoomOut(event) {
      this.bpmnViewer.get("zoomScroll").stepZoom(-1);
      event.currentTarget.blur();
    },
    cilckFileInput(event) {
      this.$refs.bpmnFile.dispatchEvent(new MouseEvent("click"));
      event.currentTarget.blur();
    },
    importBpmnFile(event) {
      let file = this.$refs.bpmnFile.files[0];
      if (file.name.indexOf(".bpmn") <= 0 && file.name.indexOf(".xml") <= 0) {
        this.$notify.error({
          title: "错误",
          message: "请选择标准的流程文件",
          position: "bottom-right"
        });
        return;
      }

      readFile(file)
        .then(xml => this.bpmnViewer.importBpmnXml(xml))
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error,
            position: "bottom-right"
          });
        });
    },
    downloadBpmnXml(event) {
      fileDownload(
        this.bpmnViewer.getBpmnXml(),
        "diagram.bpmn",
        "application/xml"
      );
      event.currentTarget.blur();
    },
    downloadBpmnSvg(event) {
      fileDownload(
        this.bpmnViewer.getBpmnSvg(),
        "diagram.svg",
        "image/svg+xml"
      );
      event.currentTarget.blur();
    }
  }
};
</script>

<style lang="scss">
@import "./support/modeler.scss";
</style>
