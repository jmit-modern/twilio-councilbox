import React from 'react';
import clsx from 'clsx';
import { Theme, createStyles, makeStyles, styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import { Participant as IParticipant } from 'twilio-video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    idStripItem: {
      display: 'flex',
      padding: '8px',
      textTransform: 'uppercase',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      borderRadius: '50%',
      minWidth: '42px',
      marginRight: '10px',
      height: '42px',
      cursor: 'pointer',
    },
    selected: {
      borderWidth: '2px',
    },
  })
);

interface ParticipantIdProps {
  participant: IParticipant;
  onClick: () => void;
  isSelected: boolean;
}

export default function ParticipantId({ participant, onClick, isSelected }: ParticipantIdProps) {
  const classes = useStyles();
  return (
    <div
      className={clsx({
        [classes.idStripItem]: true,
        [classes.selected]: isSelected,
      })}
      onClick={onClick}
    >
      {participant.identity
        .split(' ')
        .map((n, i, a) => (i === 0 || i + 1 === a.length ? n[0] : null))
        .join('')}
    </div>
  );
}
