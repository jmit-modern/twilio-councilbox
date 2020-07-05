import React from 'react';
import { Theme, createStyles, makeStyles, styled } from '@material-ui/core/styles';
import Participant from '../Participant/Participant';
import Participantid from '../ParticipantId/ParticipantId';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import classes from '*.module.css';
import useHeight from '../../hooks/useHeight/useHeight';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    gridList: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      columnGap: '10px',
      rowGap: '10px',
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr 1fr',
      },
    },
    gridListItem: {},
    idStrip: {
      display: 'flex',
      padding: '10px',
      border: '1px solid',
    },
    roomParticpantNumber: {
      textAlign: 'center',
      border: '1px solid',
      padding: '10px',
      borderTop: 'none',
    },
  })
);

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  maxWidth: '1440px',
  margin: 'auto !important',
  [theme.breakpoints.down('xs')]: {},
}));

export default function GridView() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const classes = useStyles();

  const height = useHeight() / 2 - 30 + 'px';

  return (
    <Container>
      <div className={classes.gridList}>
        <div key={localParticipant.sid} className={classes.gridListItem}>
          <Participant
            participant={localParticipant}
            isSelected={selectedParticipant === localParticipant}
            onClick={() => setSelectedParticipant(localParticipant)}
          />
        </div>
        {participants.slice(0, 5).map(participant => (
          <div key={participant.sid} className={classes.gridListItem}>
            <Participant
              participant={participant}
              isSelected={selectedParticipant === participant}
              onClick={() => setSelectedParticipant(participant)}
            />
          </div>
        ))}
      </div>
      <div className={classes.idStrip}>
        <Participantid
          participant={localParticipant}
          onClick={() => setSelectedParticipant(localParticipant)}
          isSelected={selectedParticipant === localParticipant}
        />
        {participants.slice(0, 5).map(participant => (
          <Participantid
            key={participant.sid}
            participant={participant}
            onClick={() => setSelectedParticipant(participant)}
            isSelected={selectedParticipant === participant}
          />
        ))}
      </div>

      <div className={classes.roomParticpantNumber}>{participants.length + 1} participants in the room</div>
    </Container>
  );
}
