export default class Camera {
  closeCamera(stream, setupCamera, removeTakenPicture) {
    stream.getTracks().forEach(track => track.stop());

    const cameraContainer = document.querySelector('.open-webcam__container');
    cameraContainer.innerHTML = `
      <div tabindex="0" id="camera-logo" class="camera-logo">
        <i class="fa-solid fa-camera"></i>
        <p>Upload Image</p>
      </div>
    `;

    setupCamera();

    const cameraResultContainer = document.querySelector('#camera-result');

    if (cameraResultContainer) {
      removeTakenPicture();
      return;
    }
  }

  static stopAllStream() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }
    window.currentStreams.forEach(stream => {
      if (stream.active) {
        stream.getTracks().forEach(track => track.stop());
      }
    });
  }
}
