import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import threadIcon from '../../../common/images/thread.png'
import { useSelector, useDispatch } from "../../../EaseApp/index";
import ThreadActions from "../../../redux/thread"
import { getTimeDiff } from "../../../utils/index";
import WebIM from "../../../utils/WebIM";
import avatar from "../../../common/icons/avatar1.png";
import i18next from "i18next";
import { emoji } from "../../../common/emoji";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            position: 'relative',
            minWidth: "200px",
            marginTop: "5px",
            width: '100%',
            height: "85px",
            display: "flex",
        },
        container: {
            position: 'absolute',
            bottom: '0',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '8px',
            padding: '0px 10px',
            width: '100%',
            height: "80px",
            display: "flex",
            background: '#fff',
            borderRadius: '5px',
            boxSizing: 'border-box',
        },
        triangle: {
            display: 'block',
            position: 'absolute',
            left: '13px',
            top: '-8px',
            height: '0',
            width: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #fff',
        },
        threadTop: {
            display: 'flex',
            marginTop: '4px',
            height: '20px',
            lineHeight: '20px',
            width: '100%',
        },
        threadIcon: {
            flex: '0 0 20px',
            marginTop: '3px',
            height: '13px',
            background: `url(${threadIcon}) 2px center no-repeat`,
            backgroundSize: 'contain',
        },
        threadName: {
            flex: '1 1 auto',
            fontWeight: '700',
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#000',
            textAlign:'left'
        },
        messageCount: {
            flex: '0 0 36px',
            textAlign: 'right',
            fontWeight: '500',
            color: '#154DFE',
            cursor: 'pointer',
        },
        threadBottom: {
            marginTop: '9px',
            width: '100%',
            height: '35px',
            overflow: 'hidden',
            textAlign: 'left',
        },
        threadInfo: {
            display: 'flex',
            height: '16px',
            lineHeight: '16px',
            width: '100%',
        },
        messageInfo: {
            display:'inline-block',
            lineHeight: '16px',
            marginTop: '3px',
            color: '#4d4d4d',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
        },
        threadAva: {
            flex: '0 0 16px',
            textAlign: 'center',
            lineHeight: '16px',
        },
        threadAvaIcon: {
            display: 'inline-block',
            marginTop: '2px',
            height: '14px',
            width: '14px',
            borderRadius: '50%',
        },
        threadMsg: {
            marginLeft: '4px',
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#000',
            width: 'calc(100% - 70px)',
        },
        time: {
            color: '#999',
            fontSize: '12px',
            flex: '0 0 50px',
            textAlign: 'right',
        },
        threadOwner: {
            color: '#000',
        },
        lastMessage: {
            color: '#666',
        },
        defaultMessage: {
            fontSize: '12px',
            lineHeight: '16px',
            marginTop: '8px',
            color: '#4d4d4d',
        }
    };
});

const MsgThreadInfo = (props) => {
    const { thread_overview } = props.message;
    const dispatch = useDispatch();
    const classes = useStyles();
    const renderMessage = (payload) => {
        if (payload?.bodies && payload.bodies.length > 0) {
            let message = payload.bodies[0]
            switch (message.type) {
                case 'txt':
                    return renderTxt(message.msg)
                case 'file':
                    return `[${i18next.t('File Message')}]`
                case 'img':
                    return `[${i18next.t('Image Message')}]`
                case 'audio':
                    return `[${i18next.t('Audio Message')}]`
                case 'video':
                    return `[${i18next.t('Video Message')}]`
                default:
                    return ''
            }
        }
        return ''
    }
    const renderTxt = (txt) => {
        if (txt === undefined) {
            return [];
        }
        let rnTxt = [];
        let match = null;
        const regex = /(\[.*?\])/g;
        let start = 0;
        let index = 0;
        while ((match = regex.exec(txt))) {
            index = match.index;
            if (index > start) {
                rnTxt.push(txt.substring(start, index));
            }
            if (match[1] in emoji.map) {
                const v = emoji.map[match[1]];
                rnTxt.push(
                    <img
                        key={v + Math.floor(Math.random()*99 + 1)}
                        alt={v}
                        src={require(`../../../common/faces/${v}`).default}
                        width={20}
                        height={20}
                    />
                );
            } else {
                rnTxt.push(match[1]);
            }
            start = index + match[1].length;
        }
        rnTxt.push(txt.substring(start, txt.length));

        return rnTxt;
    };
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    const changeMessage = () => {
        //Whether you are in the thread. If not, call the interface added by SDK
        let hasJoined = threadList.find((item) => {
            return item.id === props.message.thread_overview.id
        })
        if (!hasJoined) {
            WebIM.conn.joinThread({ threadId: props.message.thread_overview.id }).then((res) => {
                // if(res.data.status !== 'ok') return //服务端字段缺失
                changeThreadStatus()
            })
            return
        }
        changeThreadStatus()
    }
    //changes thread status after joing the thread
    const changeThreadStatus = ()=>{
        //change the status of creatingThread
        dispatch(ThreadActions.setIsCreatingThread(false));
        //updtate currentThreadInfo
        dispatch(ThreadActions.setCurrentThreadInfo(props.message));
        //open threadPanel
        dispatch(ThreadActions.updateThreadStates(true));
    }
    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <span className={classes.triangle}></span>
                <div className={classes.threadTop}>
                    <div className={classes.threadIcon}></div>
                    <div className={classes.threadName}>{thread_overview.name}</div>
                    <span className={classes.messageCount} onClick={changeMessage}>{thread_overview.message_count}&nbsp;&gt;</span>
                </div>
                {thread_overview.last_message && JSON.stringify(thread_overview.last_message) !== '{}' && <div className={classes.threadBottom}>
                    <div className={classes.threadInfo}>
                        <div className={classes.threadAva}>
                            <img className={classes.threadAvaIcon} src={avatar} ></img>
                        </div>
                        <span className={classes.threadMsg}>{thread_overview.last_message.from || ''}</span>
                        <span className={classes.time}>{getTimeDiff(thread_overview.last_message.timestamp)}</span>
                    </div>
                    <span className={ classes.messageInfo}>{renderMessage(thread_overview.last_message.payload)}</span>
                </div>
                }
                {
                    (!thread_overview.last_message || JSON.stringify(thread_overview.last_message) === '{}') && <div className={classes.defaultMessage}>No Messages</div>
                }

            </div>
        </Box>
    );
}
export default MsgThreadInfo