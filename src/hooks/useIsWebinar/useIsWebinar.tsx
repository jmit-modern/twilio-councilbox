import { useState, useEffect } from 'react';

export default function useIsWebinar() {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let roomType = urlParams.get('type');

  const [isWebinar, setIsWebinar] = useState(roomType === 'webinar');

  useEffect(() => {
    if (roomType === 'webinar') {
      setIsWebinar(true);
    }
  }, [isWebinar]);

  return isWebinar;
}
