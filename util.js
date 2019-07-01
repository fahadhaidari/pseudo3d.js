const toRadian = d => d * Math.PI / 180;

const circle = function(context, x, y, r) {
  context.beginPath();
  context.fillStyle = "orange";
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

const line = function(context, sx, sy, tx, ty) {
  const w = 0;
  context.beginPath();
  context.globalAlpha = 0.8;
  context.strokeStyle = "#FFFFFF";
  context.moveTo(sx, sy);
  context.lineTo(tx, ty);
  context.stroke();
  context.globalAlpha = 1;
  context.closePath();

  context.fillStyle = "white";
  context.fillRect(tx - w / 2, ty - w / 2, w, w);
};

const rect = function(context, x, y, w, h, color, mode = "stroke", isCentered = false) {
  context.beginPath();

  if (isCentered) y = y - h / 2

  if (mode === "stroke") {
    context.strokeStyle = color;
    context.strokeRect(x, y, w, h);
    context.stroke();
  } else {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }
  context.closePath();
};