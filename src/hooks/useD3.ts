import React from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn: Function, dependencies: any[] = []) => {
  const ref = React.useRef<any>();

  React.useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies);

  return ref;
};
