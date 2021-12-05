import React from "react";
import * as d3 from "d3";
import { COLORS } from "shared/constants";

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
          .range([COLORS.highlight, COLORS.text]);

        setColorScale({ call: newColorScale });
      }
    }
  }, [metricByCountry]);

  return { colorScale };
};

export default useColorScale;
