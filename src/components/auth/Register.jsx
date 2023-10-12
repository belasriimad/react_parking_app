import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../helpers/url';
import { useNavigate } from 'react-router-dom';
import Spinner from '../layouts/Spinner';
import { AuthContext } from '../../helpers/authContext';
import { renderValidationErrors } from '../../helpers/validation';


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { accessToken, setAccessToken,  setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        if(accessToken) {
            navigate('/');
        }
    }, [accessToken]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        const data = { name, email, password };
        try {
            const response = await axios.post(`${BASE_URL}/user/register`, data);
            localStorage.setItem('accessToken', JSON.stringify(response.data.access_token));
            setCurrentUser(response.data.user);
            setAccessToken(response.data.access_token);
            setLoading(false);
            setName('');
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (error) {
            setLoading(false);
            if (error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white p-3 text-center">
                            <h4>Register</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ (e) => handleSubmit(e) } noValidate>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-group">
                                            <input type="text" 
                                                name="name"
                                                value={name}
                                                onChange={ event => setName(event.target.value) }
                                                className="form-control mb-2 rounded-0" placeholder="Name"/>
                                            { renderValidationErrors(errors, 'name') }
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <input type="email" name="email" 
                                        value={email}
                                        onChange={ event => setEmail(event.target.value) }
                                        className="form-control mb-2 rounded-0" placeholder="Email" />
                                    { renderValidationErrors(errors, 'email') }
                                </div>

                                <div className="form-group mb-4">
                                    <input type="password" 
                                        name="password"
                                        value={password}
                                        onChange={ event => setPassword(event.target.value) }
                                        className="form-control mb-2 rounded-0" placeholder="Password"/>
                                    { renderValidationErrors(errors, 'password') }
                                </div>

                                {
                                    loading ? <Spinner />
                                    :
                                    <button type="submit" className="btn btn-primary btn-block mb-4 rounded-0">Sign up</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
