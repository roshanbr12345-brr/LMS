// ===== dashboard.js — Dashboard Page Logic =====

'use strict';

// ── Mini Calendar ──────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_NAMES   = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const CAL_EVENTS = {
  3: ['Writing Center'],
  11: ['FMEA Due'],
  15: ['Airport Plan Due'],
  20: ['AVM 204 Final'],
  22: ['AVM 306 Final'],
  25: ['Sim Report Due'],
};

let calYear, calMonth;

function initMiniCal() {
  const now  = new Date();
  calYear    = now.getFullYear();
  calMonth   = now.getMonth();
  renderMiniCal(now);
}

function renderMiniCal(now) {
  const el = document.getElementById('mini-cal');
  if (!el) return;

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  const todayDate   = (calYear === now.getFullYear() && calMonth === now.getMonth()) ? now.getDate() : -1;

  let html = `
    <div class="cal-header">
      <button class="cal-nav" id="cal-prev"><i class="fas fa-chevron-left"></i></button>
      <span class="cal-month">${MONTH_NAMES[calMonth]} ${calYear}</span>
      <button class="cal-nav" id="cal-next"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="cal-grid">
      ${DAY_NAMES.map(d => `<div class="cal-day-name">${d}</div>`).join('')}`;

  // Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month">${daysInPrev - i}</div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday    = d === todayDate;
    const hasEvent   = !!CAL_EVENTS[d];
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasEvent && !isToday ? 'has-event' : ''}"
              title="${hasEvent ? CAL_EVENTS[d].join(', ') : ''}">${d}</div>`;
  }

  // Next month leading days
  const total    = startOffset + daysInMonth;
  const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= trailing; d++) {
    html += `<div class="cal-day other-month">${d}</div>`;
  }

  html += '</div>';
  el.innerHTML = html;

  document.getElementById('cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderMiniCal(new Date());
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderMiniCal(new Date());
  });
}

// ── Course Progress List ───────────────────────────────────
const COURSE_PROGRESS = [
  { code:'AVM 204', name:'Airport Strategic Planning',       pct:78,  color:'#1565c0' },
  { code:'AVM 306', name:'Operations Mgmt in Aviation',      pct:62,  color:'#c8102e' },
  { code:'AVM 402', name:'Aviation Business Simulation',     pct:37,  color:'#e91e8c' },
  { code:'MGMT 311',name:'Project Management',               pct:55,  color:'#2e7d32' },
  { code:'SCM 205', name:'Supply Chain Management',          pct:90,  color:'#f57c00' },
];

function renderCourseProgress() {
  const el = document.getElementById('course-progress-list');
  if (!el) return;
  el.innerHTML = COURSE_PROGRESS.map(c => `
    <div class="course-progress-item">
      <div class="cpi-color" style="background:${c.color}"></div>
      <div class="cpi-info">
        <div class="cpi-name">${c.name}</div>
        <div class="cpi-meta">
          <span class="cpi-code">${c.code}</span>
          <span class="cpi-pct">${c.pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${c.pct}%;background:${c.color}"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Recent Activity ────────────────────────────────────────
const RECENT_ACTIVITIES = [
  { type:'assignment', fa:'fas fa-tasks',    title:'FMEA Classwork I Submitted',        desc:'AVM 306.A',  time:'2h ago'    },
  { type:'grade',      fa:'fas fa-star',     title:'Project Charter Graded: 88/100',    desc:'MGMT 311.A', time:'Yesterday' },
  { type:'announcement',fa:'fas fa-bullhorn',title:'New Announcement: Final Exam Tips', desc:'AVM 204.A',  time:'2 days ago'},
  { type:'assignment', fa:'fas fa-file',     title:'Airport Master Plan Assignment Posted', desc:'AVM 204.A', time:'3 days ago'},
];

function renderRecentActivity() {
  const el = document.getElementById('activity-list');
  if (!el) return;
  el.innerHTML = RECENT_ACTIVITIES.map(a => `
    <div class="activity-item">
      <div class="activity-icon ${a.type}"><i class="${a.fa}"></i></div>
      <div class="activity-body">
        <div class="activity-title">${a.title}</div>
        <div class="activity-desc">${a.desc}</div>
      </div>
      <div class="activity-time">${a.time}</div>
    </div>
  `).join('');
}

// ── Upcoming Deadlines ─────────────────────────────────────
const DEADLINES = [
  { title:'FMEA Classwork II',   course:'AVM 306.A',  days:2,  cls:'days-red'    },
  { title:'Airport Master Plan', course:'AVM 204.A',  days:5,  cls:'days-orange' },
  { title:'Six Sigma Report',    course:'AVM 306.A',  days:10, cls:'days-orange' },
  { title:'Business Sim Report', course:'AVM 402.A',  days:15, cls:'days-green'  },
];

function renderDeadlines() {
  const el = document.getElementById('deadline-list');
  if (!el) return;
  el.innerHTML = DEADLINES.map(d => `
    <div class="deadline-item">
      <div class="deadline-left">
        <div class="deadline-title">${d.title}</div>
        <div class="deadline-course">${d.course}</div>
      </div>
      <div class="deadline-days ${d.cls}">${d.days}d</div>
    </div>
  `).join('');
}

// ── Grade Radar Chart ──────────────────────────────────────
function initGradeChart() {
  const canvas = document.getElementById('gradeChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: ['AVM 204','AVM 306','AVM 402','MGMT 311','SCM 205'],
      datasets: [
        {
          label: 'Your Score',
          data: [82, 94, 83, 86, 92],
          borderColor: '#c8102e',
          backgroundColor: 'rgba(200,16,46,0.12)',
          pointBackgroundColor: '#c8102e',
          pointRadius: 4,
          borderWidth: 2,
        },
        {
          label: 'Class Average',
          data: [70, 75, 72, 74, 76],
          borderColor: '#1565c0',
          backgroundColor: 'rgba(21,101,192,0.08)',
          pointBackgroundColor: '#1565c0',
          pointRadius: 4,
          borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { color: '#555', stepSize: 25, backdropColor: 'transparent' },
          grid: { color: '#2a2a2a' },
          pointLabels: { color: '#888', font: { size: 11 } }
        }
      },
      plugins: {
        legend: { labels: { color: '#888', font: { size: 11 }, padding: 16 } }
      }
    }
  });
}

// ── Current Date Display ───────────────────────────────────
function setCurrentDate() {
  const el = document.getElementById('current-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ── Sidebar Overlay (mobile) ───────────────────────────────
function initSidebarOverlay() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const toggle = document.querySelector('.sidebar-toggle');
  toggle?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  renderCourseProgress();
  renderRecentActivity();
  renderDeadlines();
  initMiniCal();
  initGradeChart();
  initSidebarOverlay();
});
