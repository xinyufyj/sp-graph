import Konva from 'konva';

class SPNode {
  constructor() {
    this.seleted = false;

    let offsetX = 0, offsetY = 0;
    let width = 80, height = 80;
    let radius = 5;

    this.group = new Konva.Group({
      x: 20,
      y: 20,
      draggable: true
    });

    let box =  new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      cornerRadius: 5,
      stroke: 'black',
      strokeWidth: 2,
      name: 'node',
      // draggable: true
      // hitFunc: function (context) {
      //   context.beginPath();
      //   context.moveTo(offsetX, offsetX);
      //   context.lineTo(offsetX + width, offsetY);
      //   context.lineTo(offsetX + width , offsetY + height * 0.5 - radius);
      //   context.arc(offsetX + width, offsetY + height * 0.5, radius, Math.PI * 1.5, Math.PI * 0.5, true);
      //   context.lineTo(offsetX + width, offsetY + height);
      //   context.lineTo(offsetX, offsetY + height);
      //   context.lineTo(offsetX, offsetY + height * 0.5 + radius);
      //   context.arc(offsetX, offsetY + height * 0.5, radius, Math.PI * 0.5, Math.PI * 1.5, true);
      //   context.lineTo(offsetX, offsetY);
      //   context.fillStrokeShape(this);
      // },
    });
    
    let text = new Konva.Text({
      text: 'node',
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      width: box.width(),
      padding: 10,
      align: 'center',
      listening: false,
    });

    let inputPort = new Konva.Circle({
      x: 0,
      y: box.height() / 2,
      radius: radius,
      fill:'#fff',
      stroke: 'black',
      strokeWidth: 1,
      name: 'input',
    }); 

    let outputPort = new Konva.Circle({
      x: box.width(),
      y: box.height() / 2,
      radius: radius,
      fill:'#fff',
      stroke: 'black',
      strokeWidth: 1,
      name: 'output',
      draggable: true
    });  

    this.group.add(box);
    this.group.add(text);
    this.group.add(inputPort);
    this.group.add(outputPort);

    this.box = box;

    box._sp = this;

    // inputPort.on('mousedown', evt => {
    //   evt.cancelBubble = true;
    // })
    
    outputPort.on('dragstart', () => {
      outputPort.fill('red')
      let stage =  this.group.getStage();
      stage.fire('portdrag', {target: outputPort})
      outputPort.stopDrag();
    })

    // box.on('dragstart', () => {
    //   // stop box dragging
    //   box.stopDrag();
      
    //   // move group to the center
    //   // const size = this.group.getClientRect();
    //   // const pos = this.group.getStage().getPointerPosition();
      
    //   // this.group.setAttrs({
    //   //    x: pos.x - size.width / 2,
    //   //    y: pos.y - size.height / 2,
    //   // });
    //   this.group.startDrag();
    // });
    
  }
  highlight(isSelected) {
    this.seleted = isSelected;
    this.box.strokeWidth(this.seleted ? 4 : 2);
    this.group.getLayer().draw();
  }
  remove() {
    this.box._sp = null;
    this.box = null;
    let Layer = this.group.getLayer();
    this.group.destroy();
    Layer.draw();
    this.group = null;
  }
}

export default SPNode