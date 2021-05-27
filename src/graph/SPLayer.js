import Konva from 'konva';
class SPLayer extends Konva.Layer {
  constructor(config={}) {
    super({
      ...config,
    })
  }
}
export default SPLayer;