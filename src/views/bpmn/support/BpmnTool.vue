<template>
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
        <input ref="bpmnFile" type="file" @change="importBpmnFile" hidden />
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
</template>
<script>
import { readFile, fileDownload } from "./tools.js";
export default {
  name: "bpmn-tool",
  props: {
    modeler: {
      type: [Object]
    },
    content: {}
  },
  data() {
    return {
      fullScreen: false
    };
  },
  mounted() {},
  methods: {
    viewFullScreen(event) {
      var element = document.querySelector("html");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      setTimeout(() => {
        this.fullScreen = screen.height == window.innerHeight;

        if (this.fullScreen) {
          let pageHeight = screen.height + "px";
          this.content.style =
            "position: fixed;top: 0;left: 0;z-index: 1101;height: " +
            pageHeight;
        } else {
          let pageHeight = screen.height - 195 + "px";
          this.content.style =
            "position: absolute;top: auto;left: auto;;height: " + pageHeight;
        }
      }, 100);
      event.currentTarget.blur();
    },
    viewReset(event) {
      this.modeler.get("zoomScroll").reset();
      event.currentTarget.blur();
    },
    viewZoomIn(event) {
      this.modeler.get("zoomScroll").stepZoom(1);
      event.currentTarget.blur();
    },
    viewZoomOut(event) {
      this.modeler.get("zoomScroll").stepZoom(-1);
      event.currentTarget.blur();
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
        .then(xml => this.modeler.importBpmnXml(xml))
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
        this.modeler.getBpmnXml(),
        "diagram.bpmn",
        "application/xml"
      );
    },
    downloadBpmnSvg(event) {
      event.currentTarget.blur();
      fileDownload(this.modeler.getBpmnSvg(), "diagram.svg", "image/svg+xml");
    }
  }
};
</script>
<style lang="scss">
.bjs-powered-by-lightbox {
  a {
    color: #409eff;
  }
}
.bjs-container a.bjs-powered-by {
  bottom: 10px !important;
}

.songyz-tool {
  position: absolute;
  left: 15px;
  bottom: 13px;
}
.songyz-tool .iconfont {
  margin: 0;
  font-size: 20px;
  width: 24px;
  display: inline-block;
}
.songyz-tool button {
  height: auto;
  padding: 10px !important;
}
</style>
