import Complex from 'complex.js';
import C2S from 'canvas2svg';
import iterations from './mandlebrot-set.js';
import html from '../index.html';
import css from '../style.css';

const urlParams = new URLSearchParams(window.location.search);

const plotSize = urlParams.get('plotSize') || 20;
let middle;
if (urlParams.get('middle')) {
  console.log(urlParams.get('middle'));
  middle = Complex(urlParams.get('middle'));
} else {
  middle = Complex(-0.5);
}
const complexWidth = urlParams.get('complexWidth') || 3;
const maxNumberOfIterations = urlParams.get('maxNumberOfIterations') || 40;

function setFormField(name, value) {
  document.getElementById(name).setAttribute('value', value);
}
setFormField('middle', middle);
setFormField('complexWidth', complexWidth);
setFormField('plotSize', plotSize);
setFormField('maxNumberOfIterations', maxNumberOfIterations);

const ctx = new C2S(900, 750);

const horizontalNumberOfPlots = Math.floor(ctx.width / plotSize);
const verticalNumberOfPlots = Math.floor(ctx.height / plotSize);
const pixelsToComplexScale = complexWidth / ctx.width;
const lengthOfComplexAxisInPlot = 2;
const complexScaleinPlot = plotSize / lengthOfComplexAxisInPlot;
const colourScale = 200 / maxNumberOfIterations;

ctx.lineWidth = plotSize / 40;

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

document.getElementById('plot').appendChild(ctx.getSvg());


function plot(n, m) {
  let its = iterations(plotToComplex(n, m), maxNumberOfIterations);
  let prevPos = complexPlotToCoordinates(n, m, its.shift());
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
  return 'rgb(' + ((colourScale * iterationNumber)) + ', ' + ((colourScale * iterationNumber) /2) + ', ' + (75 + (colourScale * iterationNumber)) + ')';
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
  return middle.add(new Complex((coords.x - ctx.width / 2) * pixelsToComplexScale, -((coords.y - ctx.height / 2) * pixelsToComplexScale)));
}
