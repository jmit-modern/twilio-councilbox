import React from 'react';
import ContainerView from './ContainerView';
import GridView from './GridView';


interface ViewModeProps {
  viewMode: boolean;
}

export default function Room({viewMode}: ViewModeProps) {
  if(viewMode == true) {
    return (
      <ContainerView />
    );
  }
  return ( <GridView /> )
}
