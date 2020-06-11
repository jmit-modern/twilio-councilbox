import React, { useState } from 'react';

import TabIcon from '@material-ui/icons/Tab';
import GridOnIcon from '@material-ui/icons/GridOn';
import IconButton from '@material-ui/core/IconButton';

interface Props {
  viewMode: Function;
}

export default function ViewModeButton({viewMode}: Props) {
  const [changeMode, setChangeMode] = useState(true);

  function changeViewMode () {
    setChangeMode(!changeMode)
    viewMode(changeMode);
  }
  return (
    // Change icon Default: Tab Icon Show
    <IconButton aria-label={`full screen`} onClick={changeViewMode}>
      {changeMode ? <TabIcon /> : <GridOnIcon />}
    </IconButton>
  )
}
