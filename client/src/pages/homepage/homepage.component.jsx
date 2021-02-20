import React from "react";
import TweetItem from "../../components/tweet-item/tweet-item.component";

import userImage from "../../assets/avatar.png";

import "./homepage.styles.scss";
import PostForm from "../../components/post-form/post-form.component";

const tweet = {
  name: "Barack Obama",
  username: "BarackObama",
  userImage: userImage,
  createdAt: "19h",
  content: `Lorem ipsum dolor sit amet consectetur, adipisicing
  elit. Alias deserunt autem nobis officia perferendis
  accusamus incidunt, a voluptates quae similique,
  reiciendis sit cum error voluptate.`,
  commentNumber: 693,
  retweetNumber: "4.8k",
  likeNumber: "59.6k",
};

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="homepage-header">
        <h2>Home</h2>
      </div>
      <PostForm userImage={userImage} />
      <div className="separator"></div>
      <div className="posts-timeline">
        <TweetItem {...tweet} />
        <TweetItem {...tweet} />
        <TweetItem {...tweet} />
        <TweetItem {...tweet} />
        <TweetItem {...tweet} />
        <TweetItem {...tweet} />
      </div>
    </div>
  );
};

export default HomePage;
