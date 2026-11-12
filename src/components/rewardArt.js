// Reward artwork is drawn as SVG from the colours in content/rewards.json, so
// the ID team can restyle rewards without image files. Cosmetic only.

const TREE = [
  [0.5, 0.3, null],
  [0.32, 0.5, 0], [0.68, 0.5, 0],
  [0.22, 0.7, 1], [0.42, 0.7, 1], [0.58, 0.7, 2], [0.78, 0.7, 2],
];

function treeMarkup(width, height, stroke, fill, radius) {
  const points = TREE.map(([x, y]) => [x * width, y * height]);
  const edges = TREE
    .map(([, , parent], index) => (parent === null ? '' : `<line x1="${points[parent][0]}" y1="${points[parent][1]}" x2="${points[index][0]}" y2="${points[index][1]}" stroke="${stroke}" stroke-width="${radius / 6}" stroke-opacity="0.55"/>`))
    .join('');
  const nodes = points
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${radius / 6}"/>`)
    .join('');
  return edges + nodes;
}

function escapeText(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function bannerSvg(reward) {
  const [dark, light] = reward.colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" width="600" height="120">`
    + `<rect width="600" height="120" fill="${light}"/>`
    + `<g transform="translate(430 0)">${treeMarkup(170, 120, dark, light, 9)}</g>`
    + `<text x="28" y="58" font-family="Georgia, serif" font-size="30" fill="${dark}">${escapeText(reward.title)}</text>`
    + `<text x="28" y="86" font-family="Arial, sans-serif" font-size="13" letter-spacing="2" fill="${dark}">COS212 BST TUTOR</text>`
    + '</svg>';
}

export function wallpaperSvg(reward) {
  const [dark, light] = reward.colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">`
    + `<rect width="1920" height="1080" fill="${dark}"/>`
    + `<g transform="translate(960 140)">${treeMarkup(860, 860, light, dark, 38)}</g>`
    + `<text x="120" y="470" font-family="Georgia, serif" font-size="96" fill="${light}">${escapeText(reward.title)}</text>`
    + `<text x="124" y="540" font-family="Arial, sans-serif" font-size="28" letter-spacing="6" fill="${light}" fill-opacity="0.8">COS212 BINARY SEARCH TREES</text>`
    + '</svg>';
}

export function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function downloadText(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
