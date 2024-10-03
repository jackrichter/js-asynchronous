'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

/** Consuming Promises with Async/Await */

// Previous (older) Promise/then handling EQUALS to the modern Async/Await handling
// fetch(`https://restcountries.com/v3.1/name/${country}`).then(res =>
//   console.log(res)
// );

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

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

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const whereAmI = async () => {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!resGeo) throw new Error('Problem getting location.');
    const dataGeo = await resGeo.json();
    // console.log(dataGeo);

    // Country data:
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
    );
    if (!res) throw new Error('Problem getting country.');
    const data = await res.json();
    // console.log(data);

    // Render country
    renderCountry(data[0]);
  } catch (err) {
    console.error(`${err}💥`);
    renderError(`💥 ${err.message}`);
  }
};

whereAmI();
// console.log('FIRST');

/** Adding Error Handling With try...catch */
// try {
//   let y = 2;
//   const x = 3;
//   x = 4;
// } catch (err) {
//   alert(err.message);
// }
