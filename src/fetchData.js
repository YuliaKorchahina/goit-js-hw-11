import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const KEY = '32745455-50ea65fac97b0fc063f154f63';

export default async function fetchData(searchQuery, page = 1, perPage = 40) {
  // const options = {
  //   image_type: 'photo',
  //   orientation: 'horizontal',
  //   safesearch: 'true',
  //   q: `${form}`,
  // };
  // return fetch(`${BASE_URL}?key=${KEY}&q=${searchQuery}`, options)

  return await axios
    .get(
      `${BASE_URL}/?key=${KEY}&image_type=photo&page=${page}&per_page=${perPage}&orientation=horizontal&safesearch=true&q=${searchQuery}`
    )
    .then(resp => resp.data);

 }
