import SPLine from './SPLine'

class SPDynamicLine extends SPLine {
  constructor(config={}) {
    super(config);
    this.startPos = {x:0, y:0};
    this.endPos = this.startPos;
  }
  spStartPort(port) {
    this.startPos = port.getAbsolutePosition();
    this.endPos = this.startPos;
    this.spUpdate();
  }
  spUpdateEndPosition(pos) {
    this.endPos = pos;
    this.spUpdate();
  }
  spUpdate() {
    super.spUpdate([this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y]);
  }
}

export default SPDynamicLine;