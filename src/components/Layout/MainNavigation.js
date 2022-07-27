import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import { useContext } from 'react'
import AuthenCtxInit from '../../store/authen-context'
const MainNavigation = () => {
  const authenCtxCtx = useContext(AuthenCtxInit);
  const isLoggedIn = authenCtxCtx.ctxIsLoggedIn;
  const logout = () => {
    authenCtxCtx.ctxLogoutFun();
  }
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          { !isLoggedIn && <li>
            <Link to='/auth'>Login</Link>
            </li>
          }
          { isLoggedIn && <li>
            <Link to='/profile'>Profile</Link>
            </li>
          }
          { isLoggedIn && <li>
            <button onClick={logout}>Logout</button>
            </li>
          }
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
