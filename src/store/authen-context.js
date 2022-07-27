import react, { useState, useEffect } from "react";
let logoutSetTimeOut;
const AuthenCtxInit = react.createContext({
    ctxToken: '',
    ctxIsLoggedIn: false,
    ctxLoginFun: (token) => {},
    ctxLogoutFun: () => {}
})
const calcRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingTime = adjExpirationTime - currentTime;
    return remainingTime;
}
const getLocalStorageTokenAndRemainingTime = () => {
    const getTokenInsideStorage = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');
    const remainingTime = calcRemainingTime(storedExpirationTime);
    if (remainingTime <= 1000 ) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null
    }
    return {getTokenInsideStorage, remainingTime}
}
export const AuthenCtxProvider = (props) => {
    const objDeterminingDataForLogUserOut = getLocalStorageTokenAndRemainingTime();
    let initAppStartToken;
    if (objDeterminingDataForLogUserOut) {
        initAppStartToken = objDeterminingDataForLogUserOut.getTokenInsideStorage;
    }
    const [getToken, setToken] = useState(initAppStartToken);
    const boolIsLoggedIn = !!getToken;
    const logoutHdl = () => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if (logoutSetTimeOut) { clearTimeout(logoutSetTimeOut) }
    }
    // expirationTime is a string time (added currentLoginTime + convertToMilliSec( expiresInSec ) )
    const loginHdl = (argToken, expirationTime) => {
        setToken(argToken)
        localStorage.setItem('token', getToken)
        localStorage.setItem('expirationTime', expirationTime)
        const remainingTime = calcRemainingTime(expirationTime);
        logoutSetTimeOut = setTimeout(logoutHdl, 10000);
    }
    useEffect(() => {
    if (objDeterminingDataForLogUserOut) {
        console.log(objDeterminingDataForLogUserOut)
        const { remainingTime } = objDeterminingDataForLogUserOut;
        logoutSetTimeOut = setTimeout(logoutHdl, remainingTime)
        // iflogoutHdl as written as dependency,
        // it will not be affected by rerendering of func declaration every time component rerendered.
        // but it will be affected by rerending of func expression, every time reminingTime changes
        // inside setTimeOut inside useEffect.
        // useEffect protects function executions from infinite loops or unnecessary effect executions.
        // 
    }
    }, [objDeterminingDataForLogUserOut, ])
    const ctxVal = {
        ctxToken: getToken,
        ctxIsLoggedIn: boolIsLoggedIn,
        ctxLoginFun: loginHdl,
        ctxLogoutFun: logoutHdl
    }
    return <AuthenCtxInit.Provider value={ctxVal}>{ props.children }</AuthenCtxInit.Provider>
}
export default AuthenCtxInit