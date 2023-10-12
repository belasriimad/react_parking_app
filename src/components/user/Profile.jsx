import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../helpers/authContext';
import Spinner from '../layouts/Spinner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/url';
import { getConfig } from '../../helpers/config';
import { toast } from 'react-toastify';
import { renderValidationErrors } from '../../helpers/validation';

export default function Profile() {
    const [password, setPassword] = useState('');
    const [current_password, setCurrentPassword] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState({updatingName: false, updatingPassword: false});
    const { accessToken, setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        if(!accessToken) {
            navigate('/login');
        }
    }, [accessToken]);


    const updateProfile = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading({
            ...loading,
            updatingName: true
        });
        const data = { name };
        try {
            const response = await axios.put(`${BASE_URL}/user/update/profile`, data, getConfig(accessToken));
            setCurrentUser(response.data.user);
            setLoading({
                ...loading,
                updatingName: false
            });
            setName('');
            toast.success('Your fullname has been updated!', {
                position: toast.POSITION.TOP_RIGHT
            });
        } catch (error) {
            setLoading({
                ...loading,
                updatingName: false
            });
            if (error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.log(error);
        }
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading({
            ...loading,
            updatingPassword: true
        });
        const data = { password, current_password };
        try {
            const response = await axios.put(`${BASE_URL}/user/update/password`, data, getConfig(accessToken));
            console.log(response.data);
            setLoading({
                ...loading,
                updatingPassword: false
            });
            setPassword('');
            setCurrentPassword('');
            toast.success('Your password has been updated!', {
                position: toast.POSITION.TOP_RIGHT
            });
        } catch (error) {
            setLoading({
                ...loading,
                updatingPassword: false
            });
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
                        <div className="card-header bg-white text-center">
                            <h4 className="mt-2">Update your username</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ (e) => updateProfile(e) } noValidate>
                                <div className="form-group mb-4">
                                    <input type="text" name="name" 
                                        value={name}
                                        onChange={ event => setName(event.target.value) }
                                        className="form-control mb-2 rounded-0" placeholder="Name" />
                                    { renderValidationErrors(errors, 'name') }
                                </div>

                                {
                                    loading.updatingName ? <Spinner />
                                    :
                                    <button 
                                        type="submit" 
                                        className="btn btn-sm btn-primary btn-block mb-4 rounded-0">Update</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white text-center">
                            <h4 className="mt-2">Update your password</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ (e) => updatePassword(e) } noValidate>
                                <div className="form-group mb-4">
                                    <input type="password" name="current_password" 
                                        value={current_password}
                                        onChange={ event => setCurrentPassword(event.target.value) }
                                        className="form-control mb-2 rounded-0" placeholder="Current Password" />
                                    { renderValidationErrors(errors, 'current_password') }
                                </div>

                                <div className="form-group mb-4">
                                    <input type="password" name="name" 
                                        value={password}
                                        onChange={ event => setPassword(event.target.value) }
                                        className="form-control mb-2 rounded-0" placeholder="New Password" />
                                    { renderValidationErrors(errors, 'password') }
                                </div>

                                {
                                    loading.updatingPassword ? <Spinner />
                                    :
                                    <button type="submit" 
                                        className="btn btn-sm btn-primary btn-block mb-4 rounded-0">Update</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
