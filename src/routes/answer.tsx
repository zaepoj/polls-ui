import { LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  useToast,
  Stack,
  RadioGroup,
  Radio,
  Button,
  IconButton,
  useClipboard,
} from "@chakra-ui/react";
import ky from "ky";
import { type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/card";
import useFetchApi from "../hooks/fetchApi";
import { type Poll } from "../types/poll";

const AnswerView = () => {
  const [poll, setPoll] = useState<Poll>();
  const [error, setError] = useState<Boolean>();
  const [pollAnswer, setPollAnswer] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const { hasCopied, onCopy } = useClipboard(window.location.href);

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [response] = useFetchApi<Poll>(
    `${process.env.REACT_APP_API_URL}/polls/${id}`
  );

  useEffect(() => {
    if (response && "data" in response) {
      setPoll(response.data);
    }
    if (response && "error" in response) {
      setError(true);
      showErrorToast("error fetching poll");
    }
  }, [response]);

  useEffect(() => {
    if (hasCopied) {
      showCopySuccessfulToast();
    }
  }, [hasCopied]);

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

  const showErrorToast = (message: string) => {
    toast({
      position: "bottom-left",
      render: () => (
        <Box color="white" p={3} bg="red.500">
          {message}
        </Box>
      ),
    });
  };

  if (!poll && !error) {
    return (
      <Flex
        padding=".5em"
        justifyContent={"center"}
        alignItems={"center"}
        height="100%"
      >
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  const handleSelect = (selected: string) => {
    setPollAnswer(selected);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    await ky
      .post(`http://localhost:4011/polls/${id}/answer`, {
        json: { optionId: pollAnswer },
      })
      .then(async () => {
        navigate(`/${id}/results`);
      })
      .catch(() => showErrorToast("Failed to save poll answer"))
      .finally(() => setSubmitting(false));
  };

  return (
    <Flex justify="center" alignItems="center" height="100%" width="100%">
      <Card w="100%" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex alignItems="center">
              <Heading textAlign={"center"} size="xl" padding="10">
                {poll?.title}
              </Heading>
              <IconButton
                style={{ backgroundColor: "transparent" }}
                aria-label="share"
                onClick={onCopy}
                icon={<LinkIcon />}
              />
            </Flex>

            <Stack p="2em" w="100%">
              <RadioGroup
                onChange={handleSelect}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {poll?.options.map((option) => {
                  return (
                    <Radio key={option.id} p="1em" value={option.id} size="lg">
                      {option.value}
                    </Radio>
                  );
                })}
              </RadioGroup>
            </Stack>
            <Flex justifyContent="flex-end" w="100%">
              <Button disabled={submitting} type="submit">
                Submit
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default AnswerView;
