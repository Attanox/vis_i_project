import React from "react";
import * as d3 from "d3";
import { COLORS } from "shared/constants";

const useColorScale = (metricByCountry: { [country: string]: string }) => {
  const [colorScale, setColorScale] = React.useState<any>();
  const [change, setChange] = React.useState<{ min: string; max: string }>();

  React.useEffect(() => {
    const metricValues = Object.values(metricByCountry);

    const metricValueExtent = d3.extent(metricValues);

    if (metricValueExtent[0] && metricValueExtent[1]) {
      const maxChange = d3.max([metricValueExtent[0], metricValueExtent[1]]);
      const minChange = d3.min([metricValueExtent[0], metricValueExtent[1]]);
      console.log({ minChange, maxChange });

      if (maxChange && minChange) {
        const newColorScale = d3
          .scaleLinear<string>()
          .domain([Number(minChange), Number(maxChange)])
          .range([COLORS.highlight, COLORS.text]);

        setColorScale({ call: newColorScale });
        setChange({
          min: Number(minChange).toFixed(2),
          max: Number(maxChange).toFixed(2),
        });
      }
    }
  }, [metricByCountry]);

  return { colorScale, change };
};

export default useColorScale;
