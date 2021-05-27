import Konva from 'konva';
import SPLayer from './SPLayer';

const GridStep = 20;

class SPGridLayer extends SPLayer {
  constructor(config={}) {
    super({
      listening: false,
      ...config
    })
    this.grid = new Konva.Shape({
      stroke: '#eee',
      strokeWidth: 1,
      width: config.stageWidth,
      height: config.stageHeight,
      sceneFunc: function(context, shape) {
        context.beginPath();
      
        // draw line parallel x axis
        for(let y = 0; y <= config.stageHeight; y+=GridStep) {
          context.moveTo(0, y);
          context.lineTo(config.stageWidth,  y);
        }

        // draw line parallel y axis
        for(let x = 0; x <= config.stageWidth; x+=GridStep) {
          context.moveTo(x, 0);
          context.lineTo(x, config.stageHeight);
        }

        context.fillStrokeShape(shape);
      }
    });
    this.add(this.grid);
    this.grid.cache();
  }
}
export default SPGridLayer