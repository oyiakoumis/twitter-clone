import React from "react";

import "./navigation-item.styles.scss";

const NavigationItem = ({ href, children }) => {
  return (
    <div className="navigation-item">
      <button href={href}>{children}</button>
    </div>
  );
};

export default NavigationItem;
