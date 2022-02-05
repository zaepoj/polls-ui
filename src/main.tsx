import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateView from "./routes/create";
import AnswerView from "./routes/answer";
import ResultView from "./routes/result";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "./theme";
import "./app.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={Theme}>
        <Routes>
          <Route path="/:id" element={<AnswerView />} />
          <Route path="/:id/results" element={<ResultView />} />
          <Route path="/create" element={<CreateView />} />
          <Route path="/" element={<CreateView />} />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
