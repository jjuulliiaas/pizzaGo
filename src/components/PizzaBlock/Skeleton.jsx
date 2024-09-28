import React from "react";
import ContentLoader from "react-content-loader";

const Skeleton = (props) => (
  <ContentLoader
    className="pizza-block"
    speed={0}
    width={280}
    height={500}
    viewBox="0 0 280 500"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="-3" y="268" rx="10" ry="10" width="280" height="23" />
    <rect x="1" y="313" rx="10" ry="10" width="280" height="88" />
    <rect x="126" y="418" rx="25" ry="25" width="152" height="45" />
    <circle cx="132" cy="131" r="110" />
    <rect x="2" y="427" rx="10" ry="10" width="88" height="33" />
  </ContentLoader>
);

export default Skeleton;
