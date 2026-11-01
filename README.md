<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:140c08,55:3b241a,100:C96A4B&height=235&section=header&text=Spatial%20Ink&fontSize=46&fontColor=fdf3ec&fontAlignY=40&desc=Draw%20in%20the%20air%20with%20a%20webcam%20and%20two%20fingers&descSize=17&descAlignY=62&animation=twinkling" alt="Spatial Ink" width="100%">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=19&duration=3200&pause=900&color=D4A373&center=true&vCenter=true&width=680&lines=Pinch%20to%20draw%2C%20fist%20to%20grab%2C%20open%20hand%20to%20hover;21%20landmarks%20a%20frame%2C%20smoothed%20before%20they%20reach%20the%20canvas;Calibrate%20once%20and%20the%20cursor%20stops%20shaking" alt="Typing animation" />

<br />

<a href="https://spatial-ink.vercel.app/"><img src="https://img.shields.io/badge/%E2%96%B6%20Draw%20something-C96A4B?style=for-the-badge&labelColor=140c08&logo=vercel&logoColor=D4A373" alt="Draw something" /></a>

</div>

<div align="center">

<img src="https://img.shields.io/badge/Hand%20tracking-MediaPipe-D4A373?style=flat-square&labelColor=140c08" alt="MediaPipe" />
<img src="https://img.shields.io/badge/Gestures-3-C96A4B?style=flat-square&labelColor=140c08" alt="Three gestures" />
<img src="https://img.shields.io/badge/Canvas-2D-E78F72?style=flat-square&labelColor=140c08" alt="Canvas 2D" />
<img src="https://img.shields.io/badge/On%20device-inference-9CB48A?style=flat-square&labelColor=140c08" alt="On-device inference" />
<img src="https://img.shields.io/badge/Language-en%20%2B%20zh-D4A373?style=flat-square&labelColor=140c08" alt="English and Chinese" />

</div>

<br />

<div align="center">

### <a href="https://spatial-ink.vercel.app/">spatial-ink.vercel.app</a>

<sub>Needs a camera and reasonable light. Nothing is uploaded — the model runs in the tab.</sub>

</div>

---

<div align="center">

## What it is

</div>

An air-drawing tool. Your webcam watches your hand, a landmark model turns it into 21 points per frame, and those points become a cursor and a pen. **Pinch** your thumb and index finger together and a stroke starts. **Open your hand** and you are just moving the cursor. **Close a fist** and you grab whatever stroke is under it and drag it across the page.

No tablet, no stylus, no hardware beyond the camera already in the laptop. The whole thing is a canvas, a hand-tracking model, and a set of thresholds tuned so the difference between "I am drawing" and "I am moving" is a gesture rather than a mode switch.

<div align="center">

<sub>Two supported paths: the free draw surface at <code>/</code>, and <code>/camera-calibration</code> when the cursor will not settle.</sub>

</div>

---

<div align="center">

## The three gestures

</div>

<ul>
<li><b>Pinch → draw.</b> The distance between thumb tip and index tip, normalized by hand size. Below <code>0.105</code>, the pen is down. A new stroke is created on the transition, not on every frame, so a single pinch is a single stroke.</li>
<li><b>Open hand → hover.</b> Pen up, cursor follows. This is the default state and the one you spend most of the time in.</li>
<li><b>Fist → grab.</b> Four fingertips curled past <code>1.32×</code> their knuckle distance counts as a fist; at <code>0.54</code> or higher the app looks for a stroke within <code>118 px</code> of the cursor and drags it by an <code>{ x, y }</code> offset instead of rewriting its points.</li>
</ul>

<div align="center">

<sub>Offsets, not point rewrites — that is what makes grabbing a stroke cheap and undoable without storing every frame of the drag.</sub>

</div>

---

<div align="center">

## What is inside

</div>

<ul>
<li><b>Mirrored, smoothed input</b> — the model's <code>x</code> is flipped to <code>1 - x</code> so the cursor moves the way a mirror does, then put through an exponential filter so a shaky hand draws a line rather than a scribble.</li>
<li><b>Five ink colours</b> — terracotta <code>#C96A4B</code>, sand <code>#D4A373</code>, sage <code>#9CB48A</code>, coral <code>#E78F72</code>, clay <code>#B88768</code>. All warm on purpose: they survive a dim webcam frame, which is where cool mid-tones turn to mud.</li>
<li><b>Adjustable everything</b> — <code>/settings</code> exposes pinch threshold, fist threshold, smoothing, grab radius and stroke width, saved to <code>localStorage</code>.</li>
<li><b>Calibration that reads your room</b> — <code>/camera-calibration</code> measures how wide your hand appears and labels you <b>far</b>, <b>ideal</b> or <b>close</b>, then reads tracking confidence to say whether the light is the problem.</li>
<li><b>Onboarding once</b> — a first-run card explains the three gestures; dismissed state is remembered.</li>
<li><b>Live status, not a spinner</b> — a status line says what the model currently sees (no hand, hand detected, pinched, moving) so a failed gesture is diagnosable in one look.</li>
<li><b>MCP tools for the awkward cases</b> — <code>diagnose-camera</code>, <code>recommend-settings</code>, <code>spatial-guidance</code> and <code>summarize-session</code> answer "why does the cursor shake" without the user guessing at sliders.</li>
<li><b>Bilingual</b> — <code>en-US</code> and <code>zh-CN</code> through one i18n provider.</li>
</ul>

---

<div align="center">

## Stack

</div>

