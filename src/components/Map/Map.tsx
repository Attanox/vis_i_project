import React from "react";
import * as d3 from "d3";

import usePreprocessData from "hooks/usePreprocessData";

import { Feature } from "geojson";
import { Dimensions } from "types";

import countries from "./world.geo.json";

import "./Map.css";
import useMetricByCountry from "hooks/useMetricByCountry";
import useColorScale from "hooks/useColorScale";
import { COLORS } from "shared/constants";
import { useD3 } from "hooks/useD3";

const SPHERE = { type: "Sphere" };

const getMapProperties = () => {
  const dimensions: Dimensions = {
    width: window.innerWidth * 0.6,
    height: 0,
    margin: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
    boundedHeight: 0,
    boundedWidth: 0,
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  const projection = d3
    .geoEqualEarth()
    .fitWidth(dimensions.boundedWidth, SPHERE as Feature);

  const pathGenerator = d3.geoPath(projection);
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(SPHERE as Feature);

  dimensions.boundedHeight = y1;
  dimensions.height = y1 + dimensions.margin.top + dimensions.margin.bottom;

  return { dimensions, pathGenerator, projection };
};

const Map = (props: { year: string; setCountry: (c: string) => void }) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [zoomCoords, setZoomCoords] = React.useState({ k: 0, x: 0, y: 0 });

  const countryNameAccessor = (d: any) => d.properties.name;

  const { data } = usePreprocessData();

  const { dimensions, pathGenerator, projection } = getMapProperties();

  const { metricByCountry } = useMetricByCountry(props.year, data);

  const svgRef = useD3((svg: any) => {
    const g = svg.select(".map-bounds");
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", function (event) {
        const { x, y, k } = event.transform;
        setZoomCoords({ k, x, y });
        g.selectAll("path").attr("transform", event.transform);
      });

    svg.call(zoom);
  });

  const { colorScale, change } = useColorScale(metricByCountry);

  const onCountryClick = (countryName: string) => {
    props.setCountry(countryName);
  };

  const legendGradientID = "legendGradientID";

  const onCountryEnter = (e: any, d: any) => {
    if (tooltipRef.current) {
      const metricValue = metricByCountry[e.target.id];

      tooltipRef.current.innerHTML = `
        <span>${e.target.id}</span><br />
        <span>${metricValue ? parseFloat(metricValue).toFixed(2) : ""}</span>
      `;

      const [centerX, centerY] = pathGenerator.centroid(d);

      const x = zoomCoords.k
        ? centerX * zoomCoords.k + dimensions.margin.left + zoomCoords.x
        : centerX + dimensions.margin.left;
      const y = zoomCoords.k
        ? centerY * zoomCoords.k + dimensions.margin.top + zoomCoords.y
        : centerY + dimensions.margin.top;

      tooltipRef.current.style.transform = `translate(-50%, -100%)`;

      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;

      tooltipRef.current.style.opacity = "1";
    }
  };
  const onCountryLeave = () => {
    if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
  };

  if (!pathGenerator) return null;

  return (
    <div style={{ position: "relative" }}>
      <div id="map-tooltip" ref={tooltipRef}>
        This is a tool tip!
      </div>
      <svg
        id="map-wrapper"
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
      >
        <g
          className="map-bounds"
          style={{
            transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
          }}
        >
          <path
            className="map-earth-base"
            d={pathGenerator(SPHERE as Feature) as string | undefined}
            fill={`${COLORS.background}`}
            style={{
              stroke: COLORS.background,
              strokeWidth: `1px`,
              strokeLinejoin: "round",
            }}
          />

          {countries.features.map((d, i) => {
            const metricValue = Number(metricByCountry[countryNameAccessor(d)]);

            const fill =
              typeof metricValue === undefined || !colorScale?.call
                ? { color: "aliceblue" }
                : { color: colorScale.call(metricValue) };

            return (
              <path
                key={`map-country-${i}`}
                d={pathGenerator(d as any) as string | undefined}
                className="country"
                id={countryNameAccessor(d)}
                fill={fill.color || "aliceblue"}
                stroke="aliceblue"
                strokeWidth={0.5}
                onClick={() => onCountryClick(countryNameAccessor(d))}
                onMouseEnter={(e) => onCountryEnter(e, d)}
                onMouseLeave={onCountryLeave}
              />
            );
          })}
        </g>
        {props.year ? (
          <>
            <rect
              fill="#fff"
              x="35px"
              y={
                dimensions.width < 800
                  ? dimensions.boundedHeight - 30
                  : dimensions.boundedHeight * 0.5 - 45
              }
              width="200px"
              height="75px"
              rx="15"
              stroke={COLORS.text}
              strokeWidth={1}
            />
            <g
              className="map-legend"
              style={{
                transform: `translate(${80}px, ${
                  dimensions.width < 800
                    ? dimensions.boundedHeight - 30
                    : dimensions.boundedHeight * 0.5
                }px)`,
                color: "#333",
              }}
            >
              <text y={-23} className="map-legend-title">
                Happiness score
              </text>
              <text x={-23} y={13}>
                {change ? change.min : ""}
              </text>
              <text x={105} y={13}>
                {change ? change.max : ""}
              </text>
              <rect
                x={10}
                height={16}
                width={90}
                fill={`url(#${legendGradientID})`}
              ></rect>
            </g>
          </>
        ) : null}
        <defs>
          <linearGradient id={legendGradientID}>
            <stop stopColor={`${COLORS.highlight}`} offset="0%"></stop>
            <stop stopColor={`${COLORS.text}`} offset="100%"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Map;
