import Konva from 'konva';
import SPNode from './SPNode';

class SPGraph {
  constructor() {}
  init(config) {
    this.stage = new Konva.Stage(config);
    this.nodeLayer = new Konva.Layer();
    this.stage.add(this.nodeLayer);

    
    this.curentSelPort = null;
    this.tempLine = null;
    this.stage.on('portdrag', (evt) => {
      if(evt.target) {
        this.curentSelPort = evt.target;
        this.tempLine = this.creatTempLineNode();
        this.nodeLayer.add(this.tempLine);
        this.tempLine.moveToBottom();
      }
    })
    this.stage.on('mouseup', () => {
      if(this.curentSelPort) {
        this.curentSelPort.fill('#fff');
        this.nodeLayer.draw();
        if(this.currentInputNode) {
          this.currentInputNode.fill('#fff');
          let spos = this.curentSelPort.getAbsolutePosition();
          let epos = this.currentInputNode.getAbsolutePosition();
          this.tempLine.points([spos.x, spos.y, epos.x, epos.y])
        }else {
          this.tempLine.destroy();
        }
        this.curentSelPort = null;
        this.tempLine = null;
        this.currentInputNode = null;
        this.nodeLayer.draw();
      }
    })
    this.currentInputNode = null;
    this.stage.on('mousemove', (evt) => {
      if(this.curentSelPort) {
        // console.log(evt)
        let spos = this.curentSelPort.getAbsolutePosition();
        let epos = this.stage.getPointerPosition();
        // this.nodeLayer.draw();

        let inputNode = this.nodeLayer.getIntersection(epos, '.input');
        // console.log('++++', inputNode)
        // if(inputNode) {
        //   if(this.currentInputNode == null) {
        //     this.currentInputNode = inputNode;
        //   }else if(this.currentInputNode !== inputNode) {
        //     this.currentInputNode = inputNode;
        //   }
        // }else {
        //   this.currentInputNode = null;
        // }
        if(inputNode) {
          this.currentInputNode = inputNode;
          this.currentInputNode.fill('red')
          epos = this.currentInputNode.getAbsolutePosition();
        }else {
          if(this.currentInputNode) {
            this.currentInputNode.fill('#fff')
          }
        }
        this.tempLine.points([spos.x, spos.y, epos.x, epos.y])
        this.nodeLayer.draw();
      }
    })


    this.stage.on('dragmove', evt => {
      console.log('++++', evt);
    })
    
    this.curentSelNode = null;
    this.stage.on('click', (evt) => {
      let target = evt.target;
      if(this.curentSelNode) {
        this.curentSelNode.highlight(false);
        this.curentSelNode = null;
      }
      if(target.name() === 'node') {
        target._sp.highlight(true);
        this.curentSelNode = target._sp;
      }
    })
  }
  addNode() {
    this.nodeLayer.add(new SPNode().group);
    this.nodeLayer.draw();
  }
  deleteSelNode() {
    if(this.curentSelNode) {
      this.curentSelNode.remove();
      this.curentSelNode = null;
    }
  }
  creatTempLineNode() {
    return new Konva.Line({
      stroke: '#555',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
      name: 'line'
    });
  }

}

export default new SPGraph()