<ul>
<li><b>Next.js (App Router) + React + TypeScript</b> — the route shell is static; the drawing surface is one client component tree.</li>
<li><b>@mediapipe/tasks-vision</b> — <code>HandLandmarker</code> on WASM, GPU delegate when available, running per animation frame.</li>
<li><b>Canvas 2D</b> — strokes are plain point arrays drawn as polylines; no scene graph, no WebGL, so the frame budget belongs to the model.</li>
<li><b>Tailwind CSS</b> — the warm palette is defined once as tokens.</li>
<li><b>localStorage</b> — settings under <code>spatial-gesture-settings</code>, onboarding under <code>spatial-gesture-onboarding-seen</code>.</li>
</ul>

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,vercel,git" alt="Next.js, React, TypeScript, Tailwind, Vercel, Git" />

</div>

---

<div align="center">

## Under the hood

</div>

<details>
<summary><b>The filter, and why it is the difference between usable and unusable</b></summary>

<br />

<p>Raw landmarks jitter by a few pixels every frame, which at 60 fps reads as a buzz. The cursor is filtered with an exponential moving average:</p>

<pre><code>export function smoothPoint(previous: Point | null, next: Point, smoothing: number): Point {
  if (!previous) return next;
  const alpha = Math.min(Math.max(smoothing, 0.05), 0.95);
  return {
    x: previous.x + (next.x - previous.x) * alpha,
    y: previous.y + (next.y - previous.y) * alpha,
  };
}</code></pre>

<p><code>alpha</code> is clamped rather than trusted: at <code>0</code> the cursor would never move, at <code>1</code> there is no filter at all, and both are reachable by dragging a slider. Default is <code>0.68</code> — enough lag to kill the buzz, little enough that a fast stroke does not trail behind the hand.</p>

</details>

<details>
<summary><b>Detecting a fist from distances, not from a pretrained classifier</b></summary>

<br />

<p>Every fingertip is compared against the distance from its own knuckle to the palm centre. If the tip is closer than <code>knuckle × 1.32</code>, that finger is curled:</p>

<pre><code>const knuckleDistances = HAND_CONNECTIONS.lowerKnuckles.map((i) =&gt; distance(points[i], palm));
const curled = fingertipDistances.filter((d, i) =&gt; d &lt; knuckleDistances[i] * 1.32).length;
const fistScore = curled / 4;</code></pre>

<p>That ratio is what makes it work at any distance from the camera: nothing here is measured in pixels, so moving closer does not turn every open hand into a fist. A separate gesture classifier would have needed its own model, its own asset, and its own training data.</p>

<p>The final state is decided in one line, in priority order:</p>

<pre><code>fistScore &gt;= fistThreshold ? "moving"
  : pinchDistance &lt;= pinchThreshold ? "pinched"
  : "hand-detected";</code></pre>

</details>

<details>
<summary><b>Grabbing without storing a drag history</b></summary>

<br />

<p>A stroke is <code>{ points[], colour, width, offset: { x, y } }</code>. Grabbing only changes <code>offset</code>; hit-testing walks the stroke's points, applies the current offset, and returns true as soon as any point is within <code>grabRadius</code>:</p>

<pre><code>for (const strokePoint of stroke.points) {
  const d = distance(point, { x: strokePoint.x + stroke.offset.x,
                               y: strokePoint.y + stroke.offset.y });
  if (d &lt; closest) closest = d;
  if (closest &lt;= radius) return true;   // early exit
}</code></pre>

<p>So moving a 900-point stroke costs one number, undo is one number back, and rendering stays a transform rather than a re-projection of every point.</p>

</details>

<details>
<summary><b>Calibration as guidance, not as a wizard</b></summary>

<br />

<p>The calibration screen does not try to auto-tune. It tells you which of three problems you have:</p>

<ul>
<li><b>Too far</b> — your hand spans under ~130 px in frame, so landmark error dominates the gesture. Move closer.</li>
<li><b>Too close</b> — your hand spans past ~330 px and parts leave the frame, so the fingertip distances go missing mid-gesture.</li>
<li><b>Dark</b> — landmarks are still found but confidence is low, so the model is guessing between frames. Add light.</li>
</ul>

<p>Each finding pairs with the setting to change, which is also what the <code>recommend-settings</code> tool returns. Detecting the problem is easy; telling someone which slider to move is the useful part.</p>

</details>

---

<div align="center">

## Project structure

</div>

<pre><code>SpatialInk/
├── src/app/
│   ├── page.tsx                     # draw surface
│   ├── settings/page.tsx            # thresholds + palette
│   └── camera-calibration/page.tsx  # distance / lighting guidance
├── src/hooks/
│   ├── use-spatial-gesture.ts       # landmarker loop, gesture state, grab/drag
│   └── use-gesture-settings.ts      # persisted settings
├── src/lib/spatial/
│   ├── geometry.ts                  # smoothing, distance, hit-test, bounds
│   ├── settings.ts                  # defaults: 0.105 / 0.54 / 0.68 / 118 / 8
│   └── types.ts
└── src/components/spatial/          # canvas, HUD, onboarding, status copy</code></pre>

---

<div align="center">

## Run it

</div>

<pre><code>git clone https://github.com/Jivaansh-Yadav/SpatialInk.git
cd SpatialInk
npm install
npm run dev            # then open / and allow the camera</code></pre>

<p>Camera access requires <code>https</code> or <code>localhost</code> — browsers refuse it otherwise. The model and WASM binaries ship with the app, so there is no CDN dependency at runtime.</p>

<div align="center">

<sub>If the ink looks like a seismograph, open <b>/settings</b> and raise smoothing — but check <b>/camera-calibration</b> first. The usual cause is a hand too far from the lens.</sub>

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:140c08,55:3b241a,100:C96A4B&height=110&section=footer&reversal=true" alt="" width="100%">
