function showTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

function suspendUser(userId) {
  fetch(`/admin/suspend/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('User suspended');
        location.reload();
      } else {
        alert('Failed to suspend user');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Server error');
    });
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    const activeTab = document.querySelector(hash);
    if (activeTab) activeTab.style.display = 'block';

    // Highlight corresponding button
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('nav button')).find(btn =>
      btn.getAttribute('onclick')?.includes(hash.substring(1))
    );
    if (activeBtn) activeBtn.classList.add('active');
  } else {
    // Show default tab if no hash
    const defaultBtn = document.querySelector('nav button.tab');
    if (defaultBtn) showTab('users', defaultBtn);
  }
});

function confirmDelete(event) {
    const confirmed = confirm("Are you sure you want to delete?");
    if (!confirmed) {
      event.preventDefault(); // Stop the form from submitting
      return false;
    }
    return true; // Allow form to submit if confirmed
  }
