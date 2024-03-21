function saveNewsToLocalStorage(news) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    savedNews.push(news);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
}

function loadSavedNewsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('savedNews')) || [];
}

function removeSavedNewsFromLocalStorage(index) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    savedNews.splice(index, 1);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
}
