import SPLine from './SPLine'
import * as utils from './utils'

class SPDynamicLine extends SPLine {
  constructor(config={}) {
    super(config);
    this.startPos = {x:0, y:0};
    this.endPos = this.startPos;
  }
  spStartPort(port) {
    let pos = port.getAbsolutePosition();
    this.startPos = utils.getRelativePosition(this.getLayer(), pos);
    this.endPos = this.startPos;
    this.spUpdate();
  }
  spUpdateEndPosition(pos) {
    this.endPos = utils.getRelativePosition(this.getLayer(), pos);
    this.spUpdate();
  }
  spUpdate() {
    super.spUpdate([this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y]);
  }
}

export default SPDynamicLine;