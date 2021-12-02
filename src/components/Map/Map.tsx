import React from "react";
import * as d3 from "d3";

import usePreprocessData from "hooks/usePreprocessData";

import { Feature } from "geojson";
import { Dimensions, HappinessDataset } from "types";

import countries from "./world.geo.json";

import "./Map.css";

const SPHERE = { type: "Sphere" };

const useColorScale = (metricByCountry: { [country: string]: string }) => {
  const [colorScale, setColorScale] = React.useState<any>();

  React.useEffect(() => {
    const metricValues = Object.values(metricByCountry);

    const metricValueExtent = d3.extent(metricValues);

    if (metricValueExtent[0] && metricValueExtent[1]) {
      const maxChange = d3.max([metricValueExtent[0], metricValueExtent[1]]);

      if (maxChange) {
        const newColorScale = d3
          .scaleLinear<string>()
          .domain([-Number(maxChange), Number(maxChange)])
          .range(["white", "darkgreen"]);

        setColorScale({ call: newColorScale });
      }
    }
  }, [metricByCountry]);

  return { colorScale };
};

const getMapProperties = () => {
  const dimensions: Dimensions = {
    width: window.innerWidth * 0.9,
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

  return { dimensions, pathGenerator };
};

const useMetricByCountry = (year: string, data: HappinessDataset) => {
  const metric = "Score";

  const [metricByCountry, setMetricByCountry] = React.useState<{
    [country: string]: string;
  }>({});

  React.useEffect(() => {
    if (year) {
      const mbc: { [country: string]: string } = {};

      data[year]?.forEach((d) => {
        mbc[d.Country] = d[metric];
      });

      setMetricByCountry(mbc);
    }
  }, [year, data]);

  return { metricByCountry };
};

const Map = (props: { year: string; setCountry: (c: string) => void }) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const countryNameAccessor = (d: any) => d.properties.name;

  const { data } = usePreprocessData();

  const { dimensions, pathGenerator } = getMapProperties();

  const { metricByCountry } = useMetricByCountry(props.year, data);

  const { colorScale } = useColorScale(metricByCountry);

  const onCountryClick = (countryName: string) => {
    props.setCountry(countryName);
  };

  const legendGradientID = "legendGradientID";

  const onCountryEnter = (e: any, d: any) => {
    if (tooltipRef.current) {
      const metricValue = metricByCountry[e.target.id];

      tooltipRef.current.innerHTML = `
        <span>${e.target.id}</span><br />
        <span>${metricValue}</span>
      `;

      const [centerX, centerY] = pathGenerator.centroid(d);

      const x = centerX + dimensions.margin.left;
      const y = centerY + dimensions.margin.top;

      tooltipRef.current.style.transform = `translate(50%, 0)`;

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
    <>
      <div
        style={{
          width: "100px",
          height: "50px",
          background: "white",
          color: "#333",
          border: "1px solid #333",
          textAlign: "center",
          opacity: 0,
          position: "absolute",
        }}
        ref={tooltipRef}
      >
        This is a tool tip!
      </div>
      <svg id="map-wrapper" width={dimensions.width} height={dimensions.height}>
        <g
          className="map-bounds"
          style={{
            transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
          }}
        >
          <path
            className="map-earth-base"
            d={pathGenerator(SPHERE as Feature) as string | undefined}
            fill="lightblue"
          />

          {countries.features.map((d, i) => {
            const metricValue = Number(metricByCountry[countryNameAccessor(d)]);

            const fill =
              typeof metricValue === undefined || !colorScale?.call
                ? { color: "aliceblue" }
                : { color: colorScale.call(metricValue) };

            return (
              <path
                key={`map-path-${i}`}
                d={pathGenerator(d as any) as string | undefined}
                className="country"
                id={countryNameAccessor(d)}
                fill={fill.color}
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
            <text y={-9} className="map-legend-byline">
              recorded in: {props.year}
            </text>
            <rect
              x={10}
              height={16}
              width={90}
              fill={`url(#${legendGradientID})`}
            ></rect>
          </g>
        ) : null}
        <defs>
          <linearGradient id={legendGradientID}>
            <stop stopColor="white" offset="0%"></stop>
            <stop stopColor="darkgreen" offset="100%"></stop>
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default Map;
