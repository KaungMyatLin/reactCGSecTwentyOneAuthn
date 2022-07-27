import react, { useState } from "react";
const AuthenCtxInit = react.createContext({
    ctxToken: '',
    ctxIsLoggedIn: false,
    ctxLoginFun: (token) => {},
    ctxLogoutFun: () => {}
})
export const AuthenCtxProvider = (props) => {
    const initStartUpToken = localStorage.getItem('token')
    const [getToken, setToken] = useState(initStartUpToken)
    const boolIsLoggedIn = !!getToken
    const loginHdl = (argToken) => {
        setToken(argToken)
        localStorage.setItem('token', getToken)
    }
    const logoutHdl = () => {
        setToken(null)
        localStorage.removeItem('token')
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