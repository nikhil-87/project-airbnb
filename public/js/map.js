maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: "openstreetmap",
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`
    )
  )
  .addTo(map);
//https://docs.maptiler.com/sdk-js/examples/set-popup/
//https://docs.maptiler.com/sdk-js/examples/how-to-use/#:~:text=Include%20the%20MapTiler%20SDK%20JS,head%3E%20of%20your%20HTML%20file.&text=Create%20a%20element%20with,the%20map%20will%20be%20loaded.
//https://docs.maptiler.com/client-js/geocoding/
//https://docs.maptiler.com/cloud/api/geocoding/
//https://api.maptiler.com/geocoding/Zurich.json?key=mapToken
