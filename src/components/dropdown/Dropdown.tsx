import React, { ChangeEvent } from "react";

import { Select } from "@chakra-ui/select";
import { YEARS } from "shared/constants";

const Dropdown = (props: { onSelect: (y: string) => void }) => {
  const [selected, setSelected] = React.useState<string>("");

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    console.log({ val });

    props.onSelect(val);

    setSelected(val);
  };

  return (
    <Select
      bg="cornflowerblue"
      borderColor="cornflowerblue"
      color="white"
      placeholder="Select year of happiness"
      onChange={onChange}
      value={selected}
      width={"250px"}
    >
      {YEARS.map((y, i) => (
        <option key={i} style={{ color: "cornflowerblue" }} value={y}>
          {y}
        </option>
      ))}
    </Select>
  );
};

export default Dropdown;
