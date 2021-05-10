import SPDynamicLine from './SPDynamicLine'

class SPStaticLine extends SPDynamicLine {
  constructor(config={}) {
    super(config);
    this.startPort = config.startPort;
    this.endPort = config.endPort;
  }
  spUpdate() {
    let scale = this.getStage().scaleX();
    let startPos = this.startPort.getAbsolutePosition();
    this.startPos = {
      x: startPos.x / scale,
      y: startPos.y / scale
    }
    let endPos = this.endPort.getAbsolutePosition();
    this.endPos = {
      x: endPos.x / scale,
      y: endPos.y / scale
    }
    super.spUpdate();
  }
  spIsEqual(sNode, eNode) {
    return (this.startPort === sNode) && (this.endPort === eNode); 
  }
  spSelect(isSelected) {
    this.isSelected = isSelected;
    if(this.isSelected) {
      this.strokeWidth(4);
    }else {
      this.strokeWidth(2);
    }
  }
  spDestroy() {
    this.startPort.getSpnode().spRemoveLine(this);
    this.endPort.getSpnode().spRemoveLine(this);
    this.startPort = null;
    this.endPort = null;
    this.destroy();
  }
}

export default SPStaticLine;