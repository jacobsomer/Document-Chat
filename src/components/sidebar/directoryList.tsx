import React, { useState } from 'react';
import FileTree from './filetree';
import { FileEntry } from './fileEntry';

export const DIRECTORY_LEVEL_OFFSET = 20;

export const DirectoryList = (props: {
  depth: number;
  fileTree?: FileTree;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const clickHandler = async (e: any) => {
    setIsCollapsed(!isCollapsed);
  };

  if (props.fileTree) {
    return (
      <div
        style={{ marginLeft: DIRECTORY_LEVEL_OFFSET }}
        onMouseDown={clickHandler}
      >
        {typeof props.fileTree.children == typeof Array<FileTree> ? (
          <div>
            <div>{props.fileTree.name}</div>
            {Object.entries(props.fileTree.children).map(([key, value]) => {
              if (props.fileTree) {
                return (
                  <DirectoryList
                    depth={props.depth + 1}
                    fileTree={props.fileTree.children[key]}
                  />
                );
              }
            })}
          </div>
        ) : (
          <div>
            <FileEntry metadata={props.fileTree.fileMetadata} />
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};
