import Konva from 'konva';

import SPLayer from "./SPLayer";
import SPStaticLine from "./SPStaticLine";
import SPDynamicLine from "./SPDynamicLine";
import SPNode from "./SPNode";
import * as event from "./event";

class SPStage extends Konva.Stage {
  constructor(config) {
    super(config);
    // layer for nodes
    this.nodeLayer = new SPLayer();

    // dynamic line
    this.dynamicLine = new SPDynamicLine({name: 'sp-dynamic-line'});
    this.dynamicLine.hide();
    
    this.add(this.nodeLayer);
    this.nodeLayer.add(this.dynamicLine);

    // 点击选中节点或线
    // 当前选中的节点
    this.selNode = null;
    // 当前选中的线
    this.selLine = null;
    this.spSelectNodeorLineFunc();

    // 画线
    this.isDrawingLine = false;
    this.drawingStartPort = null;
    this.drawingEndPort = null;
    this.drawingEndPrePort = null;
    this.spDrawDynamicLine();

    // 拖动node, 更新 staticLine
    this.spUpdateStaticLines();
  }
  // 重绘
  spRedraw() {
    this.nodeLayer.draw();
  }
  // 增加节点
  spAddNode() {
    this.nodeLayer.add(new SPNode());
    this.spRedraw();
  }
  // 删除选中节点
  spRemoveSelNode() {
    if(this.selNode) {
      this.selNode.spDestroy();
    }
    if(this.selLine) {
      this.selLine.spDestroy();
    }
    if(this.selNode || this.selLine) {
      this.spRedraw();
    }
    this.selNode = null;
    this.selLine = null;
  }
  // 点击选中节点或线
  spSelectNodeorLineFunc() {
    this.on(event.NODE_SELECT, ({ target }) => {
      if(this.selNode === target) return;
      if(this.selLine) {
        this.selLine.spSelect(false);
        this.selLine = false;
      }
      if(this.selNode) {
        this.selNode.spSelect(false);
      }
      this.selNode = target;
      this.selNode.spSelect(true);
      this.spRedraw();
    });
    this.on(event.LINE_SELECT, ({ target }) => {
      if(this.selLine === target) return;
      if(this.selLine) {
        this.selLine.spSelect(false);
      }
      if(this.selNode) {
        this.selNode.spSelect(false);
        this.selNode = null;
      }
      this.selLine = target;
      this.selLine.spSelect(true);
      this.spRedraw();
    });
    this.on('click', () => {
      if(this.selNode) {
        this.selNode.spSelect(false);
      }
      if(this.selLine) {
        this.selLine.spSelect(false);  
      }
      if(this.selNode || this.selLine) {
        this.spRedraw();
      }
      this.selNode = null;
      this.selLine = null;
    })
  }
  // 画线
  spDrawDynamicLine() {
    this.on(event.DRAW_LINE_START, ({ targetNode, targetPort }) => {
      this.isDrawingLine = true;
      this.drawingStartPort = targetPort;
      this.drawingStartPort.spHighlight(true);
      this.dynamicLine.show();
      this.dynamicLine.spStartPort(targetPort);
    });
    this.on('mousemove', () => {
      if(!this.isDrawingLine) {
        return;
      }
      let pos = this.getPointerPosition();
      this.dynamicLine.spUpdateEndPosition(pos);
      if(this.drawingEndPrePort) {
        this.drawingEndPrePort.spHighlight(false);
      }
      let curPort = this.nodeLayer.getIntersection(pos, '.sp-input');
      if(curPort && 
        (curPort.getSpnode() === this.drawingStartPort.getSpnode() 
        || curPort.getSpnode().spCheckLineExist(this.drawingStartPort, curPort))) {
        curPort = null;
      }
      this.drawingEndPort = curPort;
      if(this.drawingEndPort) {
        this.drawingEndPrePort = curPort;
        this.drawingEndPort.spHighlight(true);
      }
      this.spRedraw();
    });
    this.on('mouseup', () => {
      if(!this.isDrawingLine) {
        return;
      }
      this.isDrawingLine = false;
      this.drawingStartPort.spHighlight(false);
      if(this.drawingEndPrePort) {
        this.drawingEndPrePort.spHighlight(false);
      }
      if(this.drawingEndPort) {
        this.spAddStaticLine(this.drawingStartPort, this.drawingEndPort);
      }
      this.drawingStartPort = null;
      this.drawingEndPrePort = null;
      this.drawingEndPort = null;
      this.dynamicLine.hide();
      this.spRedraw();
    });
  }
  // 画静态线
  spAddStaticLine(startPort, endPort) {
    let staticLine = new SPStaticLine({
      startPort,
      endPort,
    })
    staticLine.spUpdate();
    // 将 port 节点保存至 spnode
    startPort.getSpnode().spAddLine(staticLine);
    endPort.getSpnode().spAddLine(staticLine);
    this.nodeLayer.add(staticLine);
    staticLine.moveToBottom();
  }
  // 当拖动 spnode 时，更新staticline
  spUpdateStaticLines() {
    this.on('dragmove', evt => {
      if(evt.target.name() === 'sp-node') {
        evt.target.spUpdateLines();
        this.spRedraw();
      }
    });
  }
}

export default SPStage;