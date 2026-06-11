// File: js/main.js

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// Close modal when clicking overlay
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// Close modal with close button
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-close')) {
    e.target.closest('.modal-overlay').style.display = 'none';
  }
});

// Modal trigger by data attribute
document.addEventListener('click', function(e) {
  if (e.target.hasAttribute('data-modal')) {
    const modalId = e.target.getAttribute('data-modal');
    openModal(modalId);
  }
});

// Toast notification
function showToast(message, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;top:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(c);
  }
  
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const colors = { success: '#66bb6a', error: '#ef5350', info: '#42a5f5' };
  
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.style.cssText = `
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-left: 3px solid ${colors[type]};
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--color-text);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  t.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};font-size:14px;"></i><span>${message}</span>`;
  c.appendChild(t);
  
  setTimeout(() => t.remove(), 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Tab functionality
function initTabs(container = document) {
  const tabBtns = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active to clicked
      this.classList.add('active');
      const targetTab = container.getElementById(tabId);
      if (targetTab) targetTab.classList.add('active');
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  
  // Add animate-in animation on page load
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.querySelector('style[data-animate]')) {
    style.setAttribute('data-animate', 'true');
    document.head.appendChild(style);
  }
});

// Utility function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Utility function to format time
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    const input = searchBox.querySelector('input');
    if (input) {
      input.addEventListener('focus', function() {
        searchBox.style.borderColor = 'var(--color-primary)';
      });
      input.addEventListener('blur', function() {
        searchBox.style.borderColor = 'var(--color-border)';
      });
    }
  }
});

// Filter chips functionality
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('filter-chip')) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
  }
});