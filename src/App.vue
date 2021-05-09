<template>
  <the-graph class="graph"></the-graph>
  <!-- <canvas id="test" width="300" height="300"></canvas> -->
</template>

<script>
import TheGraph from './components/TheGraph.vue'

export default {
  name: 'App',
  components: {
    TheGraph
  },
  mounted() {
    // let canvas = document.getElementById('test');
    // let ctx = canvas.getContext('2d');
    
    // let offsetX = 50, offsetY = 50;
    // let width = 80, height = 80;
    // let radius = 5;
    // ctx.beginPath();
    // ctx.moveTo(offsetX, offsetX);
    // ctx.lineTo(offsetX + width, offsetY);
    // ctx.lineTo(offsetX + width , offsetY + height * 0.5 - radius);
    // ctx.arc(offsetX + width, offsetY + height * 0.5, radius, Math.PI * 1.5, Math.PI * 0.5, true);
    // ctx.lineTo(offsetX + width, offsetY + height);
    // ctx.lineTo(offsetX, offsetY + height);
    // ctx.lineTo(offsetX, offsetY + height * 0.5 + radius);
    // ctx.arc(offsetX, offsetY + height * 0.5, radius, Math.PI * 0.5, Math.PI * 1.5, true);
    // ctx.lineTo(offsetX, offsetY);
    // ctx.stroke();
  }
}
</script>

<style lang="less">
.graph {
  margin: 50px 0 0 100px;
}
</style>
