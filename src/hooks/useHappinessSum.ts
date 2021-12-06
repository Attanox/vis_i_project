import React from "react";
import { HappinessDataset, HappinessSum } from "types";

const useHappinessSum = (
  year: string,
  country: string,
  data: HappinessDataset
) => {
  const [happinessSum, setHappinessSum] = React.useState<HappinessSum>([]);

  React.useEffect(() => {
    const correctCountry = data[year]?.find((d) => d.Country === country);

    if (correctCountry) {
      let sum = 0;
      const components: HappinessSum = [];

      const needed = [
        "Economy",
        "Freedom",
        "Generosity",
        "Health",
        "Trust",
        year === "2018" || year === "2019" ? "Social support" : "Family",
      ];
      needed.forEach((n) => {
        sum += Number(correctCountry[n]);
      });

      needed.forEach((n) => {
        components.push({
          label: n,
          value: Number(correctCountry[n]) * (sum / 100),
          original_value: Number(correctCountry[n]),
        });
      });

      setHappinessSum(components);
    }
  }, [year, country, data]);

  return { happinessSum };
};

export default useHappinessSum;
