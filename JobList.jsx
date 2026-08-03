import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function JobList() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {

        loadJobs();

    }, []);

    const loadJobs = async () => {

        try {

            const response = await api.get("/job/all");

            setJobs(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteJob = async (id) => {

        if (!window.confirm("Delete this job?")) {

            return;

        }

        try {

            await api.delete(`/job/delete/${id}`);

            loadJobs();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>Job Management</h2>

            <button

                className="btn btn-primary mb-3"

                onClick={() => navigate("/admin/job/create")}

            >

                Create Job

            </button>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Title</th>

                        <th>Company</th>

                        <th>Location</th>

                        <th>Salary</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        jobs.map(job => (

                            <tr key={job.id}>

                                <td>{job.id}</td>

                                <td>{job.title}</td>

                                <td>{job.company_name}</td>

                                <td>{job.location}</td>

                                <td>{job.salary}</td>

                                <td>

                                    <button

                                        className="btn btn-warning btn-sm me-2"

                                        onClick={() => navigate(`/admin/job/edit/${job.id}`)}

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

export default JobList;