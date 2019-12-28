const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const plotSize = 30;
const horizontalNumberOfPlots = Math.floor(1000 / plotSize);
const verticalNumberOfPlots = Math.floor(500 / plotSize);

let x, y;
for (x = 0; x < horizontalNumberOfPlots; x++) {
  for (y = 0; y < verticalNumberOfPlots; y++) {
    ctx.fillStyle = 'rgb(0, ' + (255 - (x + y) * 4) + ', ' + ((x + y) * 4) + ')';
    ctx.fillRect(x * plotSize, y * plotSize, (x + 1) * plotSize, (y + 1) * plotSize);
  }
}
