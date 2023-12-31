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
  const maxPageNum = newsFeed.length / limit;
  const isMaxPage = maxPageNum === store.currentPage;
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;
  const newsList = [];
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
  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace(
    '{{__prev_page__}}',
    `${store.currentPage > 1 ? store.currentPage - 1 : 1}`
  );
  template = template.replace(
    '{{__next_page__}}',
    `${isMaxPage ? store.currentPage : store.currentPage + 1}`
  );
  container.innerHTML = template;
};

const newsDetail = () => {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id));

  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;
  function makeComment(comments, called = 0) {
    const commentString = [];
    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>  
      `);
      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
        console.log('??', called);
      }
    }
    return commentString.join('');
  }
  container.innerHTML = template.replace(
    '{{__comments__}}',
    makeComment(newsContent.comments)
  );
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
