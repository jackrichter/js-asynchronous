'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

/** Promisefying The Geolocation Api  */

// navigator.geolocation.getCurrentPosition(
//   // Async behavior
//   position => console.log(position),
//   err => console.error(err)
// );
// console.log('Getting position');

// Promisefying a callback based Api to a Promise based Api
// const getPosition = function () {
//   // Promise: pass in the executor function that has access to two parameters: the success and error functions.
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       position => resolve(position),
//       err => reject(new Error(err.message))
//     );
//   });
// };

// Simplifying the above:
const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(pos => console.log(pos)); // If the Promise is marked as successful by te resolve function, then we get the position.

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

const whereAmI = () => {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);

      if (data.countryName === 'United States of America (the)')
        data.countryName = 'USA';

      return fetch(`https://restcountries.com/v3.1/name/${data.countryName}`);
    })
    .then(response2 => {
      if (!response2.ok)
        throw new Error(`Country not found (${response2.status})`);

      return response2.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};

btn.addEventListener('click', whereAmI);
