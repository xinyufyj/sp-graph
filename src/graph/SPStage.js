import Konva from 'konva';

import SPLayer from "./SPLayer";
import SPStaticLine from "./SPStaticLine";
import SPDynamicLine from "./SPDynamicLine";
import SPNode from "./SPNode";
import SPGridLayer from "./SPGridLayer";
import * as event from "./event";
import * as utils from './utils';

class SPStage extends Konva.Stage {
  constructor(config) {
    super(config);
    // lager for grid
    this.gridLayer = new SPGridLayer({
      stageWidth: config.width,
      stageHeight: config.height
    });
    
    // layer for nodes
    this.nodeLayer = new SPLayer();

    // dynamic line
    this.dynamicLine = new SPDynamicLine({name: 'sp-dynamic-line'});
    this.dynamicLine.hide();

    this.nodeLayer.add(this.dynamicLine);

    this.add(this.gridLayer, this.nodeLayer);

    // 1.点击选中节点或线
    // 当前选中的节点
    this.selNode = null;
    // 当前选中的线
    this.selLine = null;
    this.spSelectNodeorLineFunc();

    // 2.画线
    this.isDrawingLine = false;
    this.drawingStartPort = null;
    this.drawingEndPort = null;
    this.drawingEndPrePort = null;
    this.spDrawDynamicLine();

    // 3.拖动node, 更新 staticLine
    this.spUpdateStaticLines();

    // 4.监听鼠标滚轮
    this.spListenWheel();

    // 5.拖动画布
    this.isDragStart = false;
    this.spDragStartPos = {x:0, y:0};
    this.spDragCanvas();

    this.batchDraw();
  }
  // 重绘
  spRedraw() {
    this.nodeLayer.draw();
  }
  // 增加节点
  spAddNode() {
    let pos = utils.getRelativePosition(this.nodeLayer, {x: 20, y: 20});
    this.nodeLayer.add(new SPNode({
      ...pos
    }));
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
      this.nodeLayer.batchDraw();
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
      name: 'sp-static-line',
      startPort,
      endPort,
    })
    this.nodeLayer.add(staticLine);
    staticLine.moveToBottom();
    staticLine.spUpdate();
    // 将 port 节点保存至 spnode
    startPort.getSpnode().spAddLine(staticLine);
    endPort.getSpnode().spAddLine(staticLine);
  }
  // 当拖动 spnode 时，更新staticline
  spUpdateStaticLines() {
    this.on('dragmove', evt => {
      if(evt.target.name() === 'sp-node') {
        evt.target.spUpdateLines();
        this.nodeLayer.batchDraw();
      }
    });
  }
  spListenWheel() {
    this.on('wheel', e => {
      e.evt.preventDefault();      
      let oldScale = this.nodeLayer.scaleX();

      // let pointer = utils.getRelativePosition(this.nodeLayer, this.getPointerPosition());
      let pointer = this.getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - this.nodeLayer.x()) / oldScale,
        y: (pointer.y - this.nodeLayer.y()) / oldScale,
      };

      let newScale =
        e.evt.deltaY > 0 ? oldScale + 0.2 : oldScale - 0.2;

      newScale = Math.max(Math.min(5.0, newScale), 0.4);

      this.nodeLayer.scale({ x: newScale, y: newScale });

      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.nodeLayer.position(newPos);
      this.batchDraw();
    })
  }
  spDragCanvas() {
    this.on("mousedown", evt => {
      if(evt.target.name() !== 'sp-stage') {
        this.isDragStart = false;
        return;
      }
      this.isDragStart = true;
      this.spDragStartPos = this.getPointerPosition();
    });
    this.on("mousemove", () => {
      if(!this.isDragStart) {
        return;
      }
      let pos = this.getPointerPosition();
      // let scale = this.nodeLayer.scaleX();
      this.nodeLayer.x(this.nodeLayer.x() +  (pos.x - this.spDragStartPos.x));
      this.nodeLayer.y(this.nodeLayer.y() +  (pos.y - this.spDragStartPos.y));
      // for(let i = 0; i < this.nodeLayer.children.length; i++) {
      //   let node = this.nodeLayer.children[i];
      //   if(node.name() !== 'sp-node') continue;
      //   node.x(node.x() + (pos.x - this.spDragStartPos.x) / scale);
      //   node.y(node.y() + (pos.y - this.spDragStartPos.y) / scale);
      //   node.spUpdateLines();
      // }
      this.spDragStartPos = pos;
      this.nodeLayer.batchDraw();
    });
    this.on("mouseup", evt => {
      this.isDragStart = false;
    });
  }
}

export default SPStage;