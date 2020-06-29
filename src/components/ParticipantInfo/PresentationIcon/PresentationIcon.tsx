import React, { useState } from 'react';

import PresentToAll from '@material-ui/icons/PresentToAll';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useIsModerator from '../../../hooks/useIsModerator/useIsModerator';


interface PresentationProps {
  isPresented: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>)=> void;
}

const useStyles = makeStyles(() =>
  createStyles({
    presentationIconContainer: {
      display: 'inline-block',
      zIndex: 500,
    },
  })
);

export default function PresentationIcon({ isPresented, onClick }: PresentationProps) {

  const isModerator = useIsModerator();

  const classes = useStyles();
  return isModerator ? 
  (
    <div className={classes.presentationIconContainer} onClick={onClick}>
      {isPresented ? <CancelPresentationIcon /> : <PresentToAll />}
    </div>
  ) : (null) ;
}
