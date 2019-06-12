<template>
  <div ref="content" class="containers">
    <div ref="canvas" class="canvas"/>
    <div id="js-properties-panel" class="panel"/>
    <el-button-group class="songyz-tool">
      <el-button @click="viewZoomIn($event)">
        <i class="iconfont icon-zoom-in"></i>
      </el-button>
      <el-button @click="viewZoomOut($event)">
        <i class="iconfont icon-zoom-out"></i>
      </el-button>
      <el-button @click="viewReset($event)">
        <i class="iconfont icon-target"></i>
      </el-button>
      <el-button @click="viewFullScreen($event)">
        <i
          :class="{iconfont:true, 'icon-enlarge':!fullScreen, 'icon-shrink':fullScreen}"
        ></i>
      </el-button>
    </el-button-group>
    <el-row style="position: absolute;top: 10px;right: 310px;">
      <el-form :inline="true" label-width="80px" class="demo-form-inline">
        <el-form-item label="服务地址">
          <el-input v-model="host" placeholder="服务地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="流程ID">
          <el-input
            type="number"
            style="width: 112px;"
            v-model="processId"
            placeholder="流程ID"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upload">初始化流程</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import axios from "axios";

import BpmnModeler from "./bpmnSupport/bpmnModeler";
import { bpmnXml } from "./bpmnSupport/bpmnXml";

export default {
  data() {
    return {
      // bpmn建模器
      fullScreen: false,
      bpmnModeler: null,
      host: "https://dev.1stcs.cn",
      processId: "",
      bpmnSvg: "",
      bpmnXml: ""
    };
  },
  mounted() {
    // bpmn建模器
    this.bpmnModeler = new BpmnModeler(this.$refs.canvas);
    this.bpmnModeler.importBpmnXml(bpmnXml);
    this.bpmnModeler.onChange = (xml, svg) => {
      this.bpmnXml = xml;
      this.bpmnSvg = svg;
    };

    setInterval(() => {
      this.fullScreen = screen.height == window.innerHeight;

      if (this.fullScreen) {
        let pageHeight = screen.height + "px";
        this.$refs.content.style =
          "position: fixed;top: 0;left: 0;z-index: 1101;height: " + pageHeight;
      } else {
        let pageHeight = screen.height-195 + "px";
        this.$refs.content.style =
          "position: absolute;top: auto;left: auto;;height: " + pageHeight;
      }
    }, 1000);
  },
  methods: {
    viewFullScreen(event) {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        var html = document.querySelector("html");
        if (html.requestFullscreen) {
          html.requestFullscreen();
        } else if (html.msRequestFullscreen) {
          html.msRequestFullscreen();
        } else if (html.mozRequestFullScreen) {
          html.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          html.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
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

      event.currentTarget.blur();
    },
    viewReset(event) {
      this.bpmnModeler.get("zoomScroll").reset();
      event.currentTarget.blur();
    },
    viewZoomIn(event) {
      this.bpmnModeler.get("zoomScroll").stepZoom(1);
      event.currentTarget.blur();
    },
    viewZoomOut(event) {
      this.bpmnModeler.get("zoomScroll").stepZoom(-1);
      event.currentTarget.blur();
    },
    upload() {
      if (this.host == "") {
        this.$notify.error({
          title: "错误",
          message: "请设置服务地址",
          position: "bottom-right"
        });
        return;
      }
      if (this.processId == "") {
        this.$notify.error({
          title: "错误",
          message: "请设置流程ID",
          position: "bottom-right"
        });
        return;
      }

      this.bpmnSvg = '<?xml version="1.0" encoding="UTF-8"?>' + this.bpmnSvg;
      let formData = new FormData();
      var blob = new Blob([this.bpmnXml], { type: "text/xml" });
      var blob1 = new Blob([this.bpmnSvg], { type: "text/xml" });
      var date = new Date().getTime();
      var xmlName = date + ".xml";
      var svgName = date + ".svg";
      var xml = new File([blob], xmlName);
      var svg = new File([blob1], svgName);
      formData.append("file1", xml);
      formData.append("file2", svg);

      axios
        .post(this.host + "/webportal/upload/process", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response1 => {
          console.info(response1.data);
          if (response1.data.ecode == 0) {
            let process = {};
            process.processId = this.processId;
            process.bpmnXml = response1.data.result[0];
            process.bpmnSvg = response1.data.result[1];

            axios
              .post(
                this.host +
                  "/webportal/workflow/migration/command/process/init",
                process,
                {
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              )
              .then(response2 => {})
              .catch(err2 => {
                console.info(err2);
                this.$notify.error({
                  title: "错误",
                  message: "流程初始化异常",
                  position: "bottom-right"
                });
              });
          }
        })
        .catch(err1 => {
          console.info(err1);
          this.$notify.error({
            title: "错误",
            message: "流程上传异常",
            position: "bottom-right"
          });
        });
    }
  }
};
</script>

<style lang="scss">
@import "./bpmnSupport/bpmnModeler.scss";
</style>
