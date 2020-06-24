import { useState, useEffect } from 'react';

export default function useIsPublisher() {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let roomType = urlParams.get('type');
  let role = urlParams.get('role');

  const [isPublisher, setIsPublisher] = useState(roomType === 'webinar' && role === 'publisher');

  useEffect(() => {
    if (roomType === 'webinar' && role === 'publisher') {
      setIsPublisher(true);
    }
  }, [isPublisher]);

  return isPublisher;
}
