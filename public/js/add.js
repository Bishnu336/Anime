document.getElementById('animeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('animeTitle').value.trim();
    const genre = document.getElementById('animeGenre').value.trim();
    const status = document.getElementById('animeStatus').value.trim();

    if (title && genre && status) {
      const anime = { title, genre, status };
      let animeList = JSON.parse(localStorage.getItem('animeList')) || [];
      animeList.push(anime);
      localStorage.setItem('animeList', JSON.stringify(animeList));

      // Redirect to collection page
      window.location.href = 'collection';
    }
  });