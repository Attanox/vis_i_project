import React, { ChangeEvent } from "react";

import { Select } from "@chakra-ui/select";
import { COLORS, YEARS } from "shared/constants";

const Dropdown = (props: {
  onSelect: (y: string) => void;
  passedYear: string;
}) => {
  const [selected, setSelected] = React.useState<string>("");

  React.useEffect(() => {
    setSelected(props.passedYear);
  }, [props.passedYear]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    props.onSelect(val);

    setSelected(val);
  };

  return (
    <Select
      bg={`${COLORS.text}`}
      borderColor={`${COLORS.text}`}
      color={`#fff`}
      placeholder="Select year of happiness"
      onChange={onChange}
      value={selected}
      width={"250px"}
    >
      {YEARS.map((y, i) => (
        <option key={i} style={{ color: COLORS.text }} value={y}>
          {y}
        </option>
      ))}
    </Select>
  );
};

export default Dropdown;
