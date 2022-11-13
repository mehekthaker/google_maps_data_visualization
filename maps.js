let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: new google.maps.LatLng(39.29, -76.612),
    mapTypeId: "terrain",
  });

  const image = {
    url: "https://cdn-icons-png.flaticon.com/128/7902/7902287.png",
    scaledSize: new google.maps.Size(40, 40),
  };

  getJSON(
    "https://opendata.baltimorecity.gov/egis/rest/services/NonSpatialTables/Part1_Crime/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson"
  ).then(function (data) {
    data.features.forEach((feature) => {
      let date = new Date(feature.properties.CrimeDateTime);
      let hours = "0" + date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime =
        hours.slice(-2) + ":" + minutes.slice(-2) + ":" + seconds.slice(-2);

      let contentString =
        "<div><b> Location:  </b>" + feature.properties.Location +
            "</br>" +
            "<b>Crime Date:  </b>" +
            date.toLocaleDateString("en-US") +
            "</br>" +
            "<b>Crime Time:  </b>" +
            formattedTime +
            "</br>" +
            "<b>Crime committed:  </b>" +
            feature.properties.Description +
            "</br>" +
            "<b>Crime code:  </b>" +
            feature.properties.CrimeCode +
            "</div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      if (feature != null && feature.geometry != null && feature.geometry.coordinates != null) {
        const coords = feature.geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        const crimeMarker = new google.maps.Marker({
          position: latLng,
          icon: image,
          map: map,
        });

        crimeMarker.addListener("click", () => {
          infowindow.open({
            anchor: crimeMarker,
            map,
          });
          const panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano"),
            {
              position: latLng,
              pov: {
                heading: 34,
                pitch: 10,
              },
            }
          );
        
          map.setStreetView(panorama);
        });

        crimeMarker.addListener("closeclick", () => {
          infowindow.close();
        });
      }
    });
  });
}

var getJSON = function (url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

window.initMap = initMap;
