import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react'
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthenCtxInit from './store/authen-context'
function App() {
  const authenCtxCtx = useContext(AuthenCtxInit);
  return (
    <Layout>
      <Routes>
        <Route path='/' element={ <HomePage /> } />
        { !authenCtxCtx.ctxIsLoggedIn && <Route path='/auth' element={ <AuthPage /> } /> }
        <Route path='/profile' element={ authenCtxCtx.ctxIsLoggedIn? <UserProfile /> : <Navigate to='/auth' /> } />
        <Route path='*' element={ <Navigate to='/' /> } />
      </Routes>
    </Layout>
  );
}

export default App;
