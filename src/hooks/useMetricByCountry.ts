import React from "react";
import { HappinessDataset } from "types";

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

export default useMetricByCountry;
