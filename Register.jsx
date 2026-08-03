import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../../services/auth";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        full_name: "",

        email: "",

        phone: "",

        password: "",

        confirm_password: ""

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

        setMessage("");

        if(formData.password !== formData.confirm_password){

            setMessage("Passwords do not match");

            return;

        }

        setLoading(true);

        try{

            await authService.register({

                full_name: formData.full_name,

                email: formData.email,

                phone: formData.phone,

                password: formData.password

            });

            setMessage("Student Registration Successful");

            setTimeout(()=>{

                navigate("/login");

            },1500);

        }

        catch(error){

            setMessage(

                error.message ||

                "Registration Failed"

            );

        }

        finally{

            setLoading(false);

        }

    };

    return(

        <div className="register-page">

            <div className="register-card">

                <h1>

                    Student Registration

                </h1>

                {

                    message &&

                    <div className="message">

                        {message}

                    </div>

                }

                <form onSubmit={handleSubmit}>

                    <input

                        type="text"

                        name="full_name"

                        placeholder="Full Name"

                        value={formData.full_name}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="email"

                        name="email"

                        placeholder="Email"

                        value={formData.email}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="text"

                        name="phone"

                        placeholder="Phone Number"

                        value={formData.phone}

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

                    <input

                        type="password"

                        name="confirm_password"

                        placeholder="Confirm Password"

                        value={formData.confirm_password}

                        onChange={handleChange}

                        required

                    />

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading ?

                            "Creating Account..." :

                            "Register"

                        }

                    </button>

                </form>

                <p>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;