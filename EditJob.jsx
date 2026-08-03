import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditJob() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState({

        title: "",

        description: "",

        location: "",

        salary: "",

        job_type: "",

        experience: "",

        deadline: ""

    });

    useEffect(() => {

        loadJob();

    }, []);

    const loadJob = async () => {

        try {

            const response = await api.get(

                `/job/${id}`

            );

            setJob(response.data);

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

            await api.put(

                `/job/update/${id}`,

                job

            );

            alert("Job Updated Successfully");

            navigate("/admin/job/list");

        }

        catch (error) {

            console.log(error);

            alert("Unable to update job");

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Job</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <input

                    className="form-control mt-3"

                    name="title"

                    value={job.title}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mt-3"

                    rows="5"

                    name="description"

                    value={job.description}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="location"

                    value={job.location}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="salary"

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

                    name="experience"

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

                    className="btn btn-success mt-4"

                >

                    Update Job

                </button>

            </form>

        </div>

    );

}

export default EditJob;