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
    }, [objDeterminingDataForLogUserOut])
    const ctxVal = {
        ctxToken: getToken,
        ctxIsLoggedIn: boolIsLoggedIn,
        ctxLoginFun: loginHdl,
        ctxLogoutFun: logoutHdl
    }
    return <AuthenCtxInit.Provider value={ctxVal}>{ props.children }</AuthenCtxInit.Provider>
}
export default AuthenCtxInit