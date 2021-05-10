import Konva from 'konva';

const PortRadius = 5;
class SPPort extends Konva.Circle {
  constructor(config={}) {
    super({
      radius: PortRadius,
      fill:'#fff',
      stroke: 'black',
      strokeWidth: 1,
      draggable: true,
      ...config
    });
    // if(this.name() === 'sp-output') {
    //   this.on('mouseover', () => {
    //     this.spHighlight(true);
    //   });
    //   this.on('mouseout', () => {
    //     this.spHighlight(false);
    //   })
    // }
  }
  spHighlight(isHighlight) {
    if(isHighlight) {
      this.fill('red');
    }else {
      this.fill('#fff');
    }
    this.draw();
  }
  getSpnode() {
    return this.getParent();
  }
  getAbsolutePosition() {
    let pos = super.getAbsolutePosition();
    let layer = this.getLayer();
    return {
      x: pos.x - layer.x(),
      y: pos.y - layer.y()
    }
  }
}

export default SPPort;