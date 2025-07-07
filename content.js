function convertAllEdgesToStraightLines() {
  document.querySelectorAll('path.vue-flow__edge-path, path.vue-flow__edge-interaction').forEach(path => {
    const d = path.getAttribute('d');
    if (!d || !d.includes('C')) return;

    try {
      const [start, , , end] = d
        .replace(/^M/, '')
        .split('C')
        .flatMap(s => s.trim().split(' '))
        .filter(Boolean);

      const newD = `M ${start} L ${end}`;
      path.setAttribute('d', newD);
    } catch (err) {
      console.warn('Failed to parse path:', d);
    }
  });
}

function startEdgeObserver() {
  const edgeGroup = document.querySelector('.vue-flow__edges');
  if (!edgeGroup) return;

  const observer = new MutationObserver(() => {
    convertAllEdgesToStraightLines();
  });

  observer.observe(edgeGroup, { childList: true, subtree: true });
  convertAllEdgesToStraightLines();
}

function init() {
  chrome.storage.sync.get(["enabled"], (result) => {
    if (result.enabled) {
      console.log("✅ Edge straightener enabled.");
      const interval = setInterval(() => {
        const edgeGroup = document.querySelector('.vue-flow__edges');
        if (edgeGroup) {
          clearInterval(interval);
          startEdgeObserver();
        }
      }, 500);
    } else {
      console.log("⛔ Edge straightener disabled.");
    }
  });
}

init();
