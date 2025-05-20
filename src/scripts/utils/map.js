import L from 'leaflet';

export default class Map {
  mapConfig;
  #indonesiaCoor = [-2.548926, 118.0148634];

  constructor({ mapContainer, options }) {
    const osmTile = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }
    );

    this.mapConfig = L.map(mapContainer, {
      zoom: 5,
      center: this.#indonesiaCoor,
      ...options,
    });

    osmTile.addTo(this.mapConfig);

    //Source: Stack Overflow (https:stackoverflow.com/questions/42204194/leaflet-only-renders-into-one-corner)
    setInterval(() => {
      this.mapConfig.invalidateSize();
    }, 2000);
  }

  attachEventListener(event, callback) {
    this.mapConfig.on(event, callback);
  }

  async generateMarkersFromAPI(item) {
    const { lat, lng, description, name } = item;

    await L.marker({
      lat: lat,
      lng: lng,
    })
      .addTo(this.mapConfig)
      .bindPopup(`<p>${description}</p><p>By: ${name}`)
      .openPopup();
  }
}
