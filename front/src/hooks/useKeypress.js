import { useState, useCallback, useEffect } from 'react';

const useKeypress = (targetKey) => {
  const [key, setKey] = useState(null)

  const downHandler = useCallback((event) => {
    const { key } = event;

    setKey(key)    
  }, [setKey])

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [downHandler]);

  return { key, setKey };
}

export default useKeypress;