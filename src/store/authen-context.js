import react, { useState } from "react";
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
export const AuthenCtxProvider = (props) => {
    const initStartUpToken = localStorage.getItem('token')
    const [getToken, setToken] = useState(initStartUpToken)
    const boolIsLoggedIn = !!getToken
    const logoutHdl = () => {
        setToken(null)
        localStorage.removeItem('token')
    }
    const loginHdl = (argToken, expirationTime) => {
        setToken(argToken)
        localStorage.setItem('token', getToken)
        const remainingTime = calcRemainingTime(expirationTime);
        setTimeout(logoutHdl, remainingTime);
    }
    const ctxVal = {
        ctxToken: getToken,
        ctxIsLoggedIn: boolIsLoggedIn,
        ctxLoginFun: loginHdl,
        ctxLogoutFun: logoutHdl
    }
    return <AuthenCtxInit.Provider value={ctxVal}>{ props.children }</AuthenCtxInit.Provider>
}
export default AuthenCtxInit