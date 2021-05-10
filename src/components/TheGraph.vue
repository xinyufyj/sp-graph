<template>
  <div>
    <div id="container"></div>
    <div>
      <ul>
        <li><button @click="addNode">add</button></li>
        <li><button @click="removeNode">remove</button></li>
      </ul>
    </div>
  </div>
</template>

<script>
import SPStage from "../graph/SPStage";

export default {
  data() {
    return {
    }
  },
  mounted() {
    this.spStage = new SPStage({
      container: "container",
      width: 800,
      height: 600,
      name: 'sp-stage'
    });
    window.spStage = this.spStage;
  },
  methods: {
    addNode() {
      this.spStage.spAddNode();
    },
    removeNode() {
      this.spStage.spRemoveSelNode();
    },
    translateX() {
      this.spStage.nodeLayer.x( this.spStage.nodeLayer.x() + 20)
      this.spStage.draw()
    },
    translateY() {
      this.spStage.nodeLayer.y( this.spStage.nodeLayer.y() + 20)
      this.spStage.draw()
    }
  },
};
</script>

<style lang="less">
#container {
  width: 800px;
  height: 600px;
  border: 1px solid lightgray;
}
</style>
