import { Callback } from '../../../types';
import EventEmitter from 'events';
import { isMobile } from '../../../utils';
import Video, { ConnectOptions, LocalTrack, Room, Track } from 'twilio-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import useIsSubscriber from '../../../hooks/useIsSubscriber/useIsSubscriber';

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks: LocalTrack[], onError: Callback, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
  const [isConnecting, setIsConnecting] = useState(false);
  const localTracksRef = useRef<LocalTrack[]>([]);

  const isSubscriber = useIsSubscriber();

  useEffect(() => {
    // It can take a moment for Video.connect to connect to a room. During this time, the user may have enabled or disabled their
    // local audio or video tracks. If this happens, we store the localTracks in this ref, so that they are correctly published
    // once the user is connected to the room.
    localTracksRef.current = localTracks;
  }, [localTracks]);

  const connect = useCallback(
    token => {
      setIsConnecting(true);
      return Video.connect(token, { ...options, tracks: [] }).then(
        newRoom => {
          setRoom(newRoom);
          const disconnect = () => newRoom.disconnect();

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(new EventEmitter() as Room));
            window.removeEventListener('beforeunload', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          localTracksRef.current.forEach(track => {
            // console.log(track)
            // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
            // However, tracks must be published manually in order to set the priority on them.
            // All video tracks are published with 'low' priority. This works because the video
            // track that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()

            if(isSubscriber){

              if(track.kind != 'data'){
                const localTrackPublication = newRoom.localParticipant.unpublishTrack(track);
                newRoom.localParticipant.emit('trackUnpublished', localTrackPublication);
                track.stop();
              }

            } else {
              newRoom.localParticipant.publishTrack(track, { priority: track.kind === 'video' ? 'low' : 'standard' });
            }

          });

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }
        },
        error => {
          onError(error);
          setIsConnecting(false);
        }
      );
    },
    [options, onError]
  );

  return { room, isConnecting, connect };
}
