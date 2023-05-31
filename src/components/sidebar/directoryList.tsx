import React, { useEffect, useState } from 'react';
import FileTree from './filetree';
import { FileEntry } from './fileEntry';
import FileMetadata from './fileMetadata';

export const DIRECTORY_LEVEL_OFFSET = 20;

export const DirectoryList = (props: {
  depth: number;
  filetree?: FileTree;
  forceUpdateFiletree: () => void;
}) => {
  const [counter, setCounter] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const clickHandler = async (e: any) => {
    setIsCollapsed(!isCollapsed);
  };

  if (props.filetree) {
    return (
      <div
        style={{ marginLeft: DIRECTORY_LEVEL_OFFSET }}
        onMouseDown={clickHandler}
      >
        {props.filetree?.name + (isCollapsed ? " (collapsed)" : "")}
        {!isCollapsed ? <>
          {props.filetree?.children.map((filetree: FileTree) => {
          return (
            <DirectoryList
              depth={props.depth + 1}
              filetree={filetree}
              forceUpdateFiletree={props.forceUpdateFiletree}
            />
          );
        })}
        {props.filetree.files.map((fileMetadata: FileMetadata) => {
          return fileMetadata.isDeleted ? <></> : <FileEntry metadata={fileMetadata} forceUpdateFiletree={props.forceUpdateFiletree}/>;
        })}
        </> : <></>} 
      </div>
    );
  } else {
    return <></>;
  }
};
