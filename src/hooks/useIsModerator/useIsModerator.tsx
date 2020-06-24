import { useState, useEffect } from 'react';

export default function useIsModerator() {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let roomType = urlParams.get('type');
  let role = urlParams.get('role');

  const [isModerator, setIsModerator] = useState(roomType === 'webinar' && role === 'moderator');

  useEffect(() => {
    if (roomType === 'webinar' && role === 'moderator') {
      setIsModerator(true);
    }
  }, [isModerator]);

  return isModerator;
}
