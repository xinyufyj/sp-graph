import Konva from 'konva';
import SPLayer from './SPLayer';
import * as utils from './utils'

const GridStep = 20;

class SPGridLayer extends SPLayer {
  constructor(config={}) {
    super({
      listening: false,
      ...config
    })
    this.grid = new Konva.Shape({
      stroke: '#eee',
      strokeWidth: 1
    });
    this.add(this.grid);
    this.spUplateGrid();
  }
  spUplateGrid() {
    let stage = this.getStage();
    if(!stage) {
      return;
    }
    let topLeftPos = utils.getRelativePosition(this, {x: 0, y: 0});
    let bottomRightPos = utils.getRelativePosition(this, {x: stage.width(), y: stage.height()});
    let minX = Math.min(topLeftPos.x, bottomRightPos.x);
    let maxX = Math.max(topLeftPos.x, bottomRightPos.x);
    let minY = Math.min(topLeftPos.y, bottomRightPos.y);
    let maxY = Math.max(topLeftPos.y, bottomRightPos.y);

    let startX = Math.floor(minX / GridStep) - 1;
    let endX = Math.ceil(maxX / GridStep) + 1;
    let startY = Math.floor(minY / GridStep) - 1;
    let endY = Math.ceil(maxY / GridStep) + 1;
  
    this.grid.sceneFunc(function(context, shape) {
      context.beginPath();
      
      // draw line parallel x axis
      for(let y = startY; y < endY; y++) {
        context.moveTo(startX * GridStep, y * GridStep);
        context.lineTo(endX * GridStep,  y * GridStep);
      }

      // draw line parallel y axis
      for(let x = startX; x < endX; x++) {
        context.moveTo(x * GridStep, startY * GridStep);
        context.lineTo(x * GridStep,  endY * GridStep);
      }

      context.fillStrokeShape(shape);
    });
  }

}
export default SPGridLayer