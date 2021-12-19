import React from "react";

import { ChakraProvider, extendTheme, Flex, Heading } from "@chakra-ui/react";
import { Box, Stack, StackItem } from "@chakra-ui/layout";

import Map from "./components/Map/Map";
import Barchart from "components/Barchart/Barchart";
import Piechart from "components/Piechart/Piechart";
import Timeline from "components/Timeline/Timeline";

import { COLORS, retroBG } from "shared/constants";

import "./App.css";

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

  const theme = extendTheme({
    styles: {
      global: {
        "html, body": {
          backgroundColor: COLORS.background,
          height: "100%",
        },
        "#root": {
          height: "100%",
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Stack height="100%" maxWidth="100%">
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
        <StackItem flex="1">
          <Flex width="100%" maxWidth="100%" height="100%" padding="10px">
            <Box {...boxStyles} margin="0px 10px 0px 0px" flex="1" {...retroBG}>
              <Flex justifyContent="flex-end" alignItems="center">
                <Timeline onSelect={setYear} passedYear={year} />
              </Flex>
              <Map year={year} setCountry={setCountry} />
            </Box>

            <Stack flex="1">
              <StackItem {...boxStyles} margin="0px" flex="1" {...retroBG}>
                <Barchart country={country} year={year} setYear={setYear} />
              </StackItem>
              <StackItem
                {...boxStyles}
                margin="30px 10px 0 10px"
                flex="1"
                {...retroBG}
              >
                <Piechart year={year} country={country} />
              </StackItem>
            </Stack>
          </Flex>
        </StackItem>
      </Stack>
    </ChakraProvider>
  );
}

export default App;
