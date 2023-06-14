import React from 'react';
import FileMetadata from './fileModel';
import FileComponent from './fileComponent';
import { FileDisplay, fileDisplayStyle } from '../fileDisplay';
import { AiFillFileAdd } from 'react-icons/ai';
import styles from '~/styles/drawerStyles.module.css';
import { FileDisplayEntry } from '../fileDisplayEntry';

// A component to show
export const FileEntry = (props: { 
  metadata: FileMetadata,
  forceUpdateFiletree: () => void,
}) => {
  const clickHandler = async (e: Event) => {
    e.stopPropagation();
  };

  return (
    <div style={fileDisplayStyle} onMouseDown={clickHandler}>
      <FileDisplayEntry
        name={props.metadata.docName + (props.metadata.loading ? ": loading" : "")}
        url={props.metadata.url}
        deleteFile={() => { 
          props.metadata.deleteFile(); 
          props.forceUpdateFiletree();
        }}
        size={props.metadata.size}>
          <AiFillFileAdd color="hsl(var(--s))" className={styles.fileIcon} />
        </FileDisplayEntry>
    </div>
  );
};
