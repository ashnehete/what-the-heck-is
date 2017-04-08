// Add days functionality
 Date.prototype.addDays = function(days) {
   this.setDate(this.getDate() + parseInt(days));
   return this;
 };

function openArticle(article) {
    ga('send', 'event', 'article', 'click', article.dataset.name);
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

    // Generate isNew for articles
    var now = Date.now();
    var articles = articles.map(function(article) {
        var date = new Date(article.date);
        date.addDays(10);
        article.isNew = now <= date;
        return article;
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

        if (filteredArticles.length === 0) {
            filteredArticles = [
                {
                    title: 'nothing like this :(',
                    link: 'mailto:hello@ashnehete.in',
                    img: 'none.png',
                    desc: 'Try suggesting it at hello@ashnehete.in along with any links you think may help me!',
                    date: '2016-12-31T18:30:00.000Z'
                }
            ];
        }

        generateList(filteredArticles);
    })
});