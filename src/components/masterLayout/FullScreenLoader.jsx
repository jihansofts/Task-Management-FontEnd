import React, { Fragment } from "react";
import { useSelector } from "react-redux";
const FullScreenLoader = () => {
  const loader = useSelector((state) => state.settings.loader);
  return (
    <Fragment>
      <div className={"LoadingOverlay " + loader}>
        <div className="Line-Progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    </Fragment>
  );
};

export default FullScreenLoader;
