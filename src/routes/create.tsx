import { type FormEvent, useState } from "react";
import {
  Flex,
  Stack,
  Input,
  Heading,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
  Box,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import ky from "ky";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { type HTMLEvent } from "../types/generic";
import Card from "../components/Card";

const CreateView = () => {
  const [formState, setFormState] = useState({
    title: "",
    options: [{ value: "" }],
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const addNewOption = () => {
    const options = [...formState.options, { value: "" }];
    setFormState({ ...formState, options });
  };

  const handleTitleChange = (event: HTMLEvent) => {
    setFormState({ ...formState, title: event.target.value });
  };

  const handleOptionChange = (event: HTMLEvent, index: number) => {
    const options = formState.options.map((opt, i) => {
      return index === i ? { value: event.target.value } : opt;
    });

    setFormState({ ...formState, options });
  };

  const handleDeleteOption = (index: number) => {
    const options = formState.options.filter((_, i) => i !== index);
    setFormState({ ...formState, options });
  };

  const onFormSubmit = async (event: FormEvent) => {
    setSubmitting(true);
    event.preventDefault();

    const filledOpts = formState.options.filter((opt) => Boolean(opt.value));

    await ky
      .post(`http://localhost:4011/polls`, {
        json: { title: formState.title, options: filledOpts },
      })
      .then(async (res) => {
        const data: { pollId: string } = await res.json();
        navigate(`/${data.pollId}`);
      })
      .catch(() => showErrorToast("Failed to create poll"))
      .finally(() => setSubmitting(false));
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

  return (
    <Flex
      padding=".5em"
      justifyContent={"center"}
      alignItems={"center"}
      height="100%"
    >
      <Flex
        flexDirection="column"
        width="100%"
        maxWidth="600px"
        alignItems="center"
      >
        <Card w="100%">
          <Heading size="xl" padding="10">
            Create new poll
          </Heading>

          <Stack spacing={3} width="100%">
            <form onSubmit={onFormSubmit} autoComplete="off">
              <FormControl>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  isRequired={true}
                  value={formState.title}
                  onChange={handleTitleChange}
                  name="title"
                  mb="1.5em"
                  id="title"
                  placeholder="Title"
                  size="md"
                />
                <FormLabel>Options: </FormLabel>
                {formState.options.map((opt, key) => {
                  return (
                    <Flex key={key}>
                      <Input
                        name="option[]"
                        onChange={(e) => handleOptionChange(e, key)}
                        value={opt.value}
                        key={key}
                        mb="1em"
                        id={"" + key}
                        placeholder="option"
                        size="md"
                        isRequired
                      />
                      {formState.options.length > 1 && (
                        <IconButton
                          ml={2}
                          onClick={() => handleDeleteOption(key)}
                          aria-label=""
                          icon={<SmallCloseIcon />}
                        />
                      )}
                    </Flex>
                  );
                })}
                {formState.options.length < 10 && (
                  <Button onClick={() => addNewOption()}>Add option</Button>
                )}
              </FormControl>
              <Flex justifyContent="flex-end">
                <Button disabled={submitting} type="submit">
                  Create
                </Button>
              </Flex>
            </form>
          </Stack>
        </Card>
      </Flex>
    </Flex>
  );
};

export default CreateView;
