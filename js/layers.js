// @ts-check

import { setActiveCity } from './map/cities.js';
import { resetMap, setActiveRegion, setZoom } from './map/regions.js';
import { regions } from './regions.js';
import { isMobile, parseHash } from './utils.js';

export function initLayers() {
  /** @type {NodeListOf<HTMLElement>} */
  const layers = document.querySelectorAll('#layersSet .item');
  layers.forEach(layer => layer.onclick = (e) => handleLayers(e))
};

function handleLayers(e) {
  /** @type {HTMLElement | null} */
  const map = document.getElementById('map');

  /** @type {NodeListOf<HTMLElement>} */
  const items = document.querySelectorAll('#layersSet .item');
  items?.forEach(item => {
    item.classList.remove('active')
    if (item.dataset.layer) {
      map?.classList.remove(item.dataset.layer);
    }
  })

  if (e.currentTarget.dataset.layer === 'prefectures') {
    setActiveCity();
    const hash = parseHash();
    document.location.hash = Object.values(hash).filter(str => str && str.length > 0).join(',');
  }

  if (e.currentTarget.dataset.layer === 'tokyo') {
    resetMap();
    location.hash = '';
  }

  map?.classList.add(e.currentTarget.dataset.layer);
  e.currentTarget.classList.add('active');
}
