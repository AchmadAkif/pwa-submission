import Map from '../../utils/map';
import Camera from '../../utils/camera';

export default class CreateStoryPresenter {
  #map;
  #clickedLatLng = null;
  #marker = null;
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async handleLoadMap(selector) {
    this.#map = await new Map({
      mapContainer: selector,
    });

    this.#map.attachEventListener('click', async event => {
      if (this.#marker) {
        this.#map.mapConfig.removeLayer(this.#marker);
      }

      this.#marker = await L.marker(
        { ...event.latlng },
        { icon: this.#map.createMarkerIcon() }
      );
      this.#marker.addTo(this.#map.mapConfig);
      this.#clickedLatLng = event.latlng;
      this.#view.updateLatLngValue(this.#clickedLatLng);
    });
  }

  async handleSubmitStory(data) {
    const { photo, description } = data;

    if (!description || !photo) {
      alert('Description field or Image cannot be empty');
      return;
    }

    this.#view.showLoading();
    try {
      const response = await this.#model.postNewStory(data);
      if (response.error) {
        throw new Error(`API Error: ${response.message}`);
      }
      this.#map.mapConfig.removeLayer(this.#marker);
      Camera.stopAllStream();
      this.#view.submitStorySuccess();
    } catch (error) {
      console.error(error);
    } finally {
      this.#view.hideLoading();
    }
  }
}
