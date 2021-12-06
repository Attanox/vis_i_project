import React from "react";
import * as d3 from "d3";
import useHappinessSum from "hooks/useHappinessSum";
import usePreprocessData from "hooks/usePreprocessData";
import { Dimensions } from "types";

import "./Piechart.css";
import { useD3 } from "hooks/useD3";
import { COLORS } from "shared/constants";
import { Heading } from "@chakra-ui/layout";

const getDimensions = () => {
  const chartWidth = window.innerWidth * 0.3;
  const dimensions: Dimensions = {
    width: chartWidth,
    height: chartWidth * 0.5,
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

const Piechart = (props: { year: string; country: string }) => {
  const dimensions = getDimensions();

  const innerRadius = dimensions.boundedHeight * 0.15;
  const outerRadius = dimensions.boundedHeight * 0.6;

  const metricAccessor = (d: { label: string; value: number }) => d.value;

  const { data } = usePreprocessData();

  const { happinessSum } = useHappinessSum(props.year, props.country, data);

  const svgRef = useD3(
    (svg: any) => {
      const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateWarm)
        .domain([0, 5]);

      svg.selectAll("path.pie-slice").remove();
      svg.selectAll("text.heading").remove();
      svg.selectAll("rect").remove();

      const arcGenerator = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.02)
        .padRadius(100)
        .cornerRadius(4);
      const pieGenerator = d3
        .pie()
        .padAngle(0)
        .value(metricAccessor as any);
      const arc = svg
        .selectAll()
        .data(pieGenerator(happinessSum as any))
        .enter();

      // Append sectors
      arc
        .append("path")
        .attr("d", arcGenerator)
        .attr("class", "pie-slice")
        .style("fill", (_: any, i: any) => colorScale(i))
        .style("stroke", "#ffffff")
        .style("stroke-width", 1)
        .style(
          "transform",
          `translate(${dimensions.boundedWidth / 1.5}px, ${
            dimensions.boundedHeight / 1.5
          }px)`
        );

      arc
        .append("rect") // make a matching color rect
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", (d: any, i: any) => 20 * i * 1.8 + 15)
        .attr("fill", (_: any, i: any) => {
          // console.log({ _, i });
          return colorScale(i);
        });

      arc
        .append("text")
        .text(
          (d: any) => `${d.data.label} (${d.data.original_value.toFixed(2)})`
        )
        .style("font-size", 18)
        .style("font-weight", 700)
        .style("color", COLORS.text)
        .attr("class", "heading")
        .attr("y", (d: any, i: any) => 20 * i * 1.8 + 15 * 2)
        .attr("x", 30);
    },
    [happinessSum]
  );

  console.log({ happinessSum });

  if (!happinessSum.length) return null;

  return (
    <>
      <Heading as="h3" size="lg" color={COLORS.text} className="heading">
        {props.year}
      </Heading>
      <svg
        ref={svgRef}
        id="piechart-wrapper"
        width={dimensions.width}
        height={dimensions.height}
      >
        <g
          id="piechart-legend"
          style={
            {
              // transform: `translate(${dimensions.boundedWidth / 2}, ${
              //   dimensions.boundedHeight / 2
              // })`,
            }
          }
        ></g>
      </svg>
    </>
  );
};

export default Piechart;
