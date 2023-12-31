const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const NEW_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
  currentPage: 1,
};

const getData = (url) => {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
};

const getNewsFeed = () => {
  const limit = 10;
  const newsFeed = getData(NEW_URL);
  const newsList = [];
  const maxPageNum = newsFeed.length / limit;
  const isMaxPage = maxPageNum === store.currentPage;
  newsList.push('<ul>');
  for (
    let i = (store.currentPage - 1) * limit;
    i < store.currentPage * limit;
    i++
  ) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }
  newsList.push('</ul>');
  newsList.push(`
    <div>
      <a href="#/page/${
        store.currentPage > 1 ? store.currentPage - 1 : 1
      }">이전</a>
      <a href="#/page/${
        isMaxPage ? store.currentPage : store.currentPage + 1
      }">다음</a>
    </div>
  `);
  container.innerHTML = newsList.join('');
};

const newsDetail = () => {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
};
const router = () => {
  const routerPath = location.hash;
  if (routerPath === '') getNewsFeed();
  else if (routerPath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routerPath.substring(7));
    getNewsFeed();
  } else newsDetail();
};

window.addEventListener('hashchange', router);

router();
