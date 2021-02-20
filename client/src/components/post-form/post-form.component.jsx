import React from "react";

import "./post-form.styles.scss";

class PostForm extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="post-form">
        <div className="user-image">
          <img src={this.props.userImage} alt="user" />
        </div>
        <form onSubmit={this.handleSubmit}>
          <textarea
            name=""
            id=""
            placeholder="What's happening?"
          ></textarea>
          <div className="button-div">
            <button>Tweet</button>
          </div>
        </form>
      </div>
    );
  }
}

export default PostForm;
