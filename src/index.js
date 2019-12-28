import Complex from 'complex.js';

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = 20;
const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);
const topLeft = Complex(-2, 0.8);
const plotToComplexScale = 3 / horizontalNumberOfPlots;

let x, y;
for (x = 0; x < horizontalNumberOfPlots; x++) {
  for (y = 0; y < verticalNumberOfPlots; y++) {
    let it = iterationsForPlot(x, y);
    ctx.fillStyle = 'rgb(0, ' + (255 - (it * 4)) + ', ' + (it * 4) + ')';
    ctx.fillRect(x * plotSize, y * plotSize, (x + 1) * plotSize, (y + 1) * plotSize);
  }
}

function iterationsForPlot(x, y) {
  const c = topLeft.add(new Complex(x * plotToComplexScale, -(y * plotToComplexScale)));
  return interationsFor(c);
}

function interationsFor(c) {
  let i = 0
  let z = Complex.ZERO;
  while (i < 40 && ((Math.pow(z.re, 2) + Math.pow(z.im, 2)) < 4)) {
    i++;
    z = z.pow(2).add(c);
  }
  return i;
}
