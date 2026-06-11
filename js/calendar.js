// ===== calendar.js — Calendar Page Logic =====

'use strict';

// ── Constants ─────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ── State ─────────────────────────────────────────────────
const NOW       = new Date();
let curYear     = NOW.getFullYear();
let curMonth    = NOW.getMonth();
let courseFilter = '';

// Persistent events stored in memory
let EVENTS = [
  { id:1,  date:`${NOW.getFullYear()}-06-03`, title:'Writing Center Session',     cls:'ev-pink',   course:'' },
  { id:2,  date:`${NOW.getFullYear()}-06-11`, title:'FMEA Classwork II Due',      cls:'ev-red',    course:'AVM 306.A' },
  { id:3,  date:`${NOW.getFullYear()}-06-12`, title:'Simulation Round 3 Due',     cls:'ev-red',    course:'AVM 402.A' },
  { id:4,  date:`${NOW.getFullYear()}-06-15`, title:'Airport Master Plan Due',    cls:'ev-red',    course:'AVM 204.A' },
  { id:5,  date:`${NOW.getFullYear()}-06-18`, title:'Project Charter Due',        cls:'ev-red',    course:'MGMT 311.A' },
  { id:6,  date:`${NOW.getFullYear()}-06-20`, title:'AVM 204.A Final Exam',       cls:'ev-blue',   course:'AVM 204.A' },
  { id:7,  date:`${NOW.getFullYear()}-06-22`, title:'AVM 306.A Final Exam',       cls:'ev-blue',   course:'AVM 306.A' },
  { id:8,  date:`${NOW.getFullYear()}-06-23`, title:'MGMT 311.A Final Exam',      cls:'ev-blue',   course:'MGMT 311.A' },
  { id:9,  date:`${NOW.getFullYear()}-06-25`, title:'Business Sim Report Due',    cls:'ev-red',    course:'AVM 402.A' },
  { id:10, date:`${NOW.getFullYear()}-06-08`, title:'Study Group – Operations',   cls:'ev-green',  course:'' },
  { id:11, date:`${NOW.getFullYear()}-07-05`, title:'Summer Term Begins',         cls:'ev-pink',   course:'' },
];

let nextId = 12;

// ── Helpers ───────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }
function toDateStr(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function todayStr() { return toDateStr(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()); }

function eventsForDate(ds) {
  return EVENTS.filter(e => {
    if (e.date !== ds) return false;
    if (courseFilter && e.course && e.course !== courseFilter) return false;
    return true;
  });
}

// ── Render Full Calendar ───────────────────────────────────
function renderCalendar() {
  const titleEl = document.getElementById('cal-month-title');
  if (titleEl) titleEl.textContent = `${MONTHS[curMonth]} ${curYear}`;

  // Day-of-week headers
  const headerEl = document.getElementById('cal-header');
  if (headerEl) {
    headerEl.innerHTML = DAYS_SHORT.map(d =>
      `<div class="full-cal-dow">${d}</div>`
    ).join('');
  }

  const firstDay    = new Date(curYear, curMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const daysInPrev  = new Date(curYear, curMonth, 0).getDate();
  const today       = todayStr();

  let cells = '';

  // Trailing days from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    cells += `<div class="full-cal-cell other-month">
                <div class="cell-date">${daysInPrev - i}</div>
              </div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const ds      = toDateStr(curYear, curMonth, d);
    const isToday = ds === today;
    const evs     = eventsForDate(ds);

    const pills = evs.slice(0, 3).map(e =>
      `<div class="event-pill ${e.cls}" title="${e.title}"
            onclick="event.stopPropagation();showEventDetail(${e.id})">${e.title}</div>`
    ).join('');
    const more = evs.length > 3
      ? `<div style="font-size:9px;color:var(--color-text-dim);">+${evs.length - 3} more</div>`
      : '';

    cells += `
      <div class="full-cal-cell ${isToday ? 'today' : ''}" onclick="openDayModal('${ds}')">
        <div class="cell-date ${isToday ? 'today-circle' : ''}">${d}</div>
        ${pills}${more}
      </div>`;
  }

  // Leading days of next month
  const total    = startOffset + daysInMonth;
  const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= trailing; d++) {
    cells += `<div class="full-cal-cell other-month"><div class="cell-date">${d}</div></div>`;
  }

  const daysEl = document.getElementById('cal-days');
  if (daysEl) daysEl.innerHTML = cells;

  renderUpcoming();
}

