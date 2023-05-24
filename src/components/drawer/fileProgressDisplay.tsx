import React from "react";


// A component to show 
export const FileProgressDisplay = (props: {
    loading: boolean,
}) => {

    return ( // placeholder for more complex graphics
        <div> 
            {props.loading ? (<div>
                {"loading"} 
            </div>
            ) : (<div>
                {"finished"} 
            </div>)}
        </div>
    );
};