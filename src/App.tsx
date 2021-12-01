import React from "react";

import Map from "./components/Map/Map";

import "./App.css";

import { ChakraProvider } from "@chakra-ui/react";
import Dropdown from "components/dropdown/Dropdown";

function App() {
  const [year, setYear] = React.useState("");

  return (
    <ChakraProvider>
      <Dropdown onSelect={setYear} />
      <Map year={year} />
    </ChakraProvider>
  );
}

export default App;
