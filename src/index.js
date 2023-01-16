import Notiflix from 'notiflix';
import fetchData from './fetchData';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const info = document.querySelector('.info');

gallery.style.display = 'flex';
gallery.style.gap = '30px';
gallery.style.flexWrap = 'wrap';

btnLoadMore.style.display = 'none';

let searchQuery = '';
let page = 1;
let perPage = 40;
let currentData = [];

const addData = searchData => {
  currentData.push(...searchData);
};

const handleInput = e => {
  searchQuery = e.currentTarget.value;
};

async function handleSubmit(event) {
  event.preventDefault();
  currentData = [];
  btnLoadMore.style.display = 'block';
  try {
    const resp = await fetchData(`${searchQuery}`);
    if (searchQuery) {
      const { hits, totalHits } = resp;
      if (!hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
        btnLoadMore.style.display = 'none';
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      renderList(hits);
      lightbox.refresh();
      addData(hits);
    }
  } catch (error) {
    console.log(error);
  }
}

function renderList(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` <div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"  width="300" height='300'/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');

  gallery.innerHTML = markup;
}

async function handleLoadMore(event) {
  event.preventDefault();
  page += 1;
  console.log(page);
  const resp = await fetchData(`${searchQuery}`, page);
  const { hits, totalHits, total } = resp;
  addData(hits);
  renderList(currentData);
  lightbox.refresh();
  const totalElementsForPage = page * perPage;
  console.log(totalElementsForPage);
  if (totalElementsForPage > totalHits) {
    //if (resp.page === resp.per_page) {
    // console.log(data.page);
    // console.log(data.per_page);
    btnLoadMore.style.display = 'none';
    setTimeout(() => {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }, 1000);
  }
}

let lightbox = new SimpleLightbox('.gallery a');

input.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);
btnLoadMore.addEventListener('click', handleLoadMore);
