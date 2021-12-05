import React from "react";

import Map from "./components/Map/Map";

import "./App.css";

import { ChakraProvider, extendTheme, Flex, Heading } from "@chakra-ui/react";
import { Box, Stack, StackItem } from "@chakra-ui/layout";
import Dropdown from "components/dropdown/Dropdown";
import Barchart from "components/Barchart/Barchart";
import Piechart from "components/Piechart/Piechart";
import { COLORS, retroBG } from "shared/constants";

const boxStyles: any = {
  padding: "15px 30px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "4px",
  backgroundColor: COLORS.primary,
};

function App() {
  const [year, setYear] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [barYear, setBarYear] = React.useState("");

  const theme = extendTheme({
    styles: {
      global: {
        "html, body": {
          backgroundColor: COLORS.background,
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <StackItem padding="10px 20px">
          <Heading
            color={`${COLORS.text}`}
            as="h1"
            size="4xl"
            textAlign="left"
            className="heading"
            fontWeight="700"
          >
            World happiness report
          </Heading>
        </StackItem>
        <StackItem padding="10px 20px">
          <Heading
            color={`${COLORS.text}`}
            as="h2"
            fontSize="2xl"
            textAlign="left"
            className="heading"
          >
            The World Happiness Report is a landmark survey of the state of
            global happiness.
          </Heading>
        </StackItem>
        <StackItem>
          <Flex width="100%" maxWidth="100%" height="100%" padding="10px  ">
            <Box {...boxStyles} margin="0px 10px 0px 0px" flex="1" {...retroBG}>
              <Flex justifyContent="flex-end" alignItems="center">
                <Dropdown onSelect={setYear} />
              </Flex>
              <Map year={year} setCountry={setCountry} />
            </Box>

            <Stack flex="1">
              <StackItem {...boxStyles} margin="0px" flex="1" {...retroBG}>
                <Barchart country={country} setYear={setBarYear} />
              </StackItem>
              <StackItem
                {...boxStyles}
                margin="30px 10px 0 10px"
                flex="1"
                {...retroBG}
              >
                <Piechart year={barYear || year} country={country} />
              </StackItem>
            </Stack>
          </Flex>
        </StackItem>
      </Stack>
    </ChakraProvider>
  );
}

export default App;
