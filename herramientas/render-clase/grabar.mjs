import { chromium } from 'playwright'; // npm i playwright
import { spawn } from 'child_process';
const [url, out, dur, fps, w, h] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(url); await p.waitForFunction('window.listo', null, { timeout: 60000 });
const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',fps,'-c:v','mjpeg','-i','-','-pix_fmt','yuv420p','-c:v','libx264','-crf','18','-preset','slow', out], { stdio: ['pipe','ignore','inherit'] });
const n = Math.round(+dur * +fps);
for (let i = 0; i < n; i++) {
  const d = await p.evaluate(t => { C.render(t); return C.lienzo.toDataURL('image/jpeg', .95); }, i / +fps);
  ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'));
  if (i % 120 === 0) console.log('frame', i, '/', n);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
