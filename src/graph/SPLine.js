import Konva from 'konva';

import * as event from "./event";
class SPLine extends Konva.Line {
  constructor(config={}) {
    super({
      stroke: '#555',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
      hitStrokeWidth: 8,
      ...config
    });

    // if selected
    this.isSelected = false;

    this.on('click', evt => {
      evt.cancelBubble = true;
      this.getStage().fire(event.LINE_SELECT, {
        target: this
      });
    });
  }
  spUpdate([startX, startY, endX, endY]) {
    this.points([startX, startY, endX, endY]);
  }
}

export default SPLine;