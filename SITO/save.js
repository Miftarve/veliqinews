function showSavedNews() {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    const savedNewsContainer = document.getElementById('saved-news-container');
    savedNewsContainer.innerHTML = '';

    savedNews.forEach(news => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'card';
        articleDiv.innerHTML = `
            <h2>${news.title}</h2>
            <img src="${news.imageUrl}" alt="News Image" class="news-image">
            <p>${news.description}</p>
            <div class="read-more-container">
                <a href="${news.url}" target="_blank" class="button read-more">&uarr;</a>
            </div>
        `;
        savedNewsContainer.appendChild(articleDiv);
    });
}
