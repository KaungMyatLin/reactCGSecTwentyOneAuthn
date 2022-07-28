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
        // component's job is to render ui, watch for state change and rerender ui.
        // if logoutHdl is not written as dependency,
        // reexecution of useEffect func including new logoutSetTimeOut, new setTimeOut()
        // will affect reexecution of it everytime remainingTime.
        // useEffect protects every funcs, every variables + expression from reexecutiton (not become new).
        // in order to not redeclare logoutHdl func when new logoutSetTimeOut, new setTimeOut(), put as dependency.
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