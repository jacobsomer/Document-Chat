import React from 'react';
import FileMetadata from './fileModel';
import FileComponent from './fileComponent';
import { FileProgressDisplay } from '../../../drawer/fileProgressDisplay';

// A component to show
export const FileEntry = (props: { 
  metadata: FileMetadata,
  forceUpdateFiletree: () => void,
}) => {
  
  return (
    <div style={{
      minWidth: 200,
    }}>
      <FileComponent
        name={props.metadata.docName + (props.metadata.loading ? ": loading" : "")}
        url={props.metadata.url}
        deleteFile={() => { 
          props.metadata.deleteFile(); 
          props.forceUpdateFiletree();
        }}
        size={props.metadata.size}
      />
    </div>
  );
};
