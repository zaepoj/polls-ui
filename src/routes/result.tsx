import {
  Box,
  Flex,
  Heading,
  IconButton,
  Progress as CountBar,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { type PollResult } from "../types/poll";
import { LinkIcon } from "@chakra-ui/icons";
import Card from "../components/card";

const ResultView = () => {
  const { id } = useParams();
  const [listening, setListening] = useState(false);
  const [pollResult, setPollResults] = useState<PollResult>();
  const { hasCopied, onCopy } = useClipboard(window.location.href);
  const toast = useToast();

  useEffect(() => {
    if (!listening) {
      const events = new EventSource(
        `${process.env.REACT_APP_API_URL}/polls/${id}/results`
      );
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        setPollResults(parsedData);
      };
      setListening(true);
    }
  }, [id]);

  useEffect(() => {
    if (hasCopied) {
      showCopySuccessfulToast();
    }
  }, [hasCopied]);

  const totalCounts = useMemo(() => {
    if (pollResult) {
      const total = pollResult.options.reduce(
        (total, opt) => (total += opt.count),
        0
      );

      return total;
    }
    return 0;
  }, [pollResult]);

  const showCopySuccessfulToast = () => {
    toast({
      position: "bottom-right",
      render: () => (
        <Box color="white" p={3} bg="green.500">
          Copied to clipboard!
        </Box>
      ),
    });
  };

  return (
    <Flex
      padding=".5em"
      justifyContent={"center"}
      alignItems={"center"}
      height="100%"
    >
      <Card w="100%" style={{ maxWidth: "600px" }}>
        <Flex alignItems="center">
          <Heading textAlign={"center"} size="xl" padding="10">
            {pollResult?.title}
          </Heading>
          <IconButton
            style={{ backgroundColor: "transparent" }}
            aria-label="share"
            onClick={onCopy}
            icon={<LinkIcon />}
          />
        </Flex>
        <Stack w="100%" p="2em" style={{ maxWidth: "1000px" }}>
          {pollResult?.options.map((opt) => {
            console.log(totalCounts);
            return (
              <Box key={opt.id}>
                <Flex alignItems="center" gap={".35em"}>
                  <Heading size="m">{opt.value}</Heading>
                  <Text fontSize="xs">{opt.count} votes</Text>
                </Flex>
                <CountBar
                  colorScheme="red"
                  height="32px"
                  value={(opt.count / totalCounts) * 100}
                  sx={{
                    "& > div:first-of-type": {
                      transitionProperty: "width",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </Card>
    </Flex>
  );
};

export default ResultView;
