// Simple scroll-driven parallax + fall animation

const prince = document.getElementById("prince");
const layers = document.querySelectorAll(".layer");
const endingCaption = document.querySelector(".ending-caption");

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// Maps scroll progress to 0–1 in a given segment
function segmentProgress(t, start, end) {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return (t - start) / (end - start);
}

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const t = docHeight > 0 ? scrollTop / docHeight : 0; // 0–1

  // Prince fall: starts around top, ends above the hill
  const fallStart = 0.0;
  const fallEnd = 0.8;
  const fallT = segmentProgress(t, fallStart, fallEnd);

  // Ease-out curve so he slows near the end
  const eased = 1 - Math.pow(1 - fallT, 3); // cubic ease out
  const maxFall = window.innerHeight * 1.2; // px
  const yOffset = eased * maxFall;

  // Also add a little rotation so it feels floaty
  const rotateDeg = -10 + eased * 20; // -10deg to +10deg

  prince.style.transform = `translate(-50%, ${yOffset}px) rotate(${rotateDeg}deg)`;

  // Background blending between scenes
  const blackOpacity = 1 - segmentProgress(t, 0.0, 0.2);
  const atmOpacity = segmentProgress(t, 0.05, 0.35) * (1 - segmentProgress(t, 0.5, 0.8));
  const skyOpacity = segmentProgress(t, 0.25, 0.55);
  const hillOpacity = segmentProgress(t, 0.55, 0.9);

  layers.forEach((layer) => {
    if (layer.classList.contains("layer-black")) {
      layer.style.opacity = blackOpacity;
    } else if (layer.classList.contains("layer-atmosphere")) {
      layer.style.opacity = atmOpacity;
    } else if (layer.classList.contains("layer-sky")) {
      layer.style.opacity = skyOpacity;
    } else if (layer.classList.contains("layer-hill")) {
      layer.style.opacity = hillOpacity;
    }

    // subtle parallax shift based on data-depth
    const depth = parseFloat(layer.dataset.depth || "0");
    const shift = scrollTop * depth * -0.15;
    layer.style.transform = `translateY(${shift}px)`;
  });

  // Ending caption fades in once we're almost at the hill
  const captionT = segmentProgress(t, 0.78, 0.98);
  endingCaption.style.opacity = captionT;

  // Optionally, gently lift the title as we scroll down
  const heroTitle = document.querySelector(".hero-title");
  heroTitle.style.opacity = 1 - segmentProgress(t, 0.15, 0.4);
}

window.addEventListener("scroll", onScroll);
window.addEventListener("load", onScroll);
window.addEventListener("resize", onScroll);
