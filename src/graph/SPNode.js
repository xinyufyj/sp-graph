import Konva from 'konva';

import SPPort from "./SPPort";
import * as event from "./event";

const nodeW = 80;
const nodeH = 80;

class SPNode extends Konva.Group {
  constructor() {
    super({
      x: 20,
      y: 20,
      draggable: true,
      name: 'sp-node',
    });
    
    // if selected
    this.isSelected = false;
    // input ports
    this.inputPortNum = 3;
    this.inputPorts = [];
    this.outputPortNum = 4;
    this.outputPorts = [];

    // involved lines
    this.lines = [];

    // 绘制node基本形状
    this.spBasicShape();
    // 绘制端口的形状
    this.spPortShape();

    this.on('click', evt => {
      evt.cancelBubble = true;
      this.getStage().fire(event.NODE_SELECT, {
        target: this
      });
    });

    this.on('dragstart', evt => {
      let tName = evt.target.name();
      if(tName === 'sp-input' || tName === 'sp-output') {
        evt.target.stopDrag();
        if(tName === 'sp-output') {
          this.getStage().fire(event.DRAW_LINE_START, {
            targetNode: this,
            targetPort: evt.target
          });
        }
      }
    });
  }
  // 绘制node基本形状
  spBasicShape() {
    this.spBox = new Konva.Rect({
      x: 0,
      y: 0,
      width: nodeW,
      height: nodeH,
      cornerRadius: 5,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
    });

    this.spText = new Konva.Text({
      text: 'node',
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      width: nodeW,
      padding: 10,
      align: 'center',
      listening: false,
    });
    this.add(this.spBox);
    this.add(this.spText);
  }
  // 绘制端口的形状
  spPortShape() {
    const InputStep = nodeH / (this.inputPortNum + 1);
    for(let i = 0; i < this.inputPortNum; i++) {
      let node = new SPPort({
        x: 0,
        y: InputStep * (i + 1),
        name: 'sp-input'
      })
      this.inputPorts.push(node);
      this.add(node);
    }

    const OnputStep = nodeH / (this.outputPortNum + 1);
    for(let i = 0; i < this.outputPortNum; i++) {
      let node = new SPPort({
        x: nodeW,
        y: OnputStep * (i + 1),
        name: 'sp-output'
      });
      this.outputPorts.push(node);
      this.add(node);
    }
  }
  spSelect(isSelected) {
    this.isSelected = isSelected;
    if(this.isSelected) {
      this.spBox.strokeWidth(4);
    }else {
      this.spBox.strokeWidth(2);
    }
    this.spSelectLines(isSelected);
  }
  spSelectLines(isSelected) {
    for(let i = 0; i < this.lines.length; i++) {
      this.lines[i].spSelect(isSelected);
    }
  }
  spAddLine(line) {
    this.lines.push(line);
  }
  spCheckLineExist(startPort, endPort) {
    for(let i = 0; i < this.lines.length; i++) {
      if(this.lines[i].spIsEqual(startPort, endPort)) {
        return true;
      }
    }
    return false;
  }
  spUpdateLines() {
    for(let i = 0; i < this.lines.length; i++) {
      this.lines[i].spUpdate();
    }
  }
  spRemoveLine(line) {
    let idx = this.lines.indexOf(line);
    if(idx > -1) {
      this.lines.splice(idx, 1);
    }
  }
  spDestroy() {
    let lines = this.lines.slice(0);
    for(let i = 0; i < lines.length; i++) {
      lines[i].spDestroy();
    }
    this.lines = [];
    this.destroy();
  }
}

export default SPNode;