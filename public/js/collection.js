document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const tableBody = document.querySelector('tbody');

  // 🔹 FILTER BUTTON LOGIC
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.textContent.trim();
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      document.querySelectorAll('tbody tr').forEach(row => {
        const status = row.children[2].textContent.trim();
        row.style.display = (filter === 'All' || status === filter) ? '' : 'none';
      });
    });
  });

  // 🔹 ATTACH EVENT LISTENERS TO EDIT/DELETE BUTTONS
  const attachRowActions = (row) => {
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    // 🔸 EDIT
    editBtn.addEventListener('click', async () => {
      const titleCell = row.children[0];
      const genreCell = row.children[1];
      const statusCell = row.children[2];
      const animeId = row.getAttribute("data-id");

      if (editBtn.textContent === 'Edit') {
        editBtn.textContent = 'Save';

        titleCell.innerHTML = `<input value="${titleCell.textContent}" />`;
        genreCell.innerHTML = `<input value="${genreCell.textContent}" />`;
        statusCell.innerHTML = `
          <select>
            <option value="Watching">Watching</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>`;
        statusCell.querySelector('select').value = statusCell.textContent.trim();
      } else {
        const updatedAnime = {
          title: titleCell.querySelector('input').value.trim(),
          genre: genreCell.querySelector('input').value.trim(),
          status: statusCell.querySelector('select').value
        };

        const res = await fetch(`/anime/${animeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAnime)
        });

        if (res.ok) {
          titleCell.textContent = updatedAnime.title;
          genreCell.textContent = updatedAnime.genre;
          statusCell.textContent = updatedAnime.status;
          editBtn.textContent = 'Edit';
        } else {
          alert('Failed to update anime.');
        }
      }
    });

    // 🔸 DELETE
    deleteBtn.addEventListener('click', async () => {
      const animeId = row.getAttribute("data-id");
      const confirmDelete = confirm('Are you sure you want to delete this anime?');
      if (confirmDelete) {
        const res = await fetch(`/anime/${animeId}`, { method: 'DELETE' });
        if (res.ok) row.remove();
        else alert('Failed to delete.');
      }
    });
  };

  // 🔹 INITIALIZE ALL EXISTING ROWS
  document.querySelectorAll('tbody tr').forEach(row => attachRowActions(row));
});
