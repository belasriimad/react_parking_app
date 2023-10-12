import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../helpers/authContext';
import axios from 'axios';
import { BASE_URL } from '../../helpers/url';
import { getConfig } from '../../helpers/config';

export default function Header() {
    const { accessToken, setAccessToken, currentUser, setCurrentUser } = useContext(AuthContext);
    const location = useLocation();

    const logout = async () => {
        try {
            await axios.post(`${BASE_URL}/user/logout`, {} , getConfig(accessToken));
            localStorage.removeItem('accessToken');
            setCurrentUser(null);
            setAccessToken('');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-mdb-toggle="collapse"
                    data-mdb-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fas fa-bars"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Link to="/" className="navbar-brand mt-2 mt-lg-0">
                        <i className="fa-solid fa-square-parking fa-3x"></i>
                    </Link>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                               <i className="fas fa-home"></i> Home
                            </Link>
                        </li>
                        {
                            !currentUser ? <>
                                <li className="nav-item">
                                    <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                                        <i className="fas fa-user-plus"></i> Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                                    <i className="fas fa-sign-in"></i> Login
                                    </Link>
                                </li>
                            </> :
                            <>
                                <li className="nav-item">
                                    <Link to="/profile" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                                        <i className="fas fa-user"></i> { currentUser.name }
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="#" onClick={() => logout()} className="nav-link">
                                    <i className="fas fa-sign-out"></i> Logout
                                    </Link>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}
