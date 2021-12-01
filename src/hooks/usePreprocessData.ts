import React from "react";
import * as d3 from "d3";
import { YEARS } from "shared/constants";
import { HappinessDataset } from "types";

const usePreprocessData = (): { data: HappinessDataset } => {
  const [data, setData] = React.useState({});

  const createJoinedDataset = () => {
    const result: { [year: string]: any } = {};

    YEARS.forEach(async (y) => (result[y] = await d3.csv(`./static/${y}.csv`)));

    return result;
  };

  React.useEffect(() => {
    const joined = createJoinedDataset();
    setData(joined);
  }, []);

  return { data };
};

export default usePreprocessData;
