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
    width: window.innerWidth * 0.5,
    margin: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
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

const Map = (props: { year: string }) => {
  const countryNameAccessor = (d: any) => d.properties.name;

  const { data } = usePreprocessData();

  const { dimensions, pathGenerator } = getMapProperties();

  const { metricByCountry } = useMetricByCountry(props.year, data);

  const { colorScale } = useColorScale(metricByCountry);
  console.log({ colorScale });

  const onCountryClick = (name: string) => {
    console.log({ country: name });
  };

  if (!pathGenerator) return null;

  return (
    <>
      <svg width={dimensions.width} height={dimensions.height}>
        <g
          style={{
            transform: `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
          }}
        >
          <path
            className="earth"
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
                key={`path-${i}`}
                d={pathGenerator(d as any) as string | undefined}
                className="country"
                fill={fill.color}
                stroke="aliceblue"
                strokeWidth={0.5}
                onClick={() => onCountryClick(countryNameAccessor(d))}
              />
            );
          })}
        </g>
      </svg>
    </>
  );
};

export default Map;
