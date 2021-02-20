import React from "react";

import { ReactComponent as CommentIcon } from "../../assets/comment-icon.svg";
import { ReactComponent as RetweetIcon } from "../../assets/retweet-icon.svg";
import { ReactComponent as LikeIcon } from "../../assets/like-icon.svg";

import "./tweet-item.styles.scss";

const TweetItem = ({
  userImage,
  name,
  username,
  createdAt,
  content,
  commentNumber,
  retweetNumber,
  likeNumber,
}) => {
  return (
    <div className="tweet-item">
      <div className="user-image">
        <img
          src={userImage}
          alt="user"
        />
      </div>
      <div className="tweet-header">
        <span className="name">{name}</span>
        <span className="username">@{username}</span>
        <span className="dot-separator">&middot;</span>
        <span className="created-at">{createdAt}</span>
      </div>
      <div className="tweet-content">{content}</div>
      <div className="tweet-footer">
        <button className="comment-button">
          <div className="icon">
            <CommentIcon />
          </div>
          <span>{commentNumber}</span>
        </button>
        <button className="retweet-button">
          <div className="icon">
            <RetweetIcon className="retweet-icon" />
          </div>
          <span>{retweetNumber}</span>
        </button>
        <button className="like-button">
          <div className="icon">
            <LikeIcon />
          </div>
          <span>{likeNumber}</span>
        </button>
      </div>
    </div>
  );
};

export default TweetItem;
