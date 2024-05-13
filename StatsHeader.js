import React from 'react';
import {
  Heading,
  Text,
  Divider,
  Box,
  ChakraProvider,
  theme,
  useColorModeValue,
} from '@chakra-ui/react';

function StatsHeader() {
  return (
    <ChakraProvider theme={theme}>
      <Box w="100%" py={4} px={10}>
        <Heading
          as="h1"
          size="xl"
          textAlign="left"
          colorScheme={useColorModeValue('purple.400', 'green.900')}
        >
          Charts
        </Heading>
        <Heading
          as="h2"
          size="md"
          textAlign="left"
          paddingTop="5px"
          color="orange.600"
        >
          Fire Related Statistics
        </Heading>
        {/* <Divider marginTop="5" /> */}
      </Box>
    </ChakraProvider>
  );
}

export default StatsHeader;
