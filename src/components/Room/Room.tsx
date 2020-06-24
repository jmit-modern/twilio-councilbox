import React from 'react';
import { useEffect } from 'react';
import ContainerView from './ContainerView';
import GridView from './GridView';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { LocalVideoTrack } from 'twilio-video';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';

interface ViewModeProps {
  viewMode: boolean;
}

export default function Room({ viewMode }: ViewModeProps) {
  if (viewMode == true) {
    return <ContainerView />;
  }
  return <GridView />;
}
