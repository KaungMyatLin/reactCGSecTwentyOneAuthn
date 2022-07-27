import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react'
import AuthenCtxInit from '../../store/authen-context'
import { useNavigate } from 'react-router-dom'
const ProfileForm = () => {
  const newPwInp = useRef();
  const authenCtxCtx = useContext(AuthenCtxInit)
  const navigHook = useNavigate();
  const submitPwChangeH = (event) => {
    event.preventDefault();
    const newPwVal = newPwInp.current.value;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAdI69koBVbAkMcQeQuQcCpVf3lPkRAJEI'
    , {
      method: 'POST'
      , body: JSON.stringify({
        idToken: authenCtxCtx.ctxToken
        , password: newPwVal
        , returnSecureToken: false
      })
      , headers: {
        'content-type': 'application/json'
      }
    })
    .then (res => {
      if (res.ok){
        return res.json();
      }
      else {
        // If you don't return, it will continue to next then, then it gets no value (data).
        // Also, throw new Error is shown as an error in console if you don't return.
        // If do, skip next then, and the error is sent to catch block.
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
      navigHook('/', {replace: true})
    })
    .catch ((err) => {
      alert(err.message);
    })
  }
  return (
    <form className={classes.form} onSubmit={submitPwChangeH}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPwInp}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
