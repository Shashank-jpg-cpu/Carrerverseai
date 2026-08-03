import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../../services/auth";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: "",

        password: ""

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        try {

            const response = await authService.login(formData);

            console.log(response);

            const data = response.data || response;

            if (!data.success) {

                setMessage(data.message);

                return;

            }

            setMessage(data.message);

            const role = data.user.role;

            if (role === "Admin") {

                navigate("/admin/dashboard");

            }

            else if (role === "Student") {

                navigate("/student/dashboard");

            }

            else if (role === "Recruiter") {

                navigate("/recruiter/dashboard");

            }

            else if (role === "Company") {

                navigate("/company/dashboard");

            }

        }

        catch (error) {

            console.log(error);

            setMessage(

                error.response?.data?.message ||

                error.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>

                    CareerVerse AI

                </h1>

                <h3>

                    Login

                </h3>

                {

                    message &&

                    <div className="message">

                        {message}

                    </div>

                }

                <form onSubmit={handleSubmit}>

                    <input

                        type="email"

                        name="email"

                        placeholder="Email"

                        value={formData.email}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="password"

                        name="password"

                        placeholder="Password"

                        value={formData.password}

                        onChange={handleChange}

                        required

                    />

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                "Logging In..."

                                :

                                "Login"

                        }

                    </button>

                </form>

                <p>

                    Don't have an account?{" "}

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;