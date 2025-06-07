// Toggle edit mode for a row
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const tr = this.closest('tr');
        const displayElements = tr.querySelectorAll('span.display');
        const editElements = tr.querySelectorAll('.editable');
        const saveBtn = tr.querySelector('.save-btn');
        const editBtn = this;

        // Toggle visibility
        displayElements.forEach(el => el.style.display = 'none');
        editElements.forEach(el => el.style.display = 'inline-block');
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
      });
    });
    