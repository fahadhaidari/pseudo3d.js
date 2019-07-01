window.onload = function() {
  const canvas = document.getElementById("canvas");
  const scene = document.getElementById("scene");
  const context = canvas.getContext("2d");
  const sceneContext = scene.getContext("2d");
  const cellSize = 20;
  const screenW = cellSize * map[0].length;
  const screenH = cellSize * map.length;
  const fov = 60;
  const camera = {
    x: parseInt(map[0].length / 2) * cellSize + cellSize / 2,
    y: 14 * cellSize + cellSize / 2,
    rotation: 0,
    angle: toRadian(-90),
    update: function() {
      this.rotation *= 0.5;
      this.angle += this.rotation;
    }
  };
  const colorMap = {
    1: 'orange',
    2: 'green',
    3: 'red',
    4: 'yellow',
    5: '#4488FF'
  };
  const sceneData = [];

  canvas.width = screenW;
  canvas.height = screenH;

  scene.width = 820;
  scene.height = 460;

  scene.style.background = '#111111'
  scene.style.border = 'solid 2px white'

  const drawMap = function(matrix) {
    for (let y = 0; y < matrix.length; y ++) {
      for (let x = 0; x < matrix[y].length; x ++) {
        if (matrix[y][x] > 0 && matrix[y][x] < Object.keys(colorMap).length) {
          const color = colorMap[matrix[y][x]];
          
          rect(context, x * cellSize, y * cellSize, cellSize, cellSize, color, 'stroke');
        }
      }
    }
  };

  const castRay = function(srcX, srcY, angle) {
    let rayX = srcX + Math.cos(angle);
    let rayY = srcY + Math.sin(angle);
    let dst = 0;
    let isHit = false;

    while (!isHit && dst < scene.width) {
      dst += 0.1;
      rayX = srcX + Math.cos(angle) * dst;
      rayY = srcY + Math.sin(angle) * dst;

      const row = parseInt(rayY / cellSize);
      const col = parseInt(rayX / cellSize);

      const a = camera.angle - angle;
      const z = dst * Math.cos(a);
      const h = scene.height / 2 * 64 / z;

      if (rayX > screenW  - 4 || rayX < 4 || rayY < 4 || rayY > screenH - 4) {
        isHit = true;
        sceneData.push({ h, val: 5}); // world boundaries
      } else
      if (map[row][col] > 0 &&  map[row][col] < Object.keys(colorMap).length) {
        isHit = true;
        sceneData.push({ h, val: map[row][col] });
      }
    }
    line(context, srcX, srcY, rayX, rayY);
  };

  const castRays = function() {
    sceneData.length = 0;

    for (let x = -fov / 2; x < fov / 2; x += 0.5) {
      const rayAngle = camera.angle + toRadian(x);
      castRay(camera.x, camera.y, rayAngle);
    }

    const w = parseInt(scene.width / sceneData.length);
  
    for (let i = 0; i < sceneData.length; i ++) {
      const h = sceneData[i].h;
      const alpha = h / 200;
      sceneContext.globalAlpha = alpha;
      const x = i + (i * w);
      const y = scene.height / 2;
      rect(sceneContext, x, y, w,  h, colorMap[sceneData[i].val], "fill", true);
      sceneContext.globalAlpha = 1;
    }
  };

  const update = function() { camera.update(); castRays(); };

  const draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    sceneContext.clearRect(0, 0, scene.width, scene.height);
    drawMap(map);
    circle(context, camera.x, camera.y, 8);
  };

  const frame = function() {
    draw();
    update();
    requestAnimationFrame(frame);
  };

  document.body.onkeydown = function(e) {
    if (e.keyCode === 37)
      camera.rotation -= 0.1
    else
    if (e.keyCode === 39)
      camera.rotation += 0.1
  };

  canvas.onmousemove = function(e) {
    camera.x = e.offsetX;
    camera.y = e.offsetY;
  };

  frame();
};