// ── Upcoming Events Panel ─────────────────────────────────
function renderUpcoming() {
  const el = document.getElementById('upcoming-list');
  if (!el) return;

  const today = todayStr();
  const list  = EVENTS
    .filter(e => e.date >= today && (!courseFilter || !e.course || e.course === courseFilter))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7);

  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-check"></i><p>No upcoming events</p></div>';
    return;
  }

  el.innerHTML = list.map(e => {
    const d     = new Date(e.date);
    const label = e.cls === 'ev-red' ? 'Due' : e.cls === 'ev-blue' ? 'Exam' : e.cls === 'ev-pink' ? 'Event' : 'Personal';
    return `
      <div class="upcoming-event">
        <div class="ev-date-box" style="background:var(--color-surface2);color:var(--color-primary);">
          <div class="ev-date-day">${d.getDate()}</div>
          <div class="ev-date-month">${MONTHS[d.getMonth()].slice(0, 3)}</div>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--color-white);margin-bottom:2px;">${e.title}</div>
          <div style="font-size:11px;color:var(--color-text-muted);">${e.course || 'Personal'}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
          <span class="event-pill ${e.cls}">${label}</span>
          <button onclick="deleteEvent(${e.id})" style="background:none;border:none;color:var(--color-text-dim);cursor:pointer;font-size:11px;padding:0;" title="Remove">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

// ── Day Detail Modal ──────────────────────────────────────
function openDayModal(ds) {
  const evs = eventsForDate(ds);
  if (!evs.length) return;

  const d = new Date(ds);
  const dateLabel = d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const content = evs.map(e => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
      <div class="event-pill ${e.cls}" style="flex-shrink:0;">${e.cls==='ev-red'?'Due':e.cls==='ev-blue'?'Exam':e.cls==='ev-pink'?'Event':'Personal'}</div>
      <div style="flex:1;font-size:13px;font-weight:500;color:var(--color-white);">${e.title}</div>
      <div style="font-size:11px;color:var(--color-text-muted);">${e.course||'Personal'}</div>
      <button onclick="deleteEvent(${e.id})" style="background:none;border:none;color:var(--color-text-dim);cursor:pointer;" title="Delete"><i class="fas fa-trash"></i></button>
    </div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'day-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${dateLabel}</div>
        <button class="modal-close" onclick="document.getElementById('day-modal').remove()">&times;</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ── Show Single Event Detail ──────────────────────────────
function showEventDetail(id) {
  const e = EVENTS.find(ev => ev.id === id);
  if (!e) return;
  if (typeof showToast === 'function') showToast(e.title + (e.course ? ` · ${e.course}` : ''), 'info');
}

// ── Add Event ─────────────────────────────────────────────
function addEvent() {
  const titleEl  = document.getElementById('ev-title');
  const dateEl   = document.getElementById('ev-date');
  const catEl    = document.getElementById('ev-cat');
  const courseEl = document.getElementById('ev-course');

  const title  = titleEl?.value.trim();
  const date   = dateEl?.value;
  const cls    = catEl?.value || 'ev-green';
  const course = courseEl?.value || '';

  if (!title) { if (typeof showToast === 'function') showToast('Please enter an event title', 'error'); return; }
  if (!date)  { if (typeof showToast === 'function') showToast('Please select a date', 'error'); return; }

  EVENTS.push({ id: nextId++, date, title, cls, course });

  if (typeof closeModal === 'function') closeModal('add-event-modal');
  if (titleEl) titleEl.value = '';

  renderCalendar();
  if (typeof showToast === 'function') showToast(`Event "${title}" added!`, 'success');
}

// ── Delete Event ──────────────────────────────────────────
function deleteEvent(id) {
  EVENTS = EVENTS.filter(e => e.id !== id);
  document.getElementById('day-modal')?.remove();
  renderCalendar();
  if (typeof showToast === 'function') showToast('Event removed', 'info');
}

// ── Navigation ────────────────────────────────────────────
function goToday() {
  curYear  = NOW.getFullYear();
  curMonth = NOW.getMonth();
  renderCalendar();
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set default date in add-event form to today
  const dateInput = document.getElementById('ev-date');
  if (dateInput) dateInput.value = todayStr();

  // Navigation buttons
  document.getElementById('prev-month')?.addEventListener('click', () => {
    curMonth--;
    if (curMonth < 0) { curMonth = 11; curYear--; }
    renderCalendar();
  });
  document.getElementById('next-month')?.addEventListener('click', () => {
    curMonth++;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    renderCalendar();
  });

  // Course filter
  document.getElementById('cal-course-filter')?.addEventListener('change', e => {
    courseFilter = e.target.value;
    renderCalendar();
  });

  // Initial render
  renderCalendar();
});
