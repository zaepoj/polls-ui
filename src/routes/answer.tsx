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
} from "@chakra-ui/react";
import ky from "ky";
import { type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchApi from "../hooks/fetchApi";
import { type Poll } from "../types/poll";

const AnswerView = () => {
  const [poll, setPoll] = useState<Poll>();
  const [error, setError] = useState<Boolean>();
  const [pollAnswer, setPollAnswer] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [response] = useFetchApi<Poll>(`http://localhost:4011/polls/${id}`);

  useEffect(() => {
    if (response && "data" in response) {
      setPoll(response.data);
    }
    if (response && "error" in response) {
      setError(true);
      showErrorToast("error fetching poll");
    }
  }, [response]);

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
    <Flex
      padding=".5em"
      justifyContent={"center"}
      alignItems={"center"}
      height="100%"
    >
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column">
          <Heading size="xl" padding="10">
            {poll?.title}
          </Heading>

          <Stack>
            <RadioGroup
              onChange={handleSelect}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {poll?.options.map((option) => {
                return (
                  <Radio value={option.id} size="lg">
                    {option.value}
                  </Radio>
                );
              })}
            </RadioGroup>
          </Stack>
          <Flex justifyContent="flex-end">
            <Button disabled={submitting} type="submit">Create</Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export default AnswerView;
