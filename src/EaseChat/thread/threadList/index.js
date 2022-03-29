import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "../../../EaseApp/index";
import { Box } from "@material-ui/core";
import ThreadActions from "../../../redux/thread";
import { getTimeDiff } from "../../../utils/index";
import threadSearch from '../../../common/images/search.png'
import close from '../../../common/images/threadClose.png'
import "./index.css"
import SearchBox from '../components/searchBox'
import avatar from "../../../common/icons/avatar1.png";
import "../../../i18n";
import i18next from "i18next";
import { emoji } from "../../../common/emoji";
import MessageActions from "../../../redux/message"
import _ from "lodash";
import AppDB from "../../../utils/AppDB";

const ThreadListPanel = () => {
    const dispatch = useDispatch();
    const threadList = useSelector((state) => state.thread?.threadList) || [];
    let [displayThreadList, changeDisplayThreadList] = useState([]);
    useEffect(() => {
        changeDisplayThreadList(threadList.concat());
    }, [threadList])
    const showThreadList = useSelector((state) => state.thread?.showThreadList) || false;
    const { chatType, to } = useSelector((state) => state.global.globalProps);
    const closeThreadList = () => {
        dispatch(ThreadActions.setShowThreadList(false));
    }
    useEffect(() => {
        if (chatType === "groupChat") {
            let options = {
                groupId: to,
                limit: 20,
            }
            dispatch(ThreadActions.getThreadsListOfGroup(options))
        }
    }, [to])
    const [showSearchBar, setSearchBarState] = useState(false);

    const changeSearchBarState = (state) => {
        setSearchBarState(state);
    }
    const searchThread = (searchValue) => {
        let list = threadList.concat();
        list = list.filter((item) => {
            return item.name.indexOf(searchValue) > -1
        })
        changeDisplayThreadList(list.concat());
    }
    //The list is empty
    const renderDefaultList = () => {
        if (threadList.length === 0) return (
            <Box className='tlp-default-tips'>
                <div className='tlp-tips1'>{i18next.t('There are no Threads')}</div>
                <div className='tlp-tips2'>{i18next.t('Create a Thread from a Group Chat Message')}</div>
            </Box>
        )
        if (displayThreadList.length === 0) {
            return (<Box className='tlp-default-tips'>{i18next.t('No Result')}</Box>)
        }
    }
    const renderMessage = (body) => {
        if (!body) return ''
        switch (body.type) {
            case 'txt':
                return renderTxt(body.msg)
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
    const threadListDom = useRef(null);
    const [isPullingDown, setIsPullingDown] = useState(false);
    const handleScroll = (e) => {
        if (e.target.scrollHeight === (e.target.scrollTop + e.target.clientHeight)) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    setIsPullingDown(false);
                    if (chatType === "groupChat") {
                        let options = {
                            groupId: to,
                            limit: 20,
                            isScroll: true
                        }
                        dispatch(ThreadActions.getThreadsListOfGroup(options))
                    }
                }, 500);
            }
        }
    };
    const changeMessage = (option) => {
        WebIM.conn.joinThread({ threadId: option.id }).then((res) => {
            //change the status of creatingThread
            dispatch(ThreadActions.setIsCreatingThread(false));
            //Find the muc message of the thread  you are clicking by the thread id
            AppDB.findAppointedMessage('groupChat', option.id).then((res) => {
                if (res.length === 1) {
                    dispatch(ThreadActions.setCurrentThreadInfo(res[0]));
                } else {
                    const msg = {
                        thread: option
                    }
                    dispatch(ThreadActions.setCurrentThreadInfo(msg));
                }
            })
            //open threadPanel
            dispatch(ThreadActions.updateThreadStates(true));
            //close threadListPanel
            dispatch(ThreadActions.setShowThreadList(false));
        })
    }

    return (
        <Box className='threadListPanel' style={{ display: showThreadList == 1 ? 'block' : 'none' }}>
            <div className='tlp-header'>
                <span className='tlp-header-title'>{i18next.t('Threads List')}</span>
                <Box style={{ lineHeight: '60px', display: showSearchBar == 1 ? 'none' : 'flex' }}>
                    <div className="tlp-header-icon">
                        <img className="tlp-header-icon-search" alt="" src={threadSearch} onClick={(e) => changeSearchBarState(true)} />
                    </div>
                    <div className="tlp-header-icon" onClick={closeThreadList}>
                        <img className="tlp-header-icon-close" alt="" src={close} />
                    </div>
                </Box>
                <Box style={{ marginTop: '12px', display: showSearchBar == 1 ? 'flex' : 'none' }}>
                    <SearchBox changeSearchBarState={changeSearchBarState} searchThread={searchThread} />
                </Box>
            </div>
            <ul className='tlp-list' ref={threadListDom} onScroll={handleScroll}>
                {renderDefaultList()}
                {displayThreadList.length > 0 && displayThreadList.map((option, index) => {
                    return (
                        <li className='tlp-item' key={index} onClick={(e) => changeMessage(option)}>
                            <Box sx={{ padding: '8px 16px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                                <div className="tpl-item-name">{option.name}</div>
                                <Box style={{ display: 'flex', marginTop: '2px' }}>
                                    <img
                                        className='tlp-avatar'
                                        alt="Remy Sharp"
                                        src={avatar}
                                    />
                                    <span className="tpl-item-owner">{option.owner}</span>
                                    <span className="tpl-item-msg">{renderMessage(option.last_message?.body)}</span>
                                    <span className="tpl-item-time">{getTimeDiff(option.last_message?.time)}</span>
                                </Box>
                            </Box>
                        </li>
                    );
                })}
            </ul>
        </Box>
    );
};

export default ThreadListPanel;
