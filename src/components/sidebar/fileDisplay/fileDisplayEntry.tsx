import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillCloudDownloadFill, BsFillTrashFill } from 'react-icons/bs';
import styles from '~/styles/drawerStyles.module.css';
import { useState } from 'react';
import { url } from 'inspector';

const fileDisplayEntryStyle: any = {
  position: "relative",
  width: "80%",
  fontSize: "16px",
  color: "black",
  margin: "8px",
  borderRadius: "8px",
  padding: "2px",
  display: "flex",
  alignItems: "center",
};

export const FileDisplayEntry = (props: {
  name: string;
  url: string;
  deleteFile: () => void;
  size?: number;
  children: any;

}) => {
  const [isHovered, setIsHovered] = useState(false);

  const innerClickHandler = (e: React.MouseEvent<SVGElement>) => {
    void props.deleteFile();
    void e.stopPropagation();
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={props.name}
      className={styles.fileItem}
      id={props.url}
    >
      {props.children}
      <div className="relative w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base text-base-content">
        &nbsp; {props.name}
      </div>

      {isHovered && (
        <>
          <div className="absolute right-12 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            {props.url.includes('supabase') ? (
              <div className="tooltip" data-tip="Download">
                <a href={props.url}>
                  <BsFillCloudDownloadFill
                    color="hsl(var(--s))"
                    className="w-10 bg-base-100"
                  />
                </a>
              </div>
            ) : (
              <div className="tooltip" data-tip="View">
                <a href={props.url} target="_blank">
                  <BsFillCloudDownloadFill
                    color="hsl(var(--s))"
                    className="w-10 bg-base-100"
                  />
                </a>
              </div>
            )}
          </div>
          <div className="absolute right-4 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            <div className="tooltip" data-tip="Delete">
              <BsFillTrashFill
                onClick={innerClickHandler}
                color="hsl(var(--s))"
                className="w-10 cursor-pointer bg-base-100"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
