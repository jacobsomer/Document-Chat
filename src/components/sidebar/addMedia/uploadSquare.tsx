/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { FiUpload } from 'react-icons/fi';
import styles from '~/styles/uploadSquare.module.css';

const isMobileDevice = () => {
  return false;
};

interface UploadSquareProps {
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

const UploadSquare: React.FC<UploadSquareProps> = ({ handleFileUpload }) => {
  const renderUploadText = () => {
    const isMobile = isMobileDevice(); // replace with your own logic to detect if the user is on a mobile device
    if (isMobile) {
      return 'Press to upload';
    }
    return 'Click to upload';
  };

  return (
    <div>
      <div className={styles.uploadsquare}>
        <label htmlFor="upload-input" className={styles.uploadlabel}>
          <input
            id="upload-input"
            className={styles.uploadbutton}
            type="file"
            accept=".txt,.pdf,.doc,.docx,.ppt,.pptx,.csv,.doc,.pptx,.md,.py,.js,.html,.css,.java,.c,.cpp,.ts,.tsx,.jsx,.json,.xml,.yaml,.yml,.sql,.php,.rb,.go,.env,.sh,.swift,.kt"
            multiple=""
          />
          <div className={styles.uploadtextcontainer}>
            <div className={styles.uploadtext}>
              <div className={styles.uploadlabelheader}>
                {renderUploadText()}
                <FiUpload className={styles.uploadicon} />
              </div>
              <div className={styles.uploadlabelsubheader}>
                or, drag and drop files here
              </div>
            </div>
          </div>
        </label>
      </div>
      <div style={{padding: 10}}></div>
      <div className={styles.uploadsquare}>
        <label htmlFor="upload-input" className={styles.uploadlabel}>
          <input
            id="upload-input"
            className={styles.uploadbutton}
            type="file"
            accept=".txt,.pdf,.doc,.docx,.ppt,.pptx,.csv,.doc,.pptx,.md,.py,.js,.html,.css,.java,.c,.cpp,.ts,.tsx,.jsx,.json,.xml,.yaml,.yml,.sql,.php,.rb,.go,.env,.sh,.swift,.kt"
            onChange={handleFileUpload}
            webkitdirectory=""
            mozdirectory=""
            directory=""
            multiple=""
          />
          <div className={styles.uploadtextcontainer}>
            <div className={styles.uploadtext}>
              <div className={styles.uploadlabelheader}>
                {renderUploadText()}
                <FiUpload className={styles.uploadicon} />
              </div>
              <div className={styles.uploadlabelsubheader}>
                or, drag and drop a folder here
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
    
  );
};

export default UploadSquare;
