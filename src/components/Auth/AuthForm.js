import { useState, useRef, useContext } from 'react';
import AuthenCtxInit from '../../store/authen-context'
import classes from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom'
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emInpRef = useRef();
  const pwInpRef = useRef();
  const authenCtxCtx = useContext(AuthenCtxInit);
  const navigHook = useNavigate();
  
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitH = (event) =>{
    event.preventDefault();
    const emRefVal = emInpRef.current.value;
    const pwRefVal = pwInpRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAdI69koBVbAkMcQeQuQcCpVf3lPkRAJEI'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAdI69koBVbAkMcQeQuQcCpVf3lPkRAJEI'
    }
    fetch( url
      ,{
        method: 'POST'
        , body: JSON.stringify({ email: emRefVal, password: pwRefVal, returnSecureToken: true})
        , headers: {'content-type': 'application/json'}
      }
      )
      .then (res => {
        setIsLoading(false);
        if (res.ok){
          return res.json();
        }
        else {
          return res.json().then(data => {
            console.log(data);
            let rtnErrMsg = 'Authentication failed';
            if (data && data.error && data.error.message)
              rtnErrMsg = data.error.message;
            throw new Error(rtnErrMsg);
          })
        }
      })
      .then (data => {
        console.log(data);
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn *1000)); // change to time.
        authenCtxCtx.ctxLoginFun(data.idToken, expirationTime.toISOString()); // convert to string.
        navigHook('/', {replace: true})
      })
      .catch ((err) => {
        alert(err.message);
      })
  }
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitH}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emInpRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={pwInpRef}/>
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
