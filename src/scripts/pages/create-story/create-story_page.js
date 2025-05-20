import CreateStoryPresenter from './create-story_presenter';
import * as UserStoriesAPI from '../../data/api';

export default class CreateStoryPage {
  #presenter;
  #takenPicture;
  #stream;

  async render() {
    return `
      <section tabindex="-1" class="create-story__container">
        <section class="create-story__title">
          <h1 tabindex="0">Write your own story</h1>
        </section>
        <form id="create-story__form" class="create-story__form">
          <div class="open-webcam__container">
            <div tabindex="0" id="camera-logo" class="camera-logo" role="button" aria-label="Take your photo">
              <i class="fa-solid fa-camera"></i>
              <p>Upload Image</p>
            </div>
          </div>
          <div id="camera-result" class="camera-result"></div>
          <canvas id="camera-canvas" class="camera-canvas"></canvas>
          <label for="description">Description</label>
          <textarea
            id="description-input"
            name="description"
            placeholder="Write your story description."
          ></textarea>
          <div class="create-story__form__location__title">Lokasi</div>
          <div class="create-story__form__location__container">
            <div class="create-story__form__location__map__container">
              <div id="map" class="create-story__form__location__map"></div>
            </div>
            <div class="create-story__form__location__lat-lng">
              <input tabindex="0" type="number" name="latitude" value="" disabled>
              <input tabindex="0" type="number" name="longitude" value="" disabled>
            </div>
          </div>
          <section id="submit-button__container" class="submit-button__container">
            <button type="submit" id="submit-button" class="solid-button">Upload Story</button>
          </section>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new CreateStoryPresenter({
      view: this,
      model: UserStoriesAPI,
    });

    this.skipToContentListen();
    this.setupCamera();
    this.#setupForm();
    this.#presenter.handleLoadMap('map');
  }

  #setupForm() {
    const latInput = document
      .querySelector('#create-story__form')
      .elements.namedItem('latitude');
    const lngInput = document
      .querySelector('#create-story__form')
      .elements.namedItem('longitude');

    document
      .querySelector('#create-story__form')
      .addEventListener('submit', async event => {
        event.preventDefault();

        const data = {
          description: document.querySelector('#description-input').value,
          photo: this.#takenPicture,
          lat: latInput.value,
          lon: lngInput.value,
        };

        this.#presenter.handleSubmitStory(data);
      });
  }

  setupCamera() {
    const cameraLogo = document.querySelector('#camera-logo');
    cameraLogo.addEventListener('click', () => this.getStream());
    cameraLogo.addEventListener('keydown', e =>
      e.key === 'Enter' ? this.getStream() : null
    );
  }

  skipToContentListen() {
    document.querySelector('.skip-to-content').addEventListener('click', () => {
      const mainContent = document.querySelector('.create-story__container');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scrolling
        mainContent.focus(); // Focus on the main content for accessibility
      }
    });
  }

  async getStream() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      this.cameraLaunch(this.#stream);
    } catch (error) {
      throw error;
    }
  }

  cameraLaunch(stream) {
    const cameraContainer = document.querySelector('.open-webcam__container');
    cameraContainer.innerHTML = `
      <video id="camera-video" class="camera__video">
        Video stream not available.
      </video>
      <div class="camera-tool__buttons">
        <button type="button" id="take-picture__button" class="success-button">Take Picture</button>
        <button type="button" id="cancel-button" class="danger-button">Close Camera</button>
      </div>
    `;
    const cameraVideo = document.querySelector('#camera-video');

    cameraVideo.srcObject = stream;
    cameraVideo.play();

    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [stream];
      return;
    }

    window.currentStreams = [...window.currentStreams, stream];

    // Camera Button Event Listener
    const takePictureBtn = document.querySelector('#take-picture__button');
    takePictureBtn.addEventListener(
      'click',
      async () => await this.cameraTakePicture()
    );

    const cancelButton = document.querySelector('#cancel-button');
    cancelButton.addEventListener('click', async () => {
      await this.closeCamera(this.#stream);
    });
  }

  closeCamera(stream) {
    stream.getTracks().forEach(track => track.stop());

    const cameraContainer = document.querySelector('.open-webcam__container');
    cameraContainer.innerHTML = `
      <div tabindex="0" id="camera-logo" class="camera-logo">
        <i class="fa-solid fa-camera"></i>
        <p>Upload Image</p>
      </div>
    `;

    this.setupCamera();

    const cameraResultContainer = document.querySelector('#camera-result');

    if (cameraResultContainer) {
      this.removeTakenPicture();
      return;
    }
  }

  populateCanvas(image) {
    const cameraResultContainer = document.querySelector('#camera-result');
    cameraResultContainer.innerHTML = `
    <img src="${image}" alt="">
    `;
  }

  removeTakenPicture() {
    const cameraResultContainer = document.querySelector('#camera-result');
    cameraResultContainer.innerHTML = ``;
  }

  async storeTakenPicture(image) {
    let blob = image;

    if (typeof image === 'string') {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    this.#takenPicture = blob;
  }

  async cameraTakePicture() {
    const cameraCanvas = document.querySelector('#camera-canvas');
    const cameraVideo = document.querySelector('#camera-video');
    const context = cameraCanvas.getContext('2d');

    cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.width = cameraVideo.videoWidth;

    context.drawImage(
      cameraVideo,
      0,
      0,
      cameraVideo.videoWidth,
      cameraVideo.videoHeight
    );

    const takenPictureImg = cameraCanvas.toDataURL();
    const image = await new Promise(resolve => {
      cameraCanvas.toBlob(blob => resolve(blob));
    });

    this.storeTakenPicture(image);
    this.populateCanvas(takenPictureImg);
  }

  updateLatLngValue({ lat, lng }) {
    document
      .querySelector('#create-story__form')
      .elements.namedItem('latitude').value = lat;
    document
      .querySelector('#create-story__form')
      .elements.namedItem('longitude').value = lng;
  }

  submitStorySuccess() {
    alert('Your story has been uploaded');
    this.closeCamera(this.#stream);
    const form = document.querySelector('#create-story__form');
    form.reset();
  }

  showLoading() {
    document.querySelector('#submit-button__container').innerHTML = `
      <button type="submit" id="submit-button" class="solid-button">
        <i class="fa-solid fa-circle-notch loading-spinner"></i>
      </button>
      `;
  }

  hideLoading() {
    document.querySelector('#submit-button__container').innerHTML = `
      <button type="submit" id="submit-button" class="solid-button">Upload Story</button>`;
  }
}
