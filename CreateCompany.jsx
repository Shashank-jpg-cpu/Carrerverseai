import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateCompany() {

    const navigate = useNavigate();

    const [company, setCompany] = useState({

        company_name: "",

        company_email: "",

        password: "",

        company_phone: "",

        website: "",

        industry: "",

        company_size: "",

        founded_year: "",

        location: "",

        address: "",

        description: "",

        linkedin: "",

        twitter: "",

        facebook: "",

        instagram: ""

    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setCompany({

            ...company,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(

                "/company/create",

                company

            );

            setMessage(response.data.message);

            alert(

                "Company Login\n\nEmail : " +

                response.data.login.email +

                "\nPassword : " +

                response.data.login.password

            );

            setCompany({

                company_name: "",

                company_email: "",

                password: "",

                company_phone: "",

                website: "",

                industry: "",

                company_size: "",

                founded_year: "",

                location: "",

                address: "",

                description: "",

                linkedin: "",

                twitter: "",

                facebook: "",

                instagram: ""

            });

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Unable to create company."

            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Create Company</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <input className="form-control mt-3" placeholder="Company Name" name="company_name" value={company.company_name} onChange={handleChange} required />

                <input className="form-control mt-3" placeholder="Company Email" name="company_email" value={company.company_email} onChange={handleChange} required />

                <input className="form-control mt-3" type="password" placeholder="Login Password" name="password" value={company.password} onChange={handleChange} required />

                <input className="form-control mt-3" placeholder="Phone" name="company_phone" value={company.company_phone} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Website" name="website" value={company.website} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Industry" name="industry" value={company.industry} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Company Size" name="company_size" value={company.company_size} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Founded Year" name="founded_year" value={company.founded_year} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Location" name="location" value={company.location} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Address" name="address" value={company.address} onChange={handleChange} />

                <textarea className="form-control mt-3" placeholder="Description" name="description" value={company.description} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="LinkedIn" name="linkedin" value={company.linkedin} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Twitter" name="twitter" value={company.twitter} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Facebook" name="facebook" value={company.facebook} onChange={handleChange} />

                <input className="form-control mt-3" placeholder="Instagram" name="instagram" value={company.instagram} onChange={handleChange} />

                <button className="btn btn-primary mt-4">

                    Create Company

                </button>

            </form>

            <h5 className="mt-3 text-success">

                {message}

            </h5>

        </div>

    );

}

export default CreateCompany;