import React, { useState } from 'react';
import FileTree from './filetree';
import { DirectoryList } from './directoryList';

// A component to show
export const Sidebar = (props: { fileTreeRoot: FileTree }) => {
  return <DirectoryList depth={0} fileTree={props.fileTreeRoot} />;
};
