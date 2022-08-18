import react, { useState, useEffect, useCallback } from "react";
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
    // expirationTime is a string time (added currentLoginTime + convertToMilliSec( expiresInSec ) )
    const loginHdl = (argToken, expirationTime) => {
        setToken(argToken)
        localStorage.setItem('token', getToken)
        localStorage.setItem('expirationTime', expirationTime)
        // by the time removing more outdated code.
        // const remainingTime = calcRemainingTime(expirationTime);
        logoutSetTimeOut = setTimeout(logoutHdl, 10000);
    }
    // The 'logoutHdl' function makes the dependencies of useEffect Hook change on every render. 
    // To fix this, wrap the definition of 'logoutHdl' in its own useCallback() Hook. 
    // 1. Move logCount inside the useEffect hook and remove logoutHdl dependency.
    // 2. Wrap logCount in a useCallback hook.
    const logoutHdl = useCallback(() => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if (logoutSetTimeOut) { clearTimeout(logoutSetTimeOut) }
    }
    , []);

    useEffect(() => {
    if (objDeterminingDataForLogUserOut) {
        console.log(objDeterminingDataForLogUserOut)
        const { remainingTime } = objDeterminingDataForLogUserOut;
        logoutSetTimeOut = setTimeout(logoutHdl, remainingTime)
        // component's job is to render ui, watch for state change and rerender ui.
        // useEffect is a more powerful tool alternative to componentDidMount, componentDidUpdate and componentWillUnmount.
        // without 2nd args, useEffect by default will run on initial render and every rerender of component, 
        // as well as on dismount if there is return callback.
        // useEffect will compare the old dependency object === new dependency object.
        // if logoutHdl is not written as dependency in this case,
        // reexecution of useEffect func including re-assignment to logoutSetTimeOut, new obj setTimeOut() 
        // will cause re-declaration of logoutHdl outside useEfect (thus new func obj) everytime remainingTime changes.
        // useEffect dependency protects funcs redeclaration + assignment, variables redeclaration + assignment.
        // without any dependency, useEffect will only run once.
    }
    }, [objDeterminingDataForLogUserOut, logoutHdl])
    const ctxVal = {
        ctxToken: getToken,
        ctxIsLoggedIn: boolIsLoggedIn,
        ctxLoginFun: loginHdl,
        ctxLogoutFun: logoutHdl
    }
    return <AuthenCtxInit.Provider value={ctxVal}>{ props.children }</AuthenCtxInit.Provider>
}
export default AuthenCtxInit