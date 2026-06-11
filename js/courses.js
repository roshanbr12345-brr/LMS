// ===== courses.js — Courses Page Logic =====

'use strict';

const COURSES_DATA = [
  {
    id: 'AVM204', code: 'AVM 204.A',
    title: 'Airport Strategic Planning and Design',
    instructor: 'Assoc. Prof. Sena Bicici',
    semester: 'Spring 2025/26', progress: 78, credits: 3,
    color: '#1565c0',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop',
    tags: ['aviation', 'planning', 'design'],
  },
  {
    id: 'AVM306', code: 'AVM 306.A',
    title: 'Operations Management in Aviation',
    instructor: 'Assoc. Prof. Leyla Adiloglü',
    semester: 'Spring 2025/26', progress: 62, credits: 3,
    color: '#c8102e',
    img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=200&fit=crop',
    tags: ['operations', 'aviation', 'management'],
  },
  {
    id: 'AVM402', code: 'AVM 402.A',
    title: 'Aviation Business Simulation',
    instructor: 'Dr. Mehmet Yilmaz',
    semester: 'Spring 2025/26', progress: 37, credits: 3,
    color: '#e91e8c',
    img: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=400&h=200&fit=crop',
    tags: ['business', 'simulation', 'aviation'],
  },
  {
    id: 'MGMT311', code: 'MGMT 311.A',
    title: 'Project Management',
    instructor: 'Dr. Ali Kaya',
    semester: 'Spring 2025/26', progress: 55, credits: 3,
    color: '#2e7d32',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
    tags: ['management', 'project', 'business'],
  },
  {
    id: 'SCM205', code: 'SCM 205',
    title: 'Supply Chain Management',
    instructor: 'Prof. Hakan Demir',
    semester: 'Spring 2025/26', progress: 90, credits: 3,
    color: '#f57c00',
    img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=200&fit=crop',
    tags: ['supply chain', 'logistics', 'management'],
  },
  {
    id: 'WC001', code: 'WC 001',
    title: 'Writing Center',
    instructor: 'Language Center',
    semester: 'Common Courses', progress: 0, credits: 0,
    color: '#555',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop',
    tags: ['writing', 'language'],
  },
];

let activeFilter  = 'all';
let activeSort    = 'name';
let activeView    = 'grid';
let searchQuery   = '';

// ── Filter & Search ────────────────────────────────────────
function getFilteredCourses() {
  let list = [...COURSES_DATA];

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)  ||
      c.instructor.toLowerCase().includes(q) ||
      c.tags.some(t => t.includes(q))
    );
  }

  // Filter
  if (activeFilter === 'inprogress') list = list.filter(c => c.progress > 0 && c.progress < 100);
  if (activeFilter === 'completed')  list = list.filter(c => c.progress === 100);
  if (activeFilter === 'notstarted') list = list.filter(c => c.progress === 0);

  // Sort
  if (activeSort === 'name')     list.sort((a,b) => a.title.localeCompare(b.title));
  if (activeSort === 'progress') list.sort((a,b) => b.progress - a.progress);
  if (activeSort === 'code')     list.sort((a,b) => a.code.localeCompare(b.code));

  return list;
}

// ── Render Grid ────────────────────────────────────────────
function renderGrid(courses) {
  const el = document.getElementById('courses-grid');
  if (!el) return;

  if (!courses.length) {
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-search"></i><p>No courses match your search.</p></div>';
    return;
  }

  el.innerHTML = courses.map(c => {
    const statusLabel = c.progress === 100 ? 'Completed' : c.progress > 0 ? 'In Progress' : 'Not Started';
    const statusCls   = c.progress === 100 ? 'chip-green' : c.progress > 0 ? 'chip-blue' : 'chip-gray';
    return `
      <a href="course-details.html?id=${c.id}" class="course-card" style="text-decoration:none;color:inherit;">
        <img src="${c.img}" alt="${c.title}" class="course-img"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
        <div class="course-img-placeholder" style="display:none;background:${c.color}20;">
          <i class="fas fa-book-open" style="color:${c.color};font-size:36px;"></i>
        </div>
        <div class="course-body">
          <div class="course-code">${c.code}</div>
          <div class="course-title">${c.title}</div>
          <div class="course-instructor">
            <i class="fas fa-user-tie" style="font-size:10px;margin-right:4px;color:var(--color-text-dim);"></i>${c.instructor}
          </div>
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-dim);margin-bottom:4px;">
              <span>${c.semester}</span>
              <span style="font-weight:600;">${c.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill gradient" style="width:${c.progress}%"></div>
            </div>
          </div>
          <div class="course-footer">
            <span class="chip ${statusCls}">${statusLabel}</span>
            <span class="btn btn-primary btn-sm" style="pointer-events:none;">Open</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

// ── Render List ────────────────────────────────────────────
function renderList(courses) {
  const el = document.getElementById('courses-list');
  if (!el) return;

  if (!courses.length) {
    el.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No courses match your search.</p></div>';
    return;
  }

  el.innerHTML = courses.map(c => {
    const statusCls = c.progress === 100 ? 'chip-green' : c.progress > 0 ? 'chip-blue' : 'chip-gray';
    const status    = c.progress === 100 ? 'Done' : c.progress > 0 ? 'In Progress' : 'Not Started';
    return `
      <a href="course-details.html?id=${c.id}" class="course-list-item">
        <img src="${c.img}" alt="" class="course-list-thumb"
             onerror="this.style.background='${c.color}30';">
        <div class="course-list-body">
          <div class="course-list-title">${c.code}: ${c.title}</div>
          <div class="course-list-meta">
            <i class="fas fa-user-tie" style="font-size:10px;margin-right:4px;"></i>
            ${c.instructor} &bull; ${c.semester}
          </div>
          <div class="course-list-footer">
            <div style="flex:1;">
              <div class="progress-bar">
                <div class="progress-fill gradient" style="width:${c.progress}%"></div>
              </div>
            </div>
            <span style="font-size:11px;color:var(--color-text-muted);white-space:nowrap;">${c.progress}%</span>
            <span class="chip ${statusCls}">${status}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

// ── Refresh ────────────────────────────────────────────────
function refresh() {
  const courses = getFilteredCourses();
  if (activeView === 'grid') {
    renderGrid(courses);
    document.getElementById('courses-grid')?.classList.remove('hidden');
    document.getElementById('courses-list')?.classList.add('hidden');
  } else {
    renderList(courses);
    document.getElementById('courses-list')?.classList.remove('hidden');
    document.getElementById('courses-grid')?.classList.add('hidden');
  }
}

// ── Event Listeners ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  refresh();

  // Search
  document.getElementById('course-search')?.addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    refresh();
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter || 'all';
      refresh();
    });
  });

  // Sort select
  document.getElementById('sort-select')?.addEventListener('change', e => {
    activeSort = e.target.value;
    refresh();
  });

  // View toggle
  document.getElementById('grid-view-btn')?.addEventListener('click', function() {
    activeView = 'grid';
    this.classList.add('active');
    document.getElementById('list-view-btn')?.classList.remove('active');
    refresh();
  });
  document.getElementById('list-view-btn')?.addEventListener('click', function() {
    activeView = 'list';
    this.classList.add('active');
    document.getElementById('grid-view-btn')?.classList.remove('active');
    refresh();
  });
});
