import React, { useState } from 'react';
import FileTree from './fileTree/fileTreeModel';
import { FileTreeComponent } from './fileTree/fileTreeComponent';

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
