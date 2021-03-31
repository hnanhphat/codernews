const NEWS_API = '94a18f45f92e48f39f7d868b7e3e8dc8'
const country = 'us'
const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API}`

function renderArticle(arr) {
  document.getElementById('newsList').innerHTML = arr.map((item) => `
    <li>
      <div class="info">
        <h2 class="tit">${item.title}</h2>
        <h3 class="author">${(item.author == '') ? 'Anonymous' : item.author}</h3>
        <h4 class="source">${item.source.name}</h4>
      </div>
      <div class="img" style="background-image: url('${item.urlToImage}')"></div>
      <p class="description">${item.description}</p>
      <a href="${item.url}" class="post" target="_blank">See more</a>
      <a href="javascript:void(0)" class="toggle"></a>
    </li>
  `).join('');
}

function archiveArticle(oldArr, newArr) {
  let newArticles = [];
  oldArr.forEach(element => {
    newArr.forEach((item) => {
      if (item == element.source.name) {
        newArticles.push(element);
      }
    })
  });
  renderArticle(newArticles);
  if (newArticles == '') {
    renderArticle(oldArr);
  }
}

async function getNews() {
  try {
    let response = await fetch(url);
    let jsonData = await response.json();
    let {
      articles
    } = jsonData;
    // console.log(articles);
    renderArticle(articles);

    let source = [];
    articles.forEach(element => {
      let currentSource = source.find((item) => item == element.source.name);
      if (!currentSource) {
        source.push({
          name: element.source.name,
          count: 1
        });
      } else {
        source.count++;
      }
    });
    document.getElementById('source').innerHTML = source.map((item) => `
      <label>
        <input type="checkbox" name="source" value="${item.name}" class="js-source">
        <span>${item.name}(${item.count})</span>
      </label>
    `).join('');

    let input = document.getElementsByClassName('js-source');
    let searchArr = [];
    for (let i = 0; i < input.length; i++) {
      input[i].addEventListener('change', function () {
        if (this.checked) {
          searchArr.push(this.value);
          archiveArticle(articles, searchArr);
        } else {
          searchArr.splice(searchArr.indexOf(this.value), 1);
          archiveArticle(articles, searchArr);
        }
      });
    }

    let toggle = document.getElementsByClassName('toggle');
    for(let i = 0; i < toggle.length; i++) {
      toggle[i].addEventListener('click', function() {
        if(this.parentNode.childNodes[5].classList.contains('show')) {
          this.parentNode.childNodes[5].classList.remove("show");
          this.classList.remove("active");
        } else {
          this.parentNode.childNodes[5].classList.add("show");
          this.classList.add("active");
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  console.log('Keep running!')
}

getNews();