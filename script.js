const API_KEY = "1b50730b754f46618060e2353ce40222";
// const URL = `http://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

let newsList = [];
let endpoint = "top-headlines";
const urlOptions = {
  country: "us",
  category: "",
  page: 1,
  q: "",
};

let currentSideMenu = "top-stories";

const getURL = (urlOptions) => {
  let url = Object.keys(urlOptions).reduce((url, option) => {
    if (urlOptions[option]) {
      url += `${option}=${urlOptions[option]}&`;
    }
    return url;
  }, `http://newsapi.org/v2/${endpoint}?`);
  url += `apiKey=${API_KEY}`;
  return url;
};
const getArticles = async (addToList = false) => {
  if (!addToList) {
    urlOptions.page = 1;
    newsList = [];
  }

  let url = getURL(urlOptions);
  const response = await fetch(url);
  const data = await response.json();

  newsList = [...newsList, ...data.articles];
  renderSources(newsList);
  renderArticles(newsList);
  document.getElementById("counter").innerHTML = newsList.length;
};

const renderArticles = (newsList) => {
  const newsListHTML = newsList
    .map((news) => {
      return `<li class="media my-4">
  <div class="media-body">
    <h4 class="mt-0 mb-1">${news.title}</h4>
    <p>${news.content}</p>
    <span class="badge badge-info">${news.source.name}</span> -
    <span class="published-at">5 mins ago</span>
    <div>
      <img
        class="view-more-ico mt-4"
        src="https://lh3.googleusercontent.com/JDFOyo903E9WGstK0YhI2ZFOKR3h4qDxBngX5M8XJVBZFKzOBoxLmk3OVlgNw9SOE-HfkNgb=w32-rw"
        alt="icon view more"
      />
      <a href="${news.url}">View Full Coverage</a>
    </div>
  </div>
  <img
    class="ml-3"
    src="${news.urlToImage}"
    alt="Image article"
  />
</li>`;
    })
    .join("");

  document.getElementById("category-title").innerHTML =
    urlOptions.category || "Top Headlines";
  document.getElementById("news-list").innerHTML = newsListHTML;
};

const countingSources = (newsList) => {
  const sourceCounter = {};

  newsList.forEach((item) => {
    console.log(item.source.name);
    if (!(item.source.name in sourceCounter)) {
      sourceCounter[item.source.name] = 1;
    } else {
      sourceCounter[item.source.name] += 1;
    }
    console.log(sourceCounter);
  });
  return sourceCounter;
};

const renderSources = (newsList) => {
  const sourceCounter = countingSources(newsList);
  const sourceListHTML = Object.keys(sourceCounter)
    .map(
      (source) =>
        `<button type="button" class="btn btn-outline-dark m-1" onclick='handleSourceClicked("${source}")'>
          ${source} <span class="badge badge-info">${sourceCounter[source]}</span>
         </button>`
    )
    .join("");

  document.getElementById("source-list").innerHTML = sourceListHTML;
};

//Extras functions
const handleClickSideMenu = (categoryInput) => {
  if (categoryInput == "top-stories") {
    urlOptions.category = "";
  } else {
    urlOptions.category = categoryInput;
  }
  getArticles();
};

const handleSearchClick = () => {
  console.log(document.getElementById("search-input").value);
  let query = document.getElementById("search-input").value;
  urlOptions.q = query;
  urlOptions.country = "";
  endpoint = "everything";
  getArticles();
};

const handleSourceClicked = (sourceInput) => {
  if (sourceInput == "all") {
    renderArticles(newsList);
  } else {
    let filterList = newsList.filter((news) => news.source.name == sourceInput);
    renderArticles(filterList);
  }
};

const handleLoadMoreClick = () => {
  urlOptions.page++;
  getArticles(true);
};

//for the first launch
getArticles();
