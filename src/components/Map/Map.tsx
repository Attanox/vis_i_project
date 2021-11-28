import React from "react";
import * as L from "leaflet";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";
// @ts-ignore
import { LeafletLayer } from "deck.gl-leaflet";
import { MapView } from "@deck.gl/core";

import "./Map.css";

const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const geoJsonLayer = () =>
  new GeoJsonLayer({
    id: "airports",
    data: AIR_PORTS,
    // Styles
    filled: true,
    pointRadiusMinPixels: 2,
    pointRadiusScale: 2000,
    getPointRadius: (f) => 11 - (f as any).properties.scalerank,
    getFillColor: [200, 0, 80, 180],
  });

const arcLayer = () =>
  new ArcLayer({
    id: "arcs",
    data: AIR_PORTS,
    dataTransform: ((d: any) =>
      d.features.filter((f: any) => f.properties.scalerank < 4)) as any,
    // Styles
    getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
    getTargetPosition: (f) => (f as any).geometry.coordinates,
    getSourceColor: [0, 128, 200],
    getTargetColor: [200, 0, 80],
    getWidth: 1,
  });

const Map = () => {
  React.useEffect(() => {
    const layers = [geoJsonLayer(), arcLayer()];

    const map = L.map(document.getElementById("map") as HTMLElement, {
      center: [51.47, 0.45],
      zoom: 4,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    const deckLayer = new LeafletLayer({
      views: [
        new MapView({
          repeat: true,
        }),
      ],
      layers,
    });
    map.addLayer(deckLayer);
  }, []);

  return <div id="map"></div>;
};

export default Map;
