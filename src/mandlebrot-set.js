import Complex from "complex.js";

export default function iterations(c, maxNumberOfIterations) {
  let i = 0;
  let z = Complex.ZERO;
  let iterations = [];

  while (
    i < maxNumberOfIterations &&
    Math.pow(z.re, 2) + Math.pow(z.im, 2) < 4
  ) {
    i++;
    iterations.push(z);
    z = z.pow(2).add(c);
  }

  return iterations;
}
