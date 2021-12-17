import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { COLORS, YEARS } from "shared/constants";

const Timeline = (props: {
  onSelect: (y: string) => void;
  passedYear: string;
}) => {
  const [selected, setSelected] = React.useState<string>("");

  React.useEffect(() => {
    setSelected(props.passedYear);
  }, [props.passedYear]);

  const onClick = (year: string) => {
    props.onSelect(year);

    setSelected(year);
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      align="center"
      justifyContent="center"
      marginBottom="20px"
    >
      <Flex
        width="100%"
        align="center"
        justifyContent="center"
        marginBottom="5px"
      >
        {YEARS.map((year, index) => (
          <Flex key={year} alignItems="center" justifyContent="center">
            <Box
              borderRadius="50%"
              width="20px"
              height="20px"
              backgroundColor="transparent"
              onClick={() => onClick(year)}
              display="flex"
              justifyContent="center"
              alignItems="center"
              border={`1px solid ${COLORS.text}`}
              cursor="pointer"
            >
              {selected === year ? (
                <Box
                  borderRadius="50%"
                  width="10px"
                  height="10px"
                  backgroundColor={COLORS.text}
                  onClick={() => onClick(year)}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                />
              ) : null}
            </Box>
            {index === YEARS.length - 1 ? null : (
              <Box width="64px" height="1px" backgroundColor={COLORS.text} />
            )}
          </Flex>
        ))}
      </Flex>
      <Flex width="100%" align="center" justifyContent="center">
        {YEARS.map((year, index) => (
          <Flex key={year} alignItems="center" justifyContent="center">
            <Box
              onClick={() => onClick(year)}
              display="flex"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
            >
              <Heading
                color={`${COLORS.text}`}
                as="h3"
                size="md"
                textAlign="center"
                className="heading"
                fontWeight="700"
              >
                {year}
              </Heading>
            </Box>
            {index === YEARS.length - 1 ? null : (
              <Box width="50px" height="0px" />
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Timeline;
