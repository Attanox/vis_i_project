import React, { useEffect, useRef, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as d3 from "d3";

import countries from "./world.geo.json";
import { Feature, Geometry } from "geojson";

import "./Map.css";

type TFeature = {
  type: string;
  properties: { [key: string]: string | number };
  geometry: Geometry;
};

const Map = () => {
  const scale: number = 200;
  const cx: number = 400;
  const cy: number = 150;

  const projection = geoEqualEarth()
    .scale(scale)
    .translate([cx, cy])
    .rotate([0, 0]);

  const onCountryClick = (name: string) => {
    console.log({ country: name });
  };

  return (
    <>
      <svg width={scale * 3} height={scale * 3} viewBox="0 0 800 450">
        <g>
          {countries.features.map((d, i) => (
            <path
              key={`path-${i}`}
              d={geoPath().projection(projection)(d as any) as string}
              fill={`cornflowerblue`}
              stroke="aliceblue"
              strokeWidth={0.5}
              onClick={() => onCountryClick(d.properties.name)}
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default Map;
