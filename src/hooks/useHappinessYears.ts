import React from "react";
import { HappinessDataset, HappinessYear } from "types";

const useHappinessYears = (country: string, data: HappinessDataset) => {
  const [happinessYears, setHappinessYears] = React.useState<HappinessYear[]>(
    []
  );

  React.useEffect(() => {
    const result: HappinessYear[] = [];
    Object.keys(data).forEach((year) => {
      const correctCountry = data[year].find((d) => d.Country === country);

      if (correctCountry) {
        result.push({ year, score: correctCountry.Score });
      }
    });

    setHappinessYears(result);
  }, [country, data]);

  return { happinessYears };
};

export default useHappinessYears;
