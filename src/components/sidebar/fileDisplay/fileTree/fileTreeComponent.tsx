import React, { useEffect, useState } from 'react';
import FileTree from './fileTreeModel';
import { FileEntry } from '../file/fileComponentWrapper';
import FileMetadata from '../file/fileModel';

export const DIRECTORY_LEVEL_OFFSET = 20;

export const FileTreeComponent = (props: {
  depth: number;
  filetree?: FileTree;
  forceUpdateFiletree: () => void;
}) => {
  const [counter, setCounter] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(props.depth != 0);
  const clickHandler = async (e: Event) => {
    setIsCollapsed(!isCollapsed);
    e.stopPropagation();
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
            <FileTreeComponent
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
