import React, { Ref } from "react";
import * as d3 from "d3";

import usePreprocessData from "hooks/usePreprocessData";

import { Dimensions, HappinessYear } from "types";

import "./Barchart.css";
import useHappinessYears from "hooks/useHappinessYears";
import { useD3 } from "hooks/useD3";

const getDimensions = () => {
  const dimensions: Dimensions = {
    width: 600,
    height: 600 * 0.6,
    boundedWidth: 0,
    boundedHeight: 0,
    margin: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  return dimensions;
};

const Barchart = (props: { country: string }) => {
  const dimensions = getDimensions();

  const { data } = usePreprocessData();

  const { happinessYears } = useHappinessYears(props.country, data);

  const xAccessor = (d: HappinessYear) => d.year;
  const yAccessor = (d: HappinessYear) => d.score;

  const svgRef = useD3(
    (svg: any) => {
      const xScale = d3
        .scaleBand()
        .domain(happinessYears.map(xAccessor))
        .rangeRound([
          dimensions.margin.left,
          dimensions.width - dimensions.margin.right,
        ])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, Number(d3.max(happinessYears, yAccessor))])
        .rangeRound([
          dimensions.height - dimensions.margin.bottom,
          dimensions.margin.top,
        ]);

      const xExtent = d3.extent(xScale.domain());
      const xTicks = d3
        .ticks(Number(xExtent[0]), Number(xExtent[1]), dimensions.width / 40)
        .filter((v) => xScale(`${v}`) !== undefined);
      const xAxisGenerator = (g: any) =>
        g.call(
          d3
            .axisBottom(xScale)
            .tickValues(xTicks.map((t) => `${t}`))
            .tickSizeOuter(0)
        );

      const yExtent = d3.extent(yScale.domain());
      const yTicks = d3
        .ticks(yExtent[0] || 0, yExtent[1] || 0, dimensions.height / 40)
        .filter((v) => yScale(v) !== undefined);
      const yAxisGenerator = (g: any) => {
        g.call(d3.axisLeft(yScale).tickValues(yTicks)).call((g: any) =>
          g.select(".domain").remove()
        );
      };

      svg.select(".barchart-x-axis").call(xAxisGenerator);
      svg.select(".barchart-y-axis").call(yAxisGenerator);

      svg
        .select(".barchart-bounds")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(happinessYears)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d: any) => Number(xScale(xAccessor(d))))
        .attr("width", xScale.bandwidth())
        .attr("y", (d: any) => yScale(Number(yAccessor(d))))
        .attr("height", (d: any) => yScale(0) - yScale(Number(yAccessor(d))));
    },
    [props.country, happinessYears]
  );

  if (!props.country) return null;

  return (
    <>
      <svg
        ref={svgRef}
        id="barchart-wrapper"
        width={dimensions.width}
        height={dimensions.height}
        style={{ marginLeft: `${dimensions.margin.left}px` }}
      >
        <g
          className="barchart-bounds"
          style={{
            transform: `translate(${dimensions.margin.left}px, ${0}px)`,
          }}
        />
        <g
          className="barchart-x-axis"
          style={{
            transform: `translate(${0}px, ${
              dimensions.height - dimensions.margin.bottom
            }px)`,
          }}
        />
        <g
          className="barchart-y-axis"
          style={{
            transform: `translate(${dimensions.margin.left}px, ${0}px)`,
          }}
        />
      </svg>
    </>
  );
};

export default Barchart;
