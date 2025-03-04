import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp } from "../../src/index";
// import WebIM from "./WebIM";
import val from "./comm";
// import initListen from "./WebIMListen";
export default class Demo extends Component {
  state = {
    token: val,
  };

  postData = (url, data) => {
    return fetch(url, {
      body: JSON.stringify(data),
      cache: "no-cache",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
    }).then((response) => response.json());
  };
    addSessionItem = () => {
    let session = {
      conversationType: "singleChat",
      conversationId: "zd132",
    };
    EaseApp.addConversationItem(session);

  };
  test = (res) =>{
    console.log('test登录成功',res);
  }
  test2 = (err) =>{
    console.log('登录失败',err)
  }
  test3 = (res) =>{
    console.log('res>>',res);
  }
  test4 = (val) =>{
    console.log('val',val);
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
          <button onClick={this.addSessionItem}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
          <EaseApp
            successLoginCallback={this.test}
            failCallback={this.test2}
            onAvatarChange={this.test3}
            onChatAvatarClick={this.test4}
            
            appkey= "41117440#383391"
            username="test003"
            agoraToken="007eJxTYDiw2fuKzNWjLzknllxuMkl+z+OTa5dxRZPB6fP1VGlGX1sFhjTDlGRzc4uklJRkMxOzxBSLNCMzA0tzs+REoxQDQ9NkPSnjJAUZBgbT1MfvGBlYGRiBEMRXYTBPsTAyMzc10LVMSjTVNTRMTda1NDdP1U0xT7Y0M0oztjC1NAMA7zUk8Q=="
            header={<div style={{ height: "100px" }}>TestHeader</div>} />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
