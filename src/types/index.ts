export type HappinessDatum = {
  Rank: string;
  Country: string;
  Score: string;
  Economy: string;
  Family: string;
  Health: string;
  Freedom: string;
  Generosity: string;
  Trust: string;
  [key: string]: string;
};
export type HappinessDataset = { [year: string]: HappinessDatum[] };

export type Dimensions = {
  width: number;
  height: number;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  boundedWidth: number;
  boundedHeight: number;
};

export type HappinessYear = { year: string; score: string };

export type HappinessSum = {
  label: string;
  value: number;
  original_value: number;
}[];
