// API: 94a18f45f92e48f39f7d868b7e3e8dc8

const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=94a18f45f92e48f39f7d868b7e3e8dc8'

async function getNews() {
  const response = await fetch(url);
  const jsonData = await response.json();

  console.log({
    jsonData
  });
}

console.log(getNews())