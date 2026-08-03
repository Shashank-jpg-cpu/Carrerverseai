import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateRecruiter() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [message, setMessage] = useState("");

    const [recruiter, setRecruiter] = useState({

        full_name: "",

        email: "",

        password: "",

        phone: "",

        company_id: "",

        designation: "",

        department: "",

        experience: "",

        bio: "",

        linkedin: ""

    });

    useEffect(() => {

        loadCompanies();

    }, []);

    const loadCompanies = async () => {

        try {

            const response = await api.get("/company/all");

            setCompanies(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setRecruiter({

            ...recruiter,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            const response = await api.post(

                "/recruiter/create",

                recruiter

            );

            setMessage(response.data.message);

            alert(

                "Recruiter Login\n\n" +

                "Email : " +

                response.data.login.email +

                "\nPassword : " +

                response.data.login.password

            );

            setRecruiter({

                full_name: "",

                email: "",

                password: "",

                phone: "",

                company_id: "",

                designation: "",

                department: "",

                experience: "",

                bio: "",

                linkedin: ""

            });

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Unable to create recruiter."

            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Create Recruiter</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <input

                    className="form-control mt-3"

                    placeholder="Recruiter Name"

                    name="full_name"

                    value={recruiter.full_name}

                    onChange={handleChange}

                    required

                />

                <input

                    className="form-control mt-3"

                    type="email"

                    placeholder="Recruiter Email"

                    name="email"

                    value={recruiter.email}

                    onChange={handleChange}

                    required

                />

                <input

                    className="form-control mt-3"

                    type="password"

                    placeholder="Login Password"

                    name="password"

                    value={recruiter.password}

                    onChange={handleChange}

                    required

                />

                <input

                    className="form-control mt-3"

                    placeholder="Phone"

                    name="phone"

                    value={recruiter.phone}

                    onChange={handleChange}

                />

                <select

                    className="form-select mt-3"

                    name="company_id"

                    value={recruiter.company_id}

                    onChange={handleChange}

                    required

                >

                    <option value="">

                        Select Company

                    </option>

                    {

                        companies.map(company => (

                            <option

                                key={company.id}

                                value={company.id}

                            >

                                {company.company_name}

                            </option>

                        ))

                    }

                </select>

                <input

                    className="form-control mt-3"

                    placeholder="Designation"

                    name="designation"

                    value={recruiter.designation}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    placeholder="Department"

                    name="department"

                    value={recruiter.department}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    type="number"

                    placeholder="Experience (Years)"

                    name="experience"

                    value={recruiter.experience}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mt-3"

                    rows="3"

                    placeholder="Bio"

                    name="bio"

                    value={recruiter.bio}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    placeholder="LinkedIn"

                    name="linkedin"

                    value={recruiter.linkedin}

                    onChange={handleChange}

                />

                <button

                    className="btn btn-success mt-4"

                    type="submit"

                >

                    Create Recruiter

                </button>

            </form>

            {

                message &&

                <div className="alert alert-success mt-4">

                    {message}

                </div>

            }

        </div>

    );

}

export default CreateRecruiter;