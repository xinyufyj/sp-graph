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
import spGraph from "../graph/SPGraph";

export default {
  mounted() {
    spGraph.init({
      container: "container",
      width: 800,
      height: 600,
      // draggable: true
    });
  },
  methods: {
    addNode() {
      spGraph.addNode();
    },
    removeNode() {
      spGraph.deleteSelNode();
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
