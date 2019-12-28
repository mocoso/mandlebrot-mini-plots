import Complex from 'complex.js';
import iterations from './mandlebrot-set.js';

const urlParams = new URLSearchParams(window.location.search);

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = urlParams.get('plotSize') || 20;
let topLeft;
if (urlParams.get('topLeft')) {
  console.log(urlParams.get('topLeft'));
  topLeft = Complex(urlParams.get('topLeft'));
} else {
  topLeft = Complex(-2, 0.8);
}
const complexWidth = urlParams.get('width') || 2;

const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);
const pixelsToComplexScale = complexWidth / 1000;
const lengthOfComplexAxisInPlot = 2;
const complexScaleinPlot = plotSize / lengthOfComplexAxisInPlot;

ctx.lineWidth = plotSize / 40;

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

function plot(n, m) {
  let its = iterations(plotToComplex(n, m, 40));
  let prevPos = complexPlotToCoordinates(n, m, its.shift);
  ctx.beginPath();
  its.forEach((c, i) => {
    const pos = complexPlotToCoordinates(n, m, c);
    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.strokeStyle = colour(i);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    prevPos = pos;
  });
}

function colour(iterationNumber) {
  return 'rgba(0, ' + (120 - (3 * iterationNumber)) + ', ' + (3 * iterationNumber) + ', 0.5)';
}

function complexPlotToCoordinates(n, m, c) {
  const topLeftOfPlot = plotToCoordinates(n, m);
  const middle = { x: topLeftOfPlot.x + (plotSize / 2), y: topLeftOfPlot.y + (plotSize / 2) }

  return { x: middle.x + (c.re * complexScaleinPlot), y: middle.y - (c.im * complexScaleinPlot) }
}

function plotToCoordinates(n, m) {
  return {
    x: (n * plotSize) + ((m % 2) * plotSize * Math.cos(Math.PI/3)),
    y: m * plotSize * 2 * Math.cos(Math.PI/3)
  }
}

function plotToComplex(n, m) {
  const coords = plotToCoordinates(n, m);
  return topLeft.add(new Complex(coords.x * pixelsToComplexScale, -(coords.y * pixelsToComplexScale)));
}
