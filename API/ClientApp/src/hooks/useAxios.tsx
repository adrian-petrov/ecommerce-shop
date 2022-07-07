import React from 'react';
import axios from 'axios';

export const useAxios = <T,>(
  initialUrl: string,
  initialData: T | null,
  payload?: {},
) => {
  const [data, setData] = React.useState<T | null>(initialData);
  const [url] = React.useState(initialUrl);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = payload
          ? await axios.post(url, payload)
          : await axios.get(url);
        if (response.status === 200) {
          setData(response.data);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [url]);

  return { data, isLoading, isError };
};
