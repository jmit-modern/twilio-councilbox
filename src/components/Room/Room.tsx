import React, { useEffect, useCallback } from 'react';
import ContainerView from './ContainerView';
import GridView from './GridView';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';

import socketIOClient from "socket.io-client";
import { useAppState } from '../../state';
import useIsWebinar from '../../hooks/useIsWebinar/useIsWebinar';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import useLocalTracksToggle from '../../hooks/useLocalTracksToggle/useLocalTracksToggle';
import usePublications from '../../hooks/usePublications/usePublications';
import VideoTrack from '../VideoTrack/VideoTrack';

interface ViewModeProps {
  viewMode: boolean;
}

export default function Room({ viewMode }: ViewModeProps) {

  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
    getLocalVideoTrack,
  } = useVideoContext();

  const isWebinar = useIsWebinar();

  // const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  // const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  const { socket, setSocket, isPublished, setIsPublished } = useAppState();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  const publications = usePublications(localParticipant);
  const videoPublication = publications.find(p => p.trackName.includes('camera'));
  let isVideoEnabled = Boolean(videoPublication);
  // const isVideoEnabled = videoTrack ? videoTrack.isStopped : false;

  setIsPublished(isVideoEnabled)
  // console.log(`isVideoEnabled000: ${isVideoEnabled}`)
  // console.log(videoTrack)

  const toggleTracksEnabled = useCallback(() => {

    // getLocalVideoTrack().then((track: LocalVideoTrack) => {
    //   console.log(track)
    //   const isVideoEnabled = track ? track.isStopped : false;
    //   setIsPublished(isVideoEnabled)
    // });
    // const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
    // console.log(videoTrack)
    // const isVideoEnabled = videoTrack ? videoTrack.isStopped : false;
    // setIsPublished(!isVideoEnabled)

    console.log(`isPublished: ${isPublished}`);
    // setIsStopped(!isVideoEnabled); 
    // console.log(`after setisStopped: ${isStopped}`);  
    
    if (isPublished) {
      console.log("aaa")
      
        // getLocalVideoTrack().then((track: LocalVideoTrack) => {
        //   if (localParticipant) {
        //     track.stop();
        //     const localVideoTrackPublication = localParticipant.unpublishTrack(track);
        //     // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        //     localParticipant.emit('trackUnpublished', localVideoTrackPublication);
        //   }
        // });

        // getLocalAudioTrack().then((track: LocalAudioTrack) => {
        //   if(localParticipant) {
        //     track.stop();
        //     const localAudioTrackPublication = localParticipant.unpublishTrack(track);
        //     // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        //     localParticipant.emit('trackUnpublished', localAudioTrackPublication);
        //   }
        // })
        const localTrackPublication = localParticipant.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant.emit('trackUnpublished', localTrackPublication);
        videoTrack.stop();

        const localAudioTrackPublication = localParticipant.unpublishTrack(audioTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant.emit('trackUnpublished', localAudioTrackPublication);
        audioTrack.disable()
        audioTrack.stop();
    } else {
      console.log("bbb")
      getLocalVideoTrack().then((track: LocalVideoTrack) => {
        if (localParticipant) {
          localParticipant.publishTrack(track, { priority: 'low' })
        }
      });
      getLocalAudioTrack().then((track: LocalAudioTrack) => {
        if(localParticipant) {
          localParticipant.publishTrack(track);
          track.enable()
        }
      })
    }
      
  },[isPublished, localParticipant, videoTrack, audioTrack, getLocalAudioTrack, getLocalVideoTrack ])

  useEffect(()=>{

    const socket = socketIOClient.connect("http://localhost:8080");

    setSocket(socket);

    // Video & Audio enable/disable only when its webinar from listening webcoket from server
    socket.on('publish-changed', (data: any)=>{
        if(isWebinar && localParticipant.identity === data.identity){
          toggleTracksEnabled()
        }
    });
    console.log("effect call")

    return () => {
      socket.disconnect();
    }

  }, [audioTrack, videoTrack, isPublished]);

  return (
    viewMode ? <ContainerView/> : <GridView />
  )
}
