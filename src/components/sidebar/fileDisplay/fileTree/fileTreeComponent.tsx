import React, { useEffect, useState } from 'react';
import FileTree from './fileTreeModel';
import { FileComponent } from '../file/fileComponent';
import FileModel from '../file/fileModel';
import { fileDisplayStyle } from '../fileDisplay';
import { FileDisplayEntry } from '../fileDisplayEntry';
import { MdDownloading } from 'react-icons/md';

import { AiFillFolderAdd, AiFillFolderOpen } from 'react-icons/ai';
import styles from '~/styles/drawerStyles.module.css';
import LoadingSpinner from '../loadingSpinner';

const collapseRate = 0.999;
export const FileTreeComponent = (props: {
  depth: number;
  filetree?: FileTree;
  forceUpdateFiletree: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(props.depth != 0);
  const [collapseSize, setCollapseSize] = useState(props.depth != 0 ? 0 : 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCollapseSize(
        isCollapsed
          ? collapseSize * collapseRate
          : (100 - collapseSize) * (1 / collapseRate - 1)
      );
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [collapseSize]);

  const clickHandler = async (e: Event) => {
    setIsCollapsed(!isCollapsed);
    e.stopPropagation();
  };

  var isLoading = props.filetree?.isLoading();
  if (props.filetree && !props.filetree.isDeleted) {
    return (
      <div
        style={{
          marginLeft: props.depth != 0 ? 24 : 0,

        }}
      >
        {props.depth != 0 ? (
          <div onMouseDown={clickHandler}>
            <FileDisplayEntry
              name={props.filetree.name}
              deleteFile={() => {
                props.filetree?.deleteSelf();
                props.forceUpdateFiletree();
              }}
              size={props.filetree.getSize()}
              border={!isCollapsed}
            >
              {isLoading ? (
                <>
                  {/* <MdDownloading
                    color="hsl(var(--s))"
                    className={styles.fileIcon}
                  /> */}
                  <LoadingSpinner colorHex={isCollapsed ? 'hsl(var(--s))': "hsl(var(--pc))"} size={16} />
                </>
              ) : isCollapsed ? (
                <AiFillFolderAdd
                  color="hsl(var(--b3))"
                  className={styles.fileIcon}
                />
              ) : (
                <AiFillFolderOpen
                  color="hsl(var(--pc))"
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
            {props.filetree?.getDirectories().map((filetree: FileTree) => {
              return (
                <FileTreeComponent
                  depth={props.depth + 1}
                  filetree={filetree}
                  forceUpdateFiletree={props.forceUpdateFiletree}
                />
              );
            })}
            {props.filetree.getFiles().map((fileMetadata: FileModel) => {
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
