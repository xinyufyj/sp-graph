export function getRelativePosition(node, pos) {
  // the function will return pointer position relative to the passed node
  var transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  // var pos = node.getStage().getPointerPosition();

  // now we find a relative point
  return transform.point(pos);
}