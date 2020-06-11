import React from 'react';
import { Theme, createStyles, makeStyles, styled } from '@material-ui/core/styles';
import Participant from '../Participant/Participant';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import classes from '*.module.css';
import useHeight from '../../hooks/useHeight/useHeight';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {

    },
    gridList: {
      // height: '100%'
    },
  })
)

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  [theme.breakpoints.down('xs')]: {
    
  },
}));

export default function GridView() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const classes = useStyles();

  const height = (useHeight()/2-30) + 'px';

  return (
    <Container>
      <GridList cols={3} className={classes.gridList}>
        <GridListTile key={localParticipant.sid} cols={1} style={{height}}>
          <Participant
            participant={localParticipant}
            isSelected={selectedParticipant === localParticipant}
            onClick={() => setSelectedParticipant(localParticipant)}
          />
        </GridListTile>
        {participants.map((participant) => (
          <GridListTile key={participant.sid} cols={1} style={{height}}>
            <Participant
              key={participant.sid}
              participant={participant}
              isSelected={selectedParticipant === participant}
              onClick={() => setSelectedParticipant(participant)}
            />
          </GridListTile>
        ))}
      </GridList>
    </Container>
  );
}
