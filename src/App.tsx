import React, { useState, useEffect } from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import { useAppState } from './state';

// const socket = socketIOClient.connect("http://localhost:8080");

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')(({ theme }) => ({
  overflow: 'hidden',
  [theme.breakpoints.down('xs')]: {
    padding: '5px'
  }
}));

export default function App() {
  const [viewMode, setViewMode] = useState(false);
  const roomState = useRoomState();

  /**
   * Change View Mode of Video
   * @param arg true: container view, false: grid view
   */
  function changeViewMode(arg: Boolean) {
    if (arg == false) {
      setViewMode(false);
    } else {
      setViewMode(true);
    }
  }
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight() + 'px';

  return (
    <Container style={{ height }}>
      <MenuBar onViewModeChange={changeViewMode} />
      <Main>
        {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room viewMode={viewMode} />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
