const opt = process.argv[2];
const Promize = opt === 'native' ? Promise : require('../src/promize');

const COUNT = 1e5;
let buildStart, buildElapsed, resolveStart, resolveEnd;
let i = COUNT,
  j = COUNT;

function log() {
  const mem = process.memoryUsage();
  console.log(`Benchmark:
  init: ${formatHrtime(buildElapsed)}
  resolve: ${formatHrtime(resolveElapsed)}
  memory: ${Math.floor(mem.rss / 1024 / 1024)}MB
  `);
}

function generatePromize() {
  return new Promize(resolve => setTimeout(() => resolve(), 1));
}

function formatHrtime(hrt) {
  return `${hrt[0]}s ${hrt[1] / 1e6}ms`;
}

buildStart = process.hrtime();
while (i--) {
  generatePromize().then(() => {
    j--;
    if (j) return;
    resolveElapsed = process.hrtime(resolveStart);
    log();
  });
}
buildElapsed = process.hrtime(buildStart);
resolveStart = process.hrtime();
