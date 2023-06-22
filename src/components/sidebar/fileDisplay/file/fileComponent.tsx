import React from 'react';
import FileModel from './fileModel';
import { FileDisplay, fileDisplayStyle } from '../fileDisplay';
import { AiFillFileAdd, AiOutlineLink } from 'react-icons/ai';
import { MdDownloading } from 'react-icons/md';
import styles from '~/styles/drawerStyles.module.css';
import { FileDisplayEntry } from '../fileDisplayEntry';
import LoadingSpinner from '../loadingSpinner';

// A component to show
export const FileComponent = (props: { 
  metadata: FileModel,
  forceUpdateFiletree: () => void,
}) => {
  const clickHandler = async (e: Event) => {
    // e.stopPropagation();
  };

  return (
    <div style={fileDisplayStyle} onMouseDown={clickHandler}>
      <FileDisplayEntry
        name={props.metadata.docName}
        url={props.metadata.url}
        deleteFile={() => { 
          props.metadata.deleteFile(); 
          props.forceUpdateFiletree();
        }}
        size={props.metadata.size}>
          {props.metadata.loading ? (
                  <LoadingSpinner colorHex={'hsl(var(--s))'} size={16} />
          ) : (
            props.metadata.sourceFile ? 
            <AiFillFileAdd color="hsl(var(--s))" className={styles.fileIcon} /> :
            <AiOutlineLink color="hsl(var(--s))" className={styles.fileIcon} />
          )}
        </FileDisplayEntry>
    </div>
  );
};
