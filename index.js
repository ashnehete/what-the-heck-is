function openArticle(article) {
    var link = article.dataset.target;
    window.open(link, '_blank');
}

function loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function generateList(articles) {
    var source = document.getElementById('article-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        articles: articles
    });

    var articleDiv = document.getElementsByClassName('container')[0];
    articleDiv.innerHTML = html;
}

loadJSON('data.json', function (response) {
    var articles = JSON.parse(response);
    var titles = articles.map(function (article) {
        return article.title;
    });

    generateList(articles);

    var input = document.getElementById('search-box');
    input.addEventListener('keyup', function (event) {
        var key = input.value;
        var filteredTitles = titles.filter(function (title) {
            var regex = new RegExp('\\b' + key, 'ig');
            return regex.test(title);
        });
        var filteredArticles = articles.filter(function (article) {
            return filteredTitles.indexOf(article.title) !== -1;
        });

        generateList(filteredArticles);
    })
});