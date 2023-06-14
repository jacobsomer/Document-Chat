import React, { useEffect, useState } from 'react';
import FileTree from './fileTreeModel';
import { FileComponent } from '../file/fileComponent';
import FileMetadata from '../file/fileModel';
import { fileDisplayStyle } from '../fileDisplay';
import { FileDisplayEntry } from '../fileDisplayEntry';

import { AiFillFolderAdd } from 'react-icons/ai';
import styles from '~/styles/drawerStyles.module.css';

export const FileTreeComponent = (props: {
  depth: number;
  filetree?: FileTree;
  forceUpdateFiletree: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(props.depth != 0);
  const clickHandler = async (e: Event) => {
    setIsCollapsed(!isCollapsed);
    e.stopPropagation();
  };

  if (props.filetree) {
    return (
      <div style={fileDisplayStyle}>
        {props.depth != 0 ? (
          <div onMouseDown={clickHandler}>
            <FileDisplayEntry
              name={props.filetree.name}
              url={''}
              deleteFile={() => {
                //props.filetree?.delete();
                props.forceUpdateFiletree();
              }}
              size={props.filetree.getSize()}
            >
              {isCollapsed ? (
                <AiFillFolderAdd
                  color="hsl(var(--s))"
                  className={styles.fileIcon}
                />
              ) : (
                <AiFillFolderAdd
                  color="hsl(var(--s))"
                  className={styles.fileIcon}
                />
              )}
            </FileDisplayEntry>
          </div>
        ) : (
          <></>
        )}
        {!isCollapsed ? (
          <>
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
              return fileMetadata.isDeleted ? (
                <></>
              ) : (
                <FileComponent
                  metadata={fileMetadata}
                  forceUpdateFiletree={props.forceUpdateFiletree}
                />
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};
