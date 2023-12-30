const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEW_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const getData = (url) => {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const getNewsFeed = () => {
  const newsFeed = getData(NEW_URL);
  const newsList = [];
  newsList.push('<ul>');
  for (let i = 0; i < 10; i++) {
    newsList.push(`
      <li>
        <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }
  newsList.push('</ul>');
  container.innerHTML = newsList.join('');
};

const newsDetail = () => {
  const id = location.hash.substring(1);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
};
const router = () => {
  const routerPath = location.hash;
  if (routerPath === '') getNewsFeed();
  else newsDetail();
};

window.addEventListener('hashchange', router);

router();
