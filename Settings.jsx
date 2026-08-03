import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/auth";
import api from "../../services/api";

function Settings() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({

        current_password: "",

        new_password: "",

        confirm_password: ""

    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const changePassword = async (e) => {

        e.preventDefault();

        setMessage("");

        if (formData.new_password !== formData.confirm_password) {

            setMessage("New passwords do not match.");

            return;

        }

        try {

            const response = await api.put(

                "/auth/change-password",

                {

                    user_id: user.id,

                    current_password: formData.current_password,

                    new_password: formData.new_password

                }

            );

            setMessage(response.data.message);

            setFormData({

                current_password: "",

                new_password: "",

                confirm_password: ""

            });

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Unable to change password."

            );

        }

    };

    const logout = () => {

        authService.logout();

        navigate("/login");

    };

    return (

        <div className="container mt-5">

            <h2>

                Student Settings

            </h2>

            {

                message &&

                <div className="alert alert-info mt-3">

                    {message}

                </div>

            }

            <div className="card mt-4 p-4">

                <h4>

                    Change Password

                </h4>

                <form onSubmit={changePassword}>

                    <input

                        className="form-control mt-3"

                        type="password"

                        name="current_password"

                        placeholder="Current Password"

                        value={formData.current_password}

                        onChange={handleChange}

                        required

                    />

                    <input

                        className="form-control mt-3"

                        type="password"

                        name="new_password"

                        placeholder="New Password"

                        value={formData.new_password}

                        onChange={handleChange}

                        required

                    />

                    <input

                        className="form-control mt-3"

                        type="password"

                        name="confirm_password"

                        placeholder="Confirm New Password"

                        value={formData.confirm_password}

                        onChange={handleChange}

                        required

                    />

                    <button

                        className="btn btn-primary mt-4"

                        type="submit"

                    >

                        Change Password

                    </button>

                </form>

                <hr />

                <button

                    className="btn btn-danger"

                    onClick={logout}

                >

                    Logout

                </button>

            </div>

        </div>

    );

}

export default Settings;