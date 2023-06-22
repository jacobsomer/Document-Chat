import React, { useState } from 'react';
import FileTree from './fileTree/fileTreeModel';
import { FileTreeComponent } from './fileTree/fileTreeComponent';

const DIRECTORY_LEVEL_OFFSET = 24;

export const fileDisplayStyle = {
  marginLeft: DIRECTORY_LEVEL_OFFSET,
  fontSize: 24
};

// A component to show
export const FileDisplay = (props: {
  fileTreeRoot: FileTree;
  forceUpdateFiletree: () => void;
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'scroll',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        scrollbarGutter: 'none',
        color: 'hsl(var(--bc))',
        fontSize: 'large'
      }}
    >
      <div className="divider">My Files</div>
      {props.fileTreeRoot.fileMap.size === 0 &&
      props.fileTreeRoot.childrenMap.size === 0 ? (
        <>
          <div className="text-sm text-base-content" style={{textAlign: 'center'}}>No files yet!</div>
        </>
      ) : (
        <div style={{ marginRight: DIRECTORY_LEVEL_OFFSET }}>
          <FileTreeComponent
            depth={0}
            filetree={props.fileTreeRoot}
            forceUpdateFiletree={props.forceUpdateFiletree}
          />
        </div>
      )}
    </div>
  );
};
