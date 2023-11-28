// @ts-check

export function replaceSpecialCharactersWithAscii(str) {
  return str.replace(/[ÀÁÂÃÄÅ]/g, 'A')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[ÈÉÊË]/g, 'E')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ÌÍÎÏ]/g, 'I')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ÒÓÔÕÖŌ]/g, 'O')
    .replace(/[òóôõöō]/g, 'o')
    .replace(/[ÙÚÛÜŪ]/g, 'U')
    .replace(/[ùúûüū]/g, 'u')
    .replace(/[Ç]/g, 'C')
    .replace(/[ç]/g, 'c')
    .replace(/[Ñ]/g, 'N')
    .replace(/[ñ]/g, 'n');
}

export async function loadHTML(id, filename) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  const response = await fetch(filename);
  const responseText = await response.text();

  if (responseText) {
    element.innerHTML = responseText;
  }
  else {
    element.innerHTML = "<h1>Page not found.</h1>";
  }
}

const filteredData = (data, filter) => data.filter(region => !filter || region.name.en === filter);

export function parseData(data, filter = null) {
  const dataArray = [['Prefecture', 'Index']];

  filteredData(data, filter).forEach((region, index) => {
    region.prefectures.forEach(({ name }) => {
      dataArray.push([replaceSpecialCharactersWithAscii(name.en), index]);
    });
  });

  return dataArray;
}

export function parseDataForPrefectures(data, filter = null) {
  const dataArray = [['Lat', 'Lng', 'Prefecture', 'Index']];

  filteredData(data, filter).forEach((region) => {
    region.prefectures.forEach(({ name, location }, index) => {
      dataArray.push([location.lat, location.lng, name.ja.join(''), index]);
    })
  });

  return dataArray;
}

export function parseDataForCities(data, filter = null) {
  /** @type {Array<Array<string | number>>} */
  const dataArray = [['Lat', 'Lng', 'City', 'isFavorite']];

  filteredData(data, filter).forEach((region) => {
    region.prefectures.forEach(prefecture => {
      prefecture.cities?.forEach(({ name, location }) => {
        dataArray.push([location.lat, location.lng, name.ja.join(''), 1]);
      })
    });
  });

  return dataArray;
}

export function extractCities(data, filter = null) {
  const dataArray = [];

  filteredData(data, filter).forEach((region) => {
    region.prefectures.forEach(prefecture => {
      prefecture.cities?.forEach(city => {
        dataArray.push(city);
      })
    });
  });

  return dataArray;
}

export function extractPrefectures(data, filter = null) {
  const dataArray = [];

  filteredData(data, filter).forEach((region) => {
    region.prefectures.forEach(prefecture => {
      dataArray.push(prefecture);
    });
  });

  return dataArray;
}

export function addStroke(elm) {
  const strokePos = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 1 },
  ];

  const x = parseInt(elm.getAttribute('x'));
  const y = parseInt(elm.getAttribute('y'));

  strokePos.forEach(pos => {
    const stroke = elm.cloneNode(true);
    stroke.setAttribute('fill', 'white');
    stroke.setAttribute('x', `${x + pos.x}`);
    stroke.setAttribute('y', `${y + pos.y}`);
    elm.parentElement?.appendChild(stroke);
  })

  const clonedElm = elm.cloneNode(true);
  clonedElm.setAttribute('x', `${x}`);
  clonedElm.setAttribute('y', `${y}`);
  elm.parentElement?.appendChild(clonedElm);
  elm.remove();
}
