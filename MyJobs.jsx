import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function MyJobs() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {

        loadJobs();

    }, []);

    const loadJobs = async () => {

        try {

            const response = await api.get(

                `/job/recruiter/${user.id}`

            );

            setJobs(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteJob = async (id) => {

        if (!window.confirm("Delete this Job?")) {

            return;

        }

        try {

            const response = await api.delete(

                `/job/delete/${id}`

            );

            alert(response.data.message);

            loadJobs();

        }

        catch (error) {

            console.log(error);

            alert("Unable to delete job.");

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center">

                <h2>

                    My Jobs

                </h2>

                <button

                    className="btn btn-primary"

                    onClick={() => navigate("/recruiter/job/create")}

                >

                    + Create Job

                </button>

            </div>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Job Title</th>

                        <th>Job Code</th>

                        <th>Location</th>

                        <th>Salary</th>

                        <th>Status</th>

                        <th>Deadline</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        jobs.length === 0 ?

                            <tr>

                                <td

                                    colSpan="8"

                                    className="text-center"

                                >

                                    No Jobs Found

                                </td>

                            </tr>

                            :

                            jobs.map(job => (

                                <tr key={job.id}>

                                    <td>{job.id}</td>

                                    <td>{job.job_title}</td>

                                    <td>{job.job_code}</td>

                                    <td>{job.location}</td>

                                    <td>

                                        ₹{job.salary_min} - ₹{job.salary_max}

                                    </td>

                                    <td>

                                        {job.job_status}

                                    </td>

                                    <td>

                                        {job.application_deadline}

                                    </td>

                                    <td>

                                        <button

                                            className="btn btn-warning btn-sm me-2"

                                            onClick={() => navigate(`/recruiter/job/edit/${job.id}`)}

                                        >

                                            Edit

                                        </button>

                                        <button

                                            className="btn btn-danger btn-sm"

                                            onClick={() => deleteJob(job.id)}

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default MyJobs;