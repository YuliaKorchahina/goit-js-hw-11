import Notiflix from 'notiflix';
import fetchData from './fetchData';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const info = document.querySelector('.info');
//const cardContainer = document.querySelector('.photo-card')

form.style.margin = '30px';
gallery.style.display = 'flex';
gallery.style.gap = '30px';
gallery.style.flexWrap = 'wrap';
//info.style.display= 'flex';
//form.style.color = 'pink'

//btnLoadMore.disabled = true;
btnLoadMore.style.display = 'none';

let searchQuery = '';
let page = 1;
let perPage = 200;
let currentData = [];

const addData = searchData => {
  currentData.push(...searchData);
};

const handleInput = e => {
  searchQuery = e.currentTarget.value;
};

const handleSubmit = event => {
  event.preventDefault();
  if (searchQuery) {
    btnLoadMore.style.display = 'block';
    fetchData(`${searchQuery}`).then(data => {
      const { hits,totalHits } = data;
      if (!hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderList(hits);
      addData(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      console.log(currentData);
    });
  }
};

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

function handleLoadMore(event) {
  event.preventDefault();
  page += 1;
  console.log(page);
  fetchData(`${searchQuery}`, page, 200)
    .then(data => {
      const { hits, totalHits, total } = data;
      addData(hits);
      renderList(currentData);
      console.log(total);
      console.log(currentData.length);

      const totalElementsForPage = page * perPage;
      console.log(totalElementsForPage);
      // if (totalElementsForPage > 420)
      if (data.page === data.per_page) {
        console.log(data.page);
        console.log(data.per_page);
        btnLoadMore.style.display = 'none';
        setTimeout(() => {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }, 2000);
      }
    })
    .catch(err => console.error(err));
  lightbox.refresh();
}

const onClick = e => {
  e.preventDefault();
};

let lightbox = new SimpleLightbox('.gallery a');

input.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);
btnLoadMore.addEventListener('click', handleLoadMore);
//gallery.addEventListener('click', onClick);
