import React, { useEffect } from 'react';
import ContainerView from './ContainerView';
import GridView from './GridView';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';

import socketIOClient from "socket.io-client";
import { useAppState } from '../../state';
import useIsWebinar from '../../hooks/useIsWebinar/useIsWebinar';
import { LocalAudioTrack } from 'twilio-video';
import useLocalTracksToggle from '../../hooks/useLocalTracksToggle/useLocalTracksToggle';

interface ViewModeProps {
  viewMode: boolean;
}

export default function Room({ viewMode }: ViewModeProps) {

  const {
    room: { localParticipant },
    localTracks
  } = useVideoContext();

  const isWebinar = useIsWebinar();

  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  const { socket } = useAppState();

  const [isPublished, setIsPublished, toggleTracksEnabled] = useLocalTracksToggle()

  useEffect(()=>{

    // Video & Audio enable/disable only when its webinar from listening webcoket from server
    socket.on('change-publish', (data: any)=>{
        // console.log(data.state)
        if(isWebinar && localParticipant.identity == data.identity){
          toggleTracksEnabled()
        }
    });

  }, [isPublished]);

  return (
    viewMode ? <ContainerView/> : <GridView />
  )
}
