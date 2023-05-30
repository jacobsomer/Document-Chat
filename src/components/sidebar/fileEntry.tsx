import React from 'react';
import FileMetadata from './fileMetadata';
import FileComponent from '../drawer/fileComponent';
import { FileProgressDisplay } from '../drawer/fileProgressDisplay';

// A component to show
export const FileEntry = (props: { metadata: FileMetadata }) => {
  
  return (
    <div style={{
      minWidth: 200,
    }}>
      <FileComponent
        name={props.metadata.docName + ": " + (props.metadata.loading ? "loading" : "finished")}
        url={props.metadata.url}
        deleteFile={async () => { props.metadata.deleteFile(); }}
        size={props.metadata.size}
      />
    </div>
  );
};
