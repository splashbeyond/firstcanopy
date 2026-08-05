document.querySelectorAll('.criterion').forEach(item => item.addEventListener('click', () => {
  const willOpen = !item.classList.contains('is-open');
  document.querySelectorAll('.criterion').forEach(other => {
    other.classList.remove('is-open');
    other.setAttribute('aria-expanded', 'false');
  });
  if (willOpen) {
    item.classList.add('is-open');
    item.setAttribute('aria-expanded', 'true');
  }
}));

const steps = [
  ['01 / DEFINE', '20% COVERAGE BUILT', 'Build the brief around how you buy.', 'We translate your acquisition thesis into specific search criteria, strategic priorities, exclusions, and a shared qualification standard.', 0],
  ['02 / MAP', '40% COVERAGE BUILT', 'Turn a fragmented market into a prioritized universe.', 'Our origination system maps private companies against the mandate, then concentrates attention where strategic fit is strongest.', .25],
  ['03 / ENGAGE', '60% COVERAGE BUILT', 'Reach the people who can choose to transact.', 'We conduct direct, targeted outreach to owners, founders, CEOs, and other relevant decision-makers.', .5],
  ['04 / QUALIFY', '80% COVERAGE BUILT', 'Separate polite interest from a credible conversation.', 'Our team validates mandate fit, decision-maker access, and genuine transaction receptivity before anything reaches you.', .75],
  ['05 / INTRODUCE', '100% COVERAGE BUILT', 'Connect both sides when the relevance is real.', 'Once the opportunity clears the agreed standard, we facilitate a direct introduction and get out of the way.', 1]
];
const tabs = document.querySelectorAll('[role="tab"]');
const route = document.querySelector('.route');
const routeDot = document.querySelector('.route-dot');
const processCard = document.querySelector('.process-card');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('.hero-video');
function syncHeroMotion() {
  if (reducedMotion.matches) heroVideo?.pause();
  else heroVideo?.play().catch(() => {});
}
syncHeroMotion();
reducedMotion.addEventListener?.('change', syncHeroMotion);
let currentRouteProgress = 0;
let routeAnimation;

function placeRouteDot(progress) {
  const point = route.getPointAtLength(route.getTotalLength() * progress);
  routeDot.setAttribute('cx', point.x);
  routeDot.setAttribute('cy', point.y);
}

function animateRouteDot(to) {
  cancelAnimationFrame(routeAnimation);
  if (reducedMotion.matches) {
    currentRouteProgress = to;
    placeRouteDot(to);
    return;
  }
  const from = currentRouteProgress;
  const started = performance.now();
  const duration = 420;
  const tick = now => {
    const elapsed = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    currentRouteProgress = from + (to - from) * eased;
    placeRouteDot(currentRouteProgress);
    if (elapsed < 1) routeAnimation = requestAnimationFrame(tick);
  };
  routeAnimation = requestAnimationFrame(tick);
}

placeRouteDot(0);
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
  tab.setAttribute('aria-selected', 'true');
  const step = steps[Number(tab.dataset.step)];
  animateRouteDot(step[4]);
  processCard.classList.add('is-changing');
  const updateContent = () => {
    document.querySelector('#step-kicker').textContent = step[0];
    document.querySelector('#step-progress').textContent = step[1];
    document.querySelector('#step-title').textContent = step[2];
    document.querySelector('#step-copy').textContent = step[3];
    processCard.classList.remove('is-changing');
  };
  if (reducedMotion.matches) updateContent();
  else window.setTimeout(updateContent, 130);
}));

document.querySelector('#mandate-form').addEventListener('submit', event => {
  event.preventDefault();
  const sector = document.querySelector('#sector');
  if (!sector.value.trim()) {
    sector.setAttribute('aria-invalid', 'true');
    document.querySelector('#form-note').textContent = 'Please add a sector or acquisition theme to build the brief.';
    sector.focus(); return;
  }
  sector.removeAttribute('aria-invalid');
  const geography = document.querySelector('#geography').value.trim() || 'your priority markets';
  const size = document.querySelector('#size').value.trim() || 'your target size range';
  const priority = document.querySelector('#priority').value.trim() || 'the strategic and ownership characteristics you define';
  const result = document.querySelector('#brief-result');
  result.innerHTML = `<strong>Coverage brief ready.</strong><br>First Canopy would map ${sector.value.trim()} businesses across ${geography}, prioritize companies within ${size}, and qualify owners against ${priority}. The engagement would be billed only when an introduction clears the agreed standard.`;
  result.classList.add('show'); result.focus();
  document.querySelector('#form-note').textContent = 'A strong first brief. Refine any field to make the mandate more specific.';
});
