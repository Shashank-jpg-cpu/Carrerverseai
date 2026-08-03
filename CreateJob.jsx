import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function CreateJob() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    const [job, setJob] = useState({

        company_id: "",

        title: "",

        description: "",

        location: "",

        salary: "",

        job_type: "Full Time",

        experience: "",

        deadline: ""

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

        setJob({

            ...job,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(

                "/job/create",

                job

            );

            alert("Job Created Successfully");

            navigate("/admin/jobs");

        }

        catch (error) {

            console.log(error);

            alert("Unable to create job");

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Create Job</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <select

                    className="form-select mt-3"

                    name="company_id"

                    value={job.company_id}

                    onChange={handleChange}

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

                    name="title"

                    placeholder="Job Title"

                    value={job.title}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mt-3"

                    rows="5"

                    name="description"

                    placeholder="Job Description"

                    value={job.description}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="location"

                    placeholder="Location"

                    value={job.location}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="salary"

                    placeholder="Salary"

                    value={job.salary}

                    onChange={handleChange}

                />

                <select

                    className="form-select mt-3"

                    name="job_type"

                    value={job.job_type}

                    onChange={handleChange}

                >

                    <option>Full Time</option>

                    <option>Part Time</option>

                    <option>Internship</option>

                    <option>Remote</option>

                </select>

                <input

                    className="form-control mt-3"

                    type="number"

                    name="experience"

                    placeholder="Experience (Years)"

                    value={job.experience}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    type="date"

                    name="deadline"

                    value={job.deadline}

                    onChange={handleChange}

                />

                <button

                    className="btn btn-primary mt-4"

                >

                    Create Job

                </button>

            </form>

        </div>

    );

}

export default CreateJob;