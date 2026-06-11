// File: js/layout.js

function getSidebar(activePage) {
  const navItems = [
    { icon: 'fas fa-home', label: 'Dashboard', href: 'dashboard.html', page: 'dashboard.html' },
    { icon: 'fas fa-book-open', label: 'My Courses', href: 'courses.html', page: 'courses.html' },
    { icon: 'fas fa-tasks', label: 'Assignments', href: 'assignments.html', page: 'assignments.html' },
    { icon: 'fas fa-bolt', label: 'Activities', href: 'activities.html', page: 'activities.html' },
    { icon: 'fas fa-file-alt', label: 'Materials', href: 'materials.html', page: 'materials.html' },
    { icon: 'fas fa-user-check', label: 'Attendance', href: 'attendance.html', page: 'attendance.html' },
    { icon: 'fas fa-chart-bar', label: 'Grades', href: 'grades.html', page: 'grades.html' },
    { icon: 'fas fa-bullhorn', label: 'Announcements', href: 'announcements.html', page: 'announcements.html' },
    { icon: 'fas fa-bell', label: 'Notifications', href: 'notifications.html', page: 'notifications.html' },
    { icon: 'fas fa-star', label: 'Competencies', href: 'competencies.html', page: 'competencies.html' },
    { icon: 'fas fa-folder', label: 'Private Files', href: 'private-files.html', page: 'private-files.html' },
    { icon: 'fas fa-search', label: 'Search', href: 'search.html', page: 'search.html' },
    { icon: 'fas fa-file-pdf', label: 'Reports', href: 'reports.html', page: 'reports.html' },
    { icon: 'fas fa-user-circle', label: 'Profile', href: 'profile.html', page: 'profile.html' },
  ];

  let html = `
    <aside class="sidebar" style="position:fixed;top:0;left:0;width:var(--sidebar-width);height:100vh;background:var(--color-surface);border-right:1px solid var(--color-border);z-index:1000;display:flex;flex-direction:column;overflow-y:auto;padding:0;">
      <div style="padding:18px 20px;border-bottom:1px solid var(--color-border);display:flex;align-items:center;gap:10px;flex-shrink:0;">
        <div style="width:36px;height:36px;background:var(--color-primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:13px;font-family:'Poppins',sans-serif;">ÖZU</div>
        <div style="font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;color:white;"><span style="color:var(--color-primary);">ÖZU</span>.LMS</div>
      </div>
      <nav style="flex:1;padding:12px 0;overflow-y:auto;">
        <div style="font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#555;padding:8px 20px 4px;">Navigation</div>
  `;

  navItems.forEach(item => {
    const isActive = activePage === item.page;
    html += `
      <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}" style="display:flex;align-items:center;gap:12px;padding:10px 20px;text-decoration:none;color:${isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'};border-left:3px solid ${isActive ? 'var(--color-primary)' : 'transparent'};transition:all 0.2s;margin:0 8px 0 0;">
        <i class="${item.icon}" style="width:18px;text-align:center;font-size:14px;"></i>
        <span style="font-size:13px;">${item.label}</span>
      </a>
    `;
  });

  html += `
      </nav>
      <div style="border-top:1px solid var(--color-border);padding:12px 0;">
        <a href="profile.html" class="nav-item" style="display:flex;align-items:center;gap:12px;padding:10px 20px;text-decoration:none;color:var(--color-text-muted);transition:all 0.2s;margin:0 8px 0 0;">
          <i class="fas fa-cog" style="width:18px;text-align:center;font-size:14px;"></i>
          <span style="font-size:13px;">Settings</span>
        </a>
        <a href="login.html" class="nav-item" style="display:flex;align-items:center;gap:12px;padding:10px 20px;text-decoration:none;color:var(--color-text-muted);transition:all 0.2s;margin:0 8px 0 0;">
          <i class="fas fa-sign-out-alt" style="width:18px;text-align:center;font-size:14px;"></i>
          <span style="font-size:13px;">Logout</span>
        </a>
      </div>
    </aside>
  `;

  return html;
}

function getTopbar(title, breadcrumbs) {
  let breadcrumbHtml = '';
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbHtml = breadcrumbs.map((item, i) => {
      if (item.href) {
        return `<a href="${item.href}" style="color:var(--color-primary);text-decoration:none;">${item.label}</a>`;
      } else {
        return `<span style="color:var(--color-text);">${item.label}</span>`;
      }
    }).join(' <span style="color:var(--color-text-dim);margin:0 4px;">/</span> ');
  }

  return `
    <header class="topbar" style="position:fixed;top:0;left:var(--sidebar-width);right:0;height:var(--topbar-height);background:var(--color-surface);border-bottom:1px solid var(--color-border);z-index:999;display:flex;align-items:center;padding:0 24px;gap:16px;">
      <div style="flex:1;">
        <div style="font-family:'Poppins',sans-serif;font-size:16px;font-weight:700;color:white;">${title}</div>
        ${breadcrumbHtml ? `<div style="font-size:12px;color:#888;margin-top:2px;">${breadcrumbHtml}</div>` : ''}
      </div>
      <button class="icon-btn theme-toggle"><i class="fas fa-moon"></i></button>
      <div style="display:flex;align-items:center;gap:8px;background:var(--color-surface2);border:1px solid var(--color-border);border-radius:8px;padding:8px 12px;cursor:pointer;" id="user-profile-btn">
        <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#c8102e,#e91e8c);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;">VT</div>
        <div><div style="font-size:12px;font-weight:600;color:white;">Vigneshrajan</div><div style="font-size:10px;color:#888;">Student</div></div>
      </div>
    </header>
  `;
}

function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
  }
}

function initUserDropdown() {
  const userBtn = document.getElementById('user-profile-btn');
  if (userBtn) {
    userBtn.addEventListener('click', function() {
      window.location.href = 'profile.html';
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initUserDropdown();
});