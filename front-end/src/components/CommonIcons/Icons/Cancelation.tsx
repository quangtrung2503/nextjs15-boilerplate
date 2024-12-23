import * as React from "react";
import { SVGProps } from "react";
const Cancelation = (props: SVGProps<SVGSVGElement>) => {
  const { color = "white" } = props;
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.75737 2.75731C3.31452 2.20015 3.97596 1.75819 4.70392 1.45666C5.43188 1.15513 6.2121 0.999939 7.00004 0.999939C7.78797 0.999939 8.56819 1.15513 9.29615 1.45666C10.0241 1.75819 10.6855 2.20015 11.2427 2.75731C11.7999 3.31446 12.2418 3.9759 12.5433 4.70386C12.8449 5.43182 13.0001 6.21204 13.0001 6.99998C13.0001 7.78791 12.8449 8.56813 12.5433 9.29609C12.2418 10.024 11.7999 10.6855 11.2427 11.2426C10.1175 12.3679 8.59135 13 7.00004 13C5.40873 13 3.8826 12.3679 2.75737 11.2426C1.63214 10.1174 1 8.59128 1 6.99998C1 5.40867 1.63214 3.88253 2.75737 2.75731V2.75731Z" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
<path d="M3 3L11 11" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
</svg>



  );
};
export default Cancelation;
