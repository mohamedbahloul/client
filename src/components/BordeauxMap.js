import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";

import universityIconUrl from "../assets/Université.png";

const Div = styled.div`
  margin-bottom: 10%;
  width: 95%;
`;

const universityIcon = L.icon({
  iconUrl: universityIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function BordeauxMap() {
  const [mapHeight, setMapHeight] = useState(window.innerHeight * 0.5);

  useEffect(() => {
    const mapCenter = [44.7987897, -0.6154092];
    const map = L.map("map", {
      center: mapCenter,
      zoom: 6,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markerCoordinates = [
      {
        coord: [48.97155581127591, 2.5941110032210695],
        label: "Université Gustave Eiffel",
      },
      {
        coord: [46.14913385444316, -1.155439299099722],
        label: "Université de La Rochelle",
      },
      {
        coord: [45.82507391081293, 1.259882441672819],
        label: "Université de Limoges",
      },
      {
        coord: [46.58631380675584, 0.34210733021681394],
        label: "Université de Poitiers",
      },
      {
        coord: [44.795702814912474, -0.6164211819528165],
        label: "Université de Bordeaux Montaigne",
      },
      {
        coord: [44.82516036465213, -0.6060986192125665],
        label: "Université de Bordeaux",
      },
      {
        coord: [43.313532512523004, -0.36507176023496246],
        label: "Université de Pau et des Pays de l'Adour",
      },
    ];

    // Créez un groupe de marqueurs pour utiliser le plugin markercluster
    const markerClusterGroup = L.markerClusterGroup();

    markerCoordinates.forEach((coords) => {
      const marker = L.marker(coords.coord, { icon: universityIcon });
      marker.bindPopup(coords.label).openPopup();
      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);

    const handleResize = () => {
      setMapHeight(window.innerHeight * 0.7);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      map.remove();
      markerClusterGroup.clearLayers();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <Div id="map" style={{ height: mapHeight + "px" }}></Div>;
}

export default BordeauxMap;
