import { AiFillFileAdd } from 'react-icons/ai';
import { BsFillCloudDownloadFill, BsFillTrashFill } from 'react-icons/bs';
import styles from '~/styles/drawerStyles.module.css';
import { useState } from 'react';
import { url } from 'inspector';

export const FileDisplayEntry = (props: {
  name: string;
  url?: string;
  deleteFile: () => void;
  size?: number;
  children: any;
  border?: boolean;
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
      style={{
        position: "relative",
        width: "100%",
        fontSize: "16px",
        ...props.border ? {border: "1px solid hsl(var(--pc))"} : {backgroundColor: "white"},
        margin: "1px",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        color: props.border ? "hsl(var(--bc))" : "hsl(var(--pc))",
      }}
      id={props.url}
    >
      {props.children}
      <div className="relative w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-base text-base-content" style={{
                color: props.border ? "hsl(var(--pc))" : "hsl(var(--s))",
      }}>
        &nbsp; {props.name}
      </div>

      {isHovered && (
        <>
          <div className="absolute right-12 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            {props.url && (props.url.includes('supabase') ? (
              <div className="tooltip" data-tip="Download">
                <a href={props.url}>
                  <BsFillCloudDownloadFill
                    color={props.border ? "hsl(var(--pc))" : "hsl(var(--s))"}
                    className={"w-10" + (!props.border && " bg-base-100")}
                  />
                </a>
              </div>
            ) : (
              <div className="tooltip" data-tip="View">
                <a href={props.url} target="_blank">
                  <BsFillCloudDownloadFill
                    color="hsl(var(--s))"
                    className={"w-10" + (!props.border && " bg-base-100")}
                  />
                </a>
              </div>
            ))}
          </div>
          <div className="absolute right-4 top-1/2 z-50 flex -translate-y-1/2 transform items-center justify-center">
            <div className="tooltip" data-tip="Delete">
              <BsFillTrashFill
                onClick={innerClickHandler}
                color="hsl(var(--s))"
                className={"w-10 cursor-pointer" + (!props.border && " bg-base-100")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
