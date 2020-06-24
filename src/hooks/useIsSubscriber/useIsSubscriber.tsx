import { useState, useEffect } from 'react';

export default function useIsSubscriber() {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let roomType = urlParams.get('type');
  let role = urlParams.get('role');

  const [isSubscriber, setIsSubscriber] = useState(roomType === 'webinar' && role === 'subscriber');

  useEffect(() => {
    if (roomType === 'webinar' && role === 'subscriber') {
      setIsSubscriber(true);
    }
  }, [isSubscriber]);

  return isSubscriber;
}
