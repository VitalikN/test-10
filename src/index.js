import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const country = document.querySelector('.country-info');

search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  fetchCountries(evt.target.value.trim())
    .then(data => createMarkup(data))
    .catch(rej => {
      Notify.failure('Oops, there is no country with that name');
      list.innerHTML = '';
      country.innerHTML = '';
    });
}

function createMarkup(name) {
  const info = name.map(
    ({ name: { official }, flags: { svg } }) =>
      `<li>
  <img src="${svg}" alt="${official}" width='50px'>
  <h2>${official}</h2>
</li>`
  );

  const markup = name.map(
    ({ name: { official }, capital, population, flags: { svg }, languages }) =>
      `<div> <img src="${svg} " alt="${official}" width='50px' />
     <h2>${official} </h2>
      <p>Capital:${capital} </p>
      <p>Population:${population} </p>

         <ul >Languages: ${Object.values(languages)
           .map(el => `<li>${el} </li>`)
           .join(',  ')}</ul> </div>`
  );
  if (name.length === 1) {
    country.innerHTML = markup.join(' ');
    list.innerHTML = '';
  } else if (name.length > 10) {
    Notify.success(
      'Too many matches found. Please enter a more specific name.'
    );
    // country.innerHTML = '';
    list.innerHTML = '';
  }
  if (name.length <= 10 && name.length > 1) {
    country.innerHTML = '';
    list.innerHTML = info.join(' ');
  }
}
