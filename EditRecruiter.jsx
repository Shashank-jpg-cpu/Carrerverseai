import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditRecruiter() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [recruiter, setRecruiter] = useState({

        company_id: "",

        designation: "",

        department: "",

        experience: "",

        bio: "",

        linkedin: ""

    });

    useEffect(() => {

        loadRecruiter();

        loadCompanies();

    }, []);

    const loadRecruiter = async () => {

        const response = await api.get(

            `/recruiter/${id}`

        );

        setRecruiter(response.data);

    };

    const loadCompanies = async () => {

        const response = await api.get(

            "/company/all"

        );

        setCompanies(response.data);

    };

    const handleChange = (e) => {

        setRecruiter({

            ...recruiter,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await api.put(

            `/recruiter/update/${id}`,

            recruiter

        );

        navigate(

            "/admin/recruiter/list"

        );

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Recruiter</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <select

                    className="form-select mt-3"

                    name="company_id"

                    value={recruiter.company_id}

                    onChange={handleChange}

                >

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

                    name="designation"

                    placeholder="Designation"

                    value={recruiter.designation}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="department"

                    placeholder="Department"

                    value={recruiter.department}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    type="number"

                    name="experience"

                    placeholder="Experience"

                    value={recruiter.experience}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mt-3"

                    rows="4"

                    name="bio"

                    placeholder="Bio"

                    value={recruiter.bio}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="linkedin"

                    placeholder="LinkedIn"

                    value={recruiter.linkedin}

                    onChange={handleChange}

                />

                <button

                    className="btn btn-success mt-4"

                >

                    Update Recruiter

                </button>

            </form>

        </div>

    );

}

export default EditRecruiter;