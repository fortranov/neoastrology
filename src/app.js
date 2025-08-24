// Lightweight natal chart generator in browser using Astronomy Engine

import * as Astronomy from 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.18/esm/index.min.js';

const form = document.getElementById('birth-form');
const chartEl = document.getElementById('chart');
const downloadBtn = document.getElementById('download-png');

const ZODIAC = [
	'♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'
];

const PLANETS = [
	{ key: 'Sun', label: '☉', color: '#ffd166' },
	{ key: 'Moon', label: '☾', color: '#e0e7ff' },
	{ key: 'Mercury', label: '☿', color: '#9be0ff' },
	{ key: 'Venus', label: '♀', color: '#ffc6e0' },
	{ key: 'Mars', label: '♂', color: '#ff6b6b' },
	{ key: 'Jupiter', label: '♃', color: '#ffcf99' },
	{ key: 'Saturn', label: '♄', color: '#d3d6e0' },
	{ key: 'Uranus', label: '♅', color: '#a0f0ff' },
	{ key: 'Neptune', label: '♆', color: '#8fb8ff' },
	{ key: 'Pluto', label: '♇', color: '#f3a8ff' }
];

function parseInputs() {
	const dateStr = document.getElementById('date').value;
	const timeStr = document.getElementById('time').value || '12:00';
	const tz = Number(document.getElementById('tz').value || '0');
	const lat = Number(document.getElementById('lat').value);
	const lon = Number(document.getElementById('lon').value);
	if (!dateStr) throw new Error('Укажите дату');
	const [hh = '0', mm = '0'] = timeStr.split(':');
	// Build UTC Date by subtracting timezone offset (hours)
	const local = new Date(`${dateStr}T${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00`);
	const utc = new Date(local.getTime() - tz * 3600 * 1000);
	return { utc, lat, lon };
}

function mod(a, n) { return ((a % n) + n) % n; }

function degreesToRadians(d) { return d * Math.PI / 180; }
function radiansToDegrees(r) { return r * 180 / Math.PI; }

function zodiacIndexFromLon(lon) { return Math.floor(mod(lon, 360) / 30); }

function describeAngle(lon) {
	const idx = zodiacIndexFromLon(lon);
	const deg = mod(lon, 30);
	return `${deg.toFixed(1)}° ${ZODIAC[idx]}`;
}

function svgEl(tag, attrs = {}, children = []) {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (v != null) el.setAttribute(k, String(v));
	}
	children.forEach(ch => el.appendChild(ch));
	return el;
}

function computeAscendant(date, lat, lon) {
	// Astronomy Engine: use Horizon to compute apparent RA/Dec on horizon east point
	// We sample azimuth=90°, altitude=0° to find ecliptic longitude of the Ascendant
	const observer = new Astronomy.Observer(lat, lon, 0);
	const time = Astronomy.MakeTime(date);
	const ecl = Astronomy.Ecliptic(eclipticFromAzEl(time, observer, 90, 0));
	return mod(ecl.elon, 360);
}

function eclipticFromAzEl(time, observer, azimuthDeg, altitudeDeg) {
	// Convert horizon coordinates (az, alt) to equatorial RA/Dec, then to ecliptic vector
	const refVec = Astronomy.VectorFromHorizon(azimuthDeg, altitudeDeg, time, observer, 'normal');
	const eq = Astronomy.EquatorFromVector(refVec, time, observer, true, true);
	return Astronomy.Equator(eq.ra, eq.dec, eq.dist);
}

async function computePositions(utc, lat, lon) {
	const time = Astronomy.MakeTime(utc);
	const observer = new Astronomy.Observer(lat, lon, 0);
	const results = [];
	for (const bodyDef of PLANETS) {
		const body = Astronomy.Body[bodyDef.key];
		const equ = Astronomy.Equator(body, time, observer, true, true);
		const ecl = Astronomy.Ecliptic(equ);
		results.push({ key: bodyDef.key, glyph: bodyDef.label, color: bodyDef.color, lon: mod(ecl.elon, 360) });
	}
	// Ascendant (house cusp 1)
	let ascLon;
	try { ascLon = computeAscendant(utc, lat, lon); } catch (e) { ascLon = undefined; }
	return { planets: results, asc: ascLon };
}

