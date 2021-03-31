const NEWS_API = '94a18f45f92e48f39f7d868b7e3e8dc8'
const country = 'us'
const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API}`

async function getNews() {
  try {
    let response = await fetch(url);
    let jsonData = await response.json();
    let { articles } = jsonData;
    // console.log(articles);

    document.getElementById('newsList').innerHTML = articles.map((item) => `
      <li>
        <div class="info">
          <h2 class="tit">${item.title}</h2>
          <h3 class="author">${(item.author == '') ? 'Anonymous' : item.author}</h3>
          <p>${item.description}</p>
        </div>
        <div class="img" style="background-image: url('${item.urlToImage}')"></div>
        <div class="link">
          <a href="${item.url}" class="post">See more</a>
          <a href="javascript:void(0)" class="toggle"></a>
        </div>
      </li>
    `).join('');

    let source = [];
    articles.forEach(element => {
      let currentSource = source.find((item) => item == element.source.name);
      if(!currentSource) {
        source.push({name: element.source.name, count: 1});
      } else {
        source.count++;
      }
    });
    document.getElementById('source').innerHTML = source.map((item) => `
      <label>
        <input type="checkbox" name="source" value="${item.name}">
        <span>${item.name}(${item.count})</span>
      </label>
    `).join('');

  } catch (error) {
    console.log(error);
  }
  console.log('Keep running!')
}

getNews();