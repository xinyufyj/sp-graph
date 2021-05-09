import SPDynamicLine from './SPDynamicLine'

class SPStaticLine extends SPDynamicLine {
  constructor(config={}) {
    super(config);
    this.startPort = config.startPort;
    this.endPort = config.endPort;
  }
  spUpdate() {
    this.startPos = this.startPort.getAbsolutePosition();
    this.endPos = this.endPort.getAbsolutePosition();
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