import React, { useState } from 'react';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Videocam from '@material-ui/icons/Videocam';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface VideocamProps {
  videoEnabled: boolean;
  // onClick: (event: React.MouseEvent<HTMLElement>)=> void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videocamContainer: {
      display: 'inline-block',
      zIndex: 500,
    },
  })
);

export default function VideocamIcon({ videoEnabled }: VideocamProps) {
  const classes = useStyles();
  return (
    <div className={classes.videocamContainer}>
      {videoEnabled ? <Videocam style={{ fill: '#00cc00' }} /> : <VideocamOff />}
    </div>
  );
}
