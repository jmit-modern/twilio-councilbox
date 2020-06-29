import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import useIsWebinar from '../useIsWebinar/useIsWebinar';

import socketIOClient from "socket.io-client";


export default function useLocalTracksToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();
  const { socket } = useAppState();

  const [isPublished, setIsPublished] = useState(false)

    const toggleTracksEnabled = useCallback(() => {
        // console.log(data.state)
        localTracks.forEach(track=>{
            if(isPublished){
                localParticipant.unpublishTrack(track);
            }else{
                localParticipant.publishTrack(track)
            }
        })
        setIsPublished(!isPublished)
    },[isPublished, localParticipant])

  return [isPublished, setIsPublished, toggleTracksEnabled] as const;
}
