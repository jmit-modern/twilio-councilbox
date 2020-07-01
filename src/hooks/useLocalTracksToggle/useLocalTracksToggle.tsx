import { LocalVideoTrack, LocalAudioTrack } from 'twilio-video';
import { useCallback, useState, useEffect } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import useIsWebinar from '../useIsWebinar/useIsWebinar';

import socketIOClient from "socket.io-client";
import useLocalVideoToggle from '../useLocalVideoToggle/useLocalVideoToggle';
import useLocalAudioToggle from '../useLocalAudioToggle/useLocalAudioToggle';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import usePublications from '../usePublications/usePublications';

export default function useLocalTracksToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
    getLocalVideoTrack,
  } = useVideoContext();
  const { socket, isPublished, setIsPublished } = useAppState();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  //UseState for Subscriber published state
  // const [isStopped, setIsStopped] = useState(isVideoEnabled);

  // useEffect(()=>{
  //   setIsStopped(isVideoEnabled)
  // },[isVideoEnabled])

  // const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleTracksEnabled = useCallback((isVideoEnabled: Boolean) => {

      console.log(`isPublished: ${isPublished}`);
      // setIsStopped(!isVideoEnabled); 
      // console.log(`after setisStopped: ${isStopped}`);  
      if (isVideoEnabled) {
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
          }
        })
      }
        
  },[])

  return [toggleTracksEnabled] as const;
}