function drawChart(data) {
	chartEl.innerHTML = '';
	const size = 720;
	const cx = size / 2;
	const cy = size / 2;
	const rOuter = 320;
	const rInner = 260;
	const rPlanets = 220;
	const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, role: 'img' });

	// Background circle
	svg.appendChild(svgEl('circle', { cx, cy, r: rOuter + 8, fill: '#0e1320' }));
	// Wheel rings
	svg.appendChild(svgEl('circle', { cx, cy, r: rOuter, fill: 'none', stroke: '#293043', 'stroke-width': 2 }));
	svg.appendChild(svgEl('circle', { cx, cy, r: rInner, fill: 'none', stroke: '#293043', 'stroke-width': 2 }));

	// Zodiac sectors and labels
	for (let i = 0; i < 12; i++) {
		const start = (i * 30);
		const mid = start + 15;
		const a = degreesToRadians(90 - start);
		const x1 = cx + rInner * Math.cos(a);
		const y1 = cy - rInner * Math.sin(a);
		svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: x1, y2: y1, stroke: '#3a425a', 'stroke-width': 1 }));
		const am = degreesToRadians(90 - mid);
		const xm = cx + (rOuter - 20) * Math.cos(am);
		const ym = cy - (rOuter - 20) * Math.sin(am);
		const label = svgEl('text', { x: xm, y: ym, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: '#c7d3ff', 'font-size': 22 });
		label.textContent = ZODIAC[i];
		svg.appendChild(label);
	}

	// Degree ticks every 10°
	for (let d = 0; d < 360; d += 10) {
		const a = degreesToRadians(90 - d);
		const r1 = rOuter;
		const r2 = d % 30 === 0 ? rInner : rOuter - 8;
		const x1 = cx + r1 * Math.cos(a);
		const y1 = cy - r1 * Math.sin(a);
		const x2 = cx + r2 * Math.cos(a);
		const y2 = cy - r2 * Math.sin(a);
		svg.appendChild(svgEl('line', { x1, y1, x2, y2, stroke: '#485171', 'stroke-width': d % 30 === 0 ? 1.5 : 1 }));
	}

	// Ascendant marker
	if (typeof data.asc === 'number') {
		const d = data.asc;
		const a = degreesToRadians(90 - d);
		const x = cx + (rInner + 6) * Math.cos(a);
		const y = cy - (rInner + 6) * Math.sin(a);
		svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 4, fill: '#7aa2ff' }));
		const t = svgEl('text', { x, y: y - 14, 'text-anchor': 'middle', fill: '#7aa2ff', 'font-size': 12 });
		t.textContent = `Asc ${describeAngle(d)}`;
		svg.appendChild(t);
	}

	// Planets
	for (const p of data.planets) {
		const d = p.lon;
		const a = degreesToRadians(90 - d);
		const x = cx + (rPlanets) * Math.cos(a);
		const y = cy - (rPlanets) * Math.sin(a);
		const text = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 20, fill: p.color, style: 'font-family: "Noto Sans Symbols 2", system-ui' });
		text.textContent = p.glyph;
		svg.appendChild(text);
	}

	// Legend
	const legend = svgEl('text', { x: cx, y: size - 24, 'text-anchor': 'middle', class: 'legend' });
	legend.textContent = data.planets.map(p => `${p.glyph} ${describeAngle(p.lon)}`).join(' • ');
	svg.appendChild(legend);

	chartEl.appendChild(svg);
	downloadBtn.disabled = false;
	return svg;
}

function svgToPng(svgNode) {
	const xml = new XMLSerializer().serializeToString(svgNode);
	const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
	const img = new Image();
	img.decoding = 'async';
	return new Promise((resolve) => {
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 1440;
			canvas.height = 1440;
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = '#0b0d10';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
		};
		img.src = svg64;
	});
}

async function onSubmit(e) {
	e.preventDefault();
	try {
		const { utc, lat, lon } = parseInputs();
		const data = await computePositions(utc, lat, lon);
		const svg = drawChart(data);
		downloadBtn.onclick = async () => {
			const blob = await svgToPng(svg);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'natal-chart.png';
			a.click();
			URL.revokeObjectURL(url);
		};
	} catch (err) {
		alert(err.message || String(err));
	}
}

form.addEventListener('submit', onSubmit);


