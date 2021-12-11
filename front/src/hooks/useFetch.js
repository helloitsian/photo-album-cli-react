import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

const useFetch = (url, options={ method: 'get' }) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(data);

  const doRequest = useCallback(() => {
    options.url = url;
    return axios(options)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  })

  useEffect(() => {
    doRequest()
  }, [doRequest])

  return { isLoading, data, error };
}

export default useFetch;