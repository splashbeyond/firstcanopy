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
const mandateChecklist = document.querySelector('#mandate-checklist');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileHero = window.matchMedia('(max-width: 600px)');
const heroVideo = document.querySelector('.hero-video');
function syncHeroMotion() {
  if (reducedMotion.matches || mobileHero.matches) heroVideo?.pause();
  else heroVideo?.play().catch(() => {});
}
syncHeroMotion();
reducedMotion.addEventListener?.('change', syncHeroMotion);
mobileHero.addEventListener?.('change', syncHeroMotion);
let isResettingHeroVideo = false;
function resetHeroVideoLoop() {
  if (!heroVideo || isResettingHeroVideo || !Number.isFinite(heroVideo.duration)) return;
  if (heroVideo.duration - heroVideo.currentTime > .45) return;
  isResettingHeroVideo = true;
  heroVideo.classList.add('is-looping');
  window.setTimeout(() => {
    heroVideo.currentTime = .04;
    heroVideo.play().catch(() => {});
  }, 180);
}
heroVideo?.addEventListener('timeupdate', resetHeroVideoLoop);
heroVideo?.addEventListener('seeked', () => {
  window.requestAnimationFrame(() => {
    heroVideo.classList.remove('is-looping');
    isResettingHeroVideo = false;
  });
});
heroVideo?.addEventListener('ended', () => {
  heroVideo.currentTime = .04;
  heroVideo.play().catch(() => {});
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function setMobileMenu(open) {
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  mobileMenu?.classList.toggle('is-open', open);
}
menuToggle?.addEventListener('click', () => setMobileMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobileMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMobileMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (menuToggle?.getAttribute('aria-expanded') !== 'true') return;
  if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) setMobileMenu(false);
});
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
    mandateChecklist.hidden = Number(tab.dataset.step) !== 0;
    processCard.classList.remove('is-changing');
  };
  if (reducedMotion.matches) updateContent();
  else window.setTimeout(updateContent, 130);
}));

const mandateForm = document.querySelector('#mandate-form');
const bookingStep = document.querySelector('#booking-step');
const bookingSuccess = document.querySelector('#booking-success');
const openCalendarButton = document.querySelector('#open-calendar');
const mandateSection = document.querySelector('#mandate');
const formNote = document.querySelector('#form-note');
let bookingUrl = 'https://calendly.com/davis-firstcanopy/30min?primary_color=0c2b23';

function setIntakeProgress(step) {
  document.querySelectorAll('[data-intake-progress]').forEach(item => item.classList.toggle('is-active', item.dataset.intakeProgress === step));
}

function prepareBookingUrl(name, email) {
  const url = new URL('https://calendly.com/davis-firstcanopy/30min');
  const value = id => document.querySelector(`#${id}`).value.trim() || 'Not specified';
  const targetProfile = `EBITDA: ${value('ebitda')} | Revenue / enterprise value: ${value('size')} | Ownership: ${value('ownership')}`;
  const transactionBrief = `Transaction preference: ${value('transaction')} | Priorities and exclusions: ${value('priority')}`;
  url.searchParams.set('primary_color', '0c2b23');
  if (name) url.searchParams.set('name', name);
  url.searchParams.set('email', email);
  url.searchParams.set('a1', value('company'));
  url.searchParams.set('a2', value('role'));
  url.searchParams.set('a3', value('sector'));
  url.searchParams.set('a4', value('geography'));
  url.searchParams.set('a5', targetProfile);
  url.searchParams.set('a6', transactionBrief);
  url.searchParams.set('utm_source', 'firstcanopy-site');
  url.searchParams.set('utm_medium', 'mandate-intake');
  bookingUrl = url.toString();
  openCalendarButton.href = bookingUrl;
}

function openCalendlyPopup() {
  if (!window.Calendly?.initPopupWidget) return false;
  window.Calendly.initPopupWidget({ url: bookingUrl });
  return true;
}

mandateForm.addEventListener('submit', event => {
  event.preventDefault();
  const requiredFields = [...mandateForm.querySelectorAll('[required]')];
  requiredFields.forEach(field => field.removeAttribute('aria-invalid'));
  const invalidField = requiredFields.find(field => !field.checkValidity());
  if (invalidField) {
    invalidField.setAttribute('aria-invalid', 'true');
    formNote.textContent = 'Please enter a valid work email before scheduling.';
    invalidField.focus();
    return;
  }
  mandateForm.hidden = true;
  bookingSuccess.hidden = true;
  bookingStep.hidden = false;
  mandateSection.classList.add('is-scheduling');
  setIntakeProgress('schedule');
  prepareBookingUrl(document.querySelector('#full-name').value.trim(), document.querySelector('#work-email').value.trim());
  openCalendlyPopup();
  document.querySelector('#booking-title').focus?.();
  bookingStep.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
});

document.querySelector('#booking-back').addEventListener('click', () => {
  bookingStep.hidden = true;
  mandateForm.hidden = false;
  mandateSection.classList.remove('is-scheduling');
  setIntakeProgress('details');
  document.querySelector('#full-name').focus();
});

openCalendarButton.addEventListener('click', event => {
  if (!openCalendlyPopup()) return;
  event.preventDefault();
});

window.addEventListener('message', event => {
  if (event.origin !== 'https://calendly.com' || !event.data?.event?.startsWith('calendly.') || bookingStep.hidden) return;
  if (event.data.event !== 'calendly.event_scheduled') return;
  bookingStep.hidden = true;
  bookingSuccess.hidden = false;
  mandateSection.classList.remove('is-scheduling');
  bookingSuccess.focus();
});
