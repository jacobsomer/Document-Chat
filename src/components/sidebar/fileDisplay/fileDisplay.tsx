import React, { useState } from 'react';
import FileTree from './fileTree/fileTreeModel';
import { FileTreeComponent } from './fileTree/fileTreeComponent';

const DIRECTORY_LEVEL_OFFSET = 24;

export const fileDisplayStyle = {
  marginLeft: DIRECTORY_LEVEL_OFFSET,
  fontSize: 24,
}

// A component to show
export const FileDisplay = (props: { 
  fileTreeRoot: FileTree,
  forceUpdateFiletree: () => void,
}) => {
  return (
    <div>
      <FileTreeComponent depth={0} filetree={props.fileTreeRoot} forceUpdateFiletree={props.forceUpdateFiletree} />
    </div>
  );
};
