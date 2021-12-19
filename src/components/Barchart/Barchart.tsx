import React from "react";
import * as d3 from "d3";

import usePreprocessData from "hooks/usePreprocessData";

import { Dimensions, HappinessYear } from "types";

import "./Barchart.css";
import useHappinessYears from "hooks/useHappinessYears";
import { useD3 } from "hooks/useD3";
import { COLORS } from "shared/constants";
import { Heading } from "@chakra-ui/layout";

const getDimensions = () => {
  const chartWidth = window.innerWidth * 0.25;

  const dimensions: Dimensions = {
    width: chartWidth,
    height: chartWidth * 0.75,
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

const Barchart = (props: {
  country: string;
  year: string;
  setYear: (year: string) => void;
}) => {
  const dimensions = getDimensions();

  const { data } = usePreprocessData();

  const { happinessYears } = useHappinessYears(props.country, data);

  const xAccessor = (d: HappinessYear) => d.year;
  const yAccessor = (d: HappinessYear) => d.score;

  const getClass = (d: HappinessYear, year: string) => {
    return d.year === year ? "current bar" : "bar";
  };

  React.useEffect(() => {
    d3.select(".barchart-bounds")
      .selectAll(".bar")
      .data(happinessYears)
      .attr("class", (d: HappinessYear) => getClass(d, props.year));
  }, [props.year, happinessYears]);

  const svgRef = useD3(
    (svg: any) => {
      const xScale = d3
        .scaleBand()
        .domain(happinessYears.map(xAccessor))
        .rangeRound([dimensions.margin.left, dimensions.boundedWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, Number(d3.max(happinessYears, yAccessor))])
        .range([dimensions.boundedHeight, dimensions.margin.top]);

      const xExtent = d3.extent(xScale.domain());
      const xTicks = d3
        .ticks(
          Number(xExtent[0]),
          Number(xExtent[1]),
          dimensions.boundedWidth / 40
        )
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
        .ticks(yExtent[0] || 0, yExtent[1] || 0, dimensions.boundedHeight / 40)
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
        .attr("fill", `${COLORS.text}`)
        .selectAll(".bar")
        .data(happinessYears)
        .join("rect")
        .attr("class", (d: HappinessYear) => getClass(d, props.year))
        .attr("id", (d: HappinessYear) => `bar-year-${xAccessor(d)}`)

        .attr(
          "x",
          (d: HappinessYear) =>
            Number(xScale(xAccessor(d))) + dimensions.margin.left * 3
        )
        .attr("width", xScale.bandwidth())
        .attr("y", (d: HappinessYear) => yScale(Number(yAccessor(d))))
        .attr(
          "height",
          (d: HappinessYear) => yScale(0) - yScale(Number(yAccessor(d)))
        )
        .on("click", (e: PointerEvent) => {
          const newYear = (e.target as HTMLElement).id.replace("bar-year-", "");
          props.setYear(newYear);
          d3.select(".barchart-bounds")
            .selectAll(".bar")
            .data(happinessYears)
            .attr("class", (d: HappinessYear) => getClass(d, newYear));
        });

      svg
        .select(".text-wrapper")
        .selectAll(".text")
        .data(happinessYears)
        .join("text")
        .attr("class", "text heading")
        .text(function (d: HappinessYear) {
          return parseFloat(d.score).toFixed(2);
        })
        .attr("text-anchor", "middle")
        .attr("x", function (d: HappinessYear, i: number) {
          const w = xScale.bandwidth();
          return (
            Number(xScale(xAccessor(d))) + dimensions.margin.left * 3 + w / 2
          );
        })
        .attr("y", function (d: HappinessYear) {
          return yScale(Number(yAccessor(d))) + 20;
        })
        .attr("font-size", "18px")
        .attr("fill", "white");
    },
    [props.country, happinessYears]
  );

  if (!props.country) return null;

  return (
    <>
      <Heading as="h3" size="lg" color={COLORS.text} className="heading">
        {props.country}
      </Heading>
      <svg
        ref={svgRef}
        id="barchart-wrapper"
        width={dimensions.width}
        height={dimensions.height}
      >
        <g
          className="barchart-bounds"
          style={
            {
              // transform: `translate(${dimensions.margin.left}px, ${0}px)`,
            }
          }
        />
        <g
          className="barchart-x-axis"
          style={{
            transform: `translate(${dimensions.margin.left * 3}px, ${
              dimensions.boundedHeight
            }px)`,
            color: `${COLORS.text}`,
          }}
        />
        <g
          className="barchart-y-axis"
          style={{
            transform: `translate(${dimensions.margin.left * 3}px, ${0}px)`,
            color: `${COLORS.text}`,
          }}
        />
        <g className="text-wrapper" />
      </svg>
    </>
  );
};

export default Barchart;
