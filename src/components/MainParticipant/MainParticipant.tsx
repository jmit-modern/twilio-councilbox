import React, { useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Participant from '../Participant/Participant';

import useHeight from '../../hooks/useHeight/useHeight';

export default function MainParticipant() {
  const mainParticipant = useMainSpeaker();
  const screenShareParticipant = useScreenShareParticipant();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const videoPriority =
    mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant ? 'high' : null;
  const {
    room: { localParticipant },
  } = useVideoContext();
  const videoContainedWidth = ((useHeight() - 64) * 4) / 3 + 'px';

  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    localParticipantTrack: {
      position: 'absolute',
      border: '1px dashed',
      top: 0,
      right: `calc((100% - ${videoContainedWidth})/2)`,
      zIndex: 9,
      width: '220px',
      [theme.breakpoints.down('sm')]: {
        height: theme.sidebarMobileHeight,
        right: 0,
        top: '10px',
        width: '160px',
      },
    },
  })
);

  const classes = useStyles();

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <div className={classes.localParticipantTrack}>
        <Participant
          participant={localParticipant}
          isSelected={selectedParticipant === localParticipant}
          onClick={() => setSelectedParticipant(localParticipant)}
        />
      </div>
      <ParticipantTracks participant={mainParticipant} disableAudio enableScreenShare videoPriority={videoPriority} />
    </MainParticipantInfo>
  );
}
