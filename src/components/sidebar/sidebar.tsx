import React, { useState } from 'react';
import FileTree from './filetree';
import { DirectoryList } from './directoryList';

// A component to show
export const Sidebar = (props: { 
  fileTreeRoot: FileTree,
  forceUpdateFiletree: () => void,
}) => {
  return (
    <div>
      <DirectoryList depth={0} filetree={props.fileTreeRoot} forceUpdateFiletree={props.forceUpdateFiletree} />
    </div>
  );
};
