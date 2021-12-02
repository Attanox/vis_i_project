import React from "react";

import Map from "./components/Map/Map";

import "./App.css";

import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import Dropdown from "components/dropdown/Dropdown";
import Barchart from "components/Barchart/Barchart";
import Piechart from "components/Piechart/Piechart";

function App() {
  const [year, setYear] = React.useState("");
  const [country, setCountry] = React.useState("");

  return (
    <ChakraProvider>
      <Dropdown onSelect={setYear} />
      <Map year={year} setCountry={setCountry} />

      <Flex>
        <Box flex="1">
          <Barchart country={country} />
        </Box>
        <Box flex="1">
          <Piechart year={year} country={country} />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
