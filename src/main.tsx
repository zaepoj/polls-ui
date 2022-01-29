import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateView from "./routes/create";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "./theme";
import "./app.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={Theme}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="create" element={<CreateView />} />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
