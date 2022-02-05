import styled from "@emotion/styled";
import { Flex } from "@chakra-ui/react";

const Card = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1em;
  border-radius: 20px;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2), 0 0 1rem rgba(0, 0, 0, 0.2);
`;

export default Card;
