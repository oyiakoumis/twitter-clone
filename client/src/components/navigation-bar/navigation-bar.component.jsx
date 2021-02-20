import React from "react";

import { ReactComponent as TwitterIcon } from "../../assets/twitter-icon.svg";
import { ReactComponent as HomeIcon } from "../../assets/home-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { ReactComponent as BellIcon } from "../../assets/bell-icon.svg";
import { ReactComponent as EnvelopeIcon } from "../../assets/envelope-icon.svg";
import { ReactComponent as UserIcon } from "../../assets/user-icon.svg";
import { ReactComponent as SignOutIcon } from "../../assets/sign-out-icon.svg";

import "./navigation-bar.styles.scss";

const NavigationBar = () => {
  return (
    <div className="navigation-bar">
      <button>
        <TwitterIcon />
      </button>
      <button>
        <HomeIcon />
      </button>
      <button>
        <SearchIcon />
      </button>
      <button>
        <BellIcon />
      </button>
      <button>
        <EnvelopeIcon />
      </button>
      <button>
        <UserIcon />
      </button>
      <button>
        <SignOutIcon />
      </button>
    </div>
  );
};

export default NavigationBar;
