const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const html = fs.readFileSync('../public/index.html', 'utf8');
const script = fs.readFileSync('../public/app.js', 'utf8');

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
