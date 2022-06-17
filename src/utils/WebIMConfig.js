
var config = {
    Host: 'easemob.com',
    isHttpDNS: true,
    isMultiLoginSessions: true,
    isSandBox: false, //内部测试环境，集成时设为false
    isDebug: true,
    autoReconnectNumMax: 10,
    useOwnUploadFun: false,
    isAutoLogin: false,
    delivery: true,
    loglevel: 'ERROR',
    enableLocalStorage: true,
    deviceId: 'webim'+ Math.floor(Math.random()*99 + 1),
    https: true,
  };
  export default config;
  