const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'public/js/app.js'), 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (e) => { console.error(e); });
virtualConsole.on("jsdomError", (e) => { console.error(e); });

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  virtualConsole: virtualConsole
});

try {
  dom.window.eval(script);
  console.log("Script evaluated successfully.");
} catch (e) {
  console.error("Evaluation error:", e);
}
