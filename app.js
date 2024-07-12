// Check is service worker is supported on not

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((res) => {
      console.log("Service worker register successfully");
    })
    .catch((error) => console.error("Error registering service worker", error));
}
