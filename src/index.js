import Complex from 'complex.js';
import C2S from 'canvas2svg';
import { saveAs } from 'file-saver';
import iterations from './mandlebrot-set.js';
import html from '../index.html';
import css from '../style.css';

const urlParams = new URLSearchParams(window.location.search);

const plotSize = urlParams.get('plotSize') || 30;
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
const colourScale = 200 / maxNumberOfIterations;

ctx.lineWidth = plotSize / 40;
ctx.lineCap = 'round';

let n, m;
for (n = 0; n < horizontalNumberOfPlots; n++) {
  for (m = 0; m < verticalNumberOfPlots; m++) {
    plot(n, m);
  }
}

document.getElementById('plot').appendChild(ctx.getSvg());
document.getElementById('download-svg').onclick = function() { saveFile(ctx); return false; }


function plot(n, m) {
  let its = iterations(plotToComplex(n, m), maxNumberOfIterations);
  const scale = scaleForIterations(its);
  let prevPos = complexPlotToCoordinates(n, m, its.shift(), scale);
  ctx.beginPath();

  its.forEach((c, i) => {
    const pos = complexPlotToCoordinates(n, m, c, scale);
    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.strokeStyle = colour(i);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    prevPos = pos;
  });
}

function scaleForIterations(iterations) {
  const max = Math.max(...iterations.map( c => Math.max(Math.abs(c.re), Math.abs(c.im)) ));
  return plotSize / (max * 2);
}

function colour(iterationNumber) {
  return 'rgb(' + ((colourScale * iterationNumber)) + ', ' + ((colourScale * iterationNumber) /2) + ', ' + (75 + (colourScale * iterationNumber)) + ')';
}

function complexPlotToCoordinates(n, m, c, scale) {
  const topLeftOfPlot = plotToCoordinates(n, m);
  const middle = { x: topLeftOfPlot.x + (plotSize / 2), y: topLeftOfPlot.y + (plotSize / 2) }

  return { x: middle.x + (c.re * scale), y: middle.y - (c.im * scale) }
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

function saveFile(ctx) {
  const blob = new Blob(
    [ctx.getSerializedSvg()],
    { type: "text/plain;charset=utf-8" }
  );
  saveAs(blob, 'mandlebrot-plot.svg');
}
