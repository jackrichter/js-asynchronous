'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// AJAX calls the XML/http way
/*
const getCountryData = country => {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);

    console.log(data);
    // console.log(Object.values(data.languages));
    // console.log(Object.values(data.currencies)[0].name);
    // console.log(data.flags.svg);
    // console.log(data.currencies.EUR.name);

    const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} mil people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        }</p>
      </div>
    </article>
  `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('portugal');
getCountryData('usa');
getCountryData('sweden');
*/

///////////////////////////////////////

/** Nested callbacks: Callback "hell" */

const renderCountry = (data, className = '') => {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} mil people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        }</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbor = country => {
  // AJAX call first country
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render first country
    renderCountry(data);

    // Get neighbor country code
    const [neighbor] = data.borders;

    if (!neighbor) return; // An alternative to this line and the above: 'const neighbor = data.borders?.[0]' !

    // AJAX call for neighbor country using country code instead of country name
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);

      // Render neighbor country
      renderCountry(data2, 'neighbor');
    });

    // console.log(Object.values(data.languages));
    // console.log(Object.values(data.currencies)[0].name);
    // console.log(data.flags.svg);
    // console.log(data.currencies.EUR.name);
  });
};

// getCountryAndNeighbor('portugal');
getCountryAndNeighbor('usa');

// Another callback-hell example
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 seconds passed');
      setTimeout(() => {
        console.log('4 seconds passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
