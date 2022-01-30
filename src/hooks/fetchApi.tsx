import { useState, useEffect } from "react";
import ky from "ky";
import {  type Response, type FetchError } from "../types/generic";

/**
 *  hook to fetch data with GET
 *  returns: data | error
 */
const useFetchApi = <T,>(
  url: string
): [Response<T> | FetchError | undefined] => {
  const [response, setResponse] = useState<Response<T>>();
  const [error, setError] = useState<FetchError>();

  useEffect(() => {
    ky.get(url)
      .then((res1) => {
        return res1;
      })
      .then(async (res) => {
        const data = await res.json();
        setResponse({ data });
      })
      .catch((e) => setError({ error: { code: e.response.status } }));
  }, []);

  return [response || error];
};

export default useFetchApi;
