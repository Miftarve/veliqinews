var today = new Date();
// back 3 months
today.setMonth(today.getMonth() - 1);
let year = today.getFullYear().toString().slice(2);
let month = ("0" + (today.getMonth() + 1)).slice(-2);
let day = ("0" + today.getDate()).slice(-2);
let todaystring = year + "-" + month + "-" + day;

//const key = "8fc135d20b19414cb6195b082e1202ba";

window.addEventListener("load", (loadEvent) => {


    let apiCalls = localStorage.getItem('apiCalls') || 0;

    const navbarLinks = document.querySelectorAll('.nav-link');
    const searchBtn = document.getElementById("searchBtn");
    const newsQuery = document.getElementById("newsQuery");

    function updateAPICalls() {
        apiCalls++;
        localStorage.setItem('apiCalls', apiCalls);
        console.log(`API Calls: ${apiCalls}`);
    }

    searchBtn.addEventListener('click', (event) => {
        updateAPICalls();
        const query = newsQuery.value;

        const apiUrl = `http://localhost:3000/api/${query}/${todaystring}`;
        search(apiUrl);
    });


    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            updateAPICalls();

            const categoryId = this.getAttribute('id');
            const countrySelect = document.getElementById('countrySelect');
            const selectedCountry = countrySelect.value;
            const apiUrl = `http://localhost:3000/apiCountry/${selectedCountry}/${categoryId}`;
            search(apiUrl);
        });
    });

    updateAPICalls();

    window.onload = loadSavedNews;

    setInterval(updateNews, 60000);
    updateNews();
})

function updateNews() {
    const countrySelect = document.getElementById('countrySelect');
    const selectedCountry = countrySelect.value;
    const apiUrl = `http://localhost:3000/apiCountry/${selectedCountry}/business`;
    search(apiUrl);
}

function search(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const responseContainer = document.getElementById('response-container');
            responseContainer.innerHTML = '';
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            responseContainer.appendChild(cardContainer);

            data.articles.forEach(article => {
                const imageUrl = article.urlToImage ? article.urlToImage : 'foto/1.jpg.jpeg';

                const articleDiv = document.createElement('div');
                articleDiv.className = 'card';
                articleDiv.innerHTML = `
                <h2>${article.title}</h2>
                <img src="${imageUrl}" alt="News Image" class="news-image">
                <p>${article.description}</p>
                <div class="read-more-container">
                    <a href="${article.url}" target="_blank" class="button read-more">&uarr;</a>
                    <i class="bi bi-heart" onclick="saveNewsAndRender('${article.title}', '${article.description}', '${imageUrl}', '${article.url}')"></i>
                </div>
            `;
                cardContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function saveNewsAndRender(title, description, imageUrl, url) {
    const savedNews = loadSavedNewsFromLocalStorage();
    const alreadySaved = savedNews.some(news => news.title === title && news.description === description && news.imageUrl === imageUrl && news.url === url);

    if (!alreadySaved) {
        saveNewsToLocalStorage({ title, description, imageUrl, url });
        renderSavedNews();
    } else {
        alert("Questa notizia è già stata salvata!");
    }
}


function renderSavedNews() {
    const savedNews = loadSavedNewsFromLocalStorage();
    const savedNewsContainer = document.getElementById('saved-news-container');
    savedNewsContainer.innerHTML = '';

    savedNews.forEach((news, index) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'card';
        articleDiv.innerHTML = `
            <h2>${news.title}</h2>
            <img src="${news.imageUrl}" alt="News Image" class="news-image">
            <p>${news.description}</p>
            <div class="read-more-container">
                <a href="${news.url}" target="_blank" class="button read-more">&uarr;</a>
                <i class="bi bi-trash" onclick="removeSavedNews(${index})"></i>
            </div>
        `;
        savedNewsContainer.appendChild(articleDiv);
    });
}

function removeSavedNews(index) {
    removeSavedNewsFromLocalStorage(index);
    renderSavedNews();
}

function saveNews(title, description, imageUrl, url) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];

    const news = { title, description, imageUrl, url };
    savedNews.push(news);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));

    const savedNewsContainer = document.getElementById('saved-news-container');
    const articleDiv = document.createElement('div');
    articleDiv.className = 'card';
    articleDiv.innerHTML = `
        <h2>${title}</h2>
        <img src="${imageUrl}" alt="News Image" class="news-image">
        <p>${description}</p>
        <div class="read-more-container">
            <a href="${url}" target="_blank" class="button read-more">&uarr;</a>
            <i class="bi bi-heart active" onclick="removeSavedNews(this); toggleHeart(this);"></i>
        </div>
    `;
    savedNewsContainer.appendChild(articleDiv);
}


function toggleHeart(heartIcon) {
    heartIcon.classList.toggle('active');
    if (heartIcon.classList.contains('active')) {
        heartIcon.style.color = 'red';
    } else {
        heartIcon.style.color = 'white';
    }
}

function loadSavedNews() {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    const savedNewsContainer = document.getElementById('saved-news-container');

    savedNewsContainer.innerHTML = '';
    savedNews.forEach((news, index) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'card';
        articleDiv.innerHTML = `
            <h2>${news.title}</h2>
            <img src="${news.imageUrl}" alt="News Image" class="news-image">
            <p>${news.description}</p>
            <div class="read-more-container">
                <a href="${news.url}" target="_blank" class="button read-more">&uarr;</a>
                <button class="button read-more" onclick="removeNews(${index})">x</button>
            </div>
        `;
        savedNewsContainer.appendChild(articleDiv);
    });
}

function removeNews(index) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    savedNews.splice(index, 1);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
    loadSavedNews();
}


function removeSavedNews(index, trashButton) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    savedNews.splice(index, 1);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
    const cardToRemove = trashButton.closest('.card');
    cardToRemove.remove();
}

function removeSavedNews(index, trashIcon) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    savedNews.splice(index, 1);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
    const cardToRemove = trashIcon.closest('.card');
    cardToRemove.remove();
}

function saveNewsToSIPage(title, description, imageUrl, url) {
    const savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
    const news = { title, description, imageUrl, url };
    savedNews.push(news);
    localStorage.setItem('savedNews', JSON.stringify(savedNews));

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
            
            <i class="bi bi-trash" onclick="removeSavedNews(this)"></i>
        </div>
    `;
        savedNewsContainer.appendChild(articleDiv);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadSavedNews();
});


function toggleHeart(heartIcon) {
    heartIcon.classList.toggle('active');
}