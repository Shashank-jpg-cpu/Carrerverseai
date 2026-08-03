import { useEffect, useState } from "react";

import api from "../../services/api";

function ApplicationList() {

    const [applications, setApplications] = useState([]);

    useEffect(() => {

        loadApplications();

    }, []);

    const loadApplications = async () => {

        try {

            const response = await api.get(

                "/job-application/all"

            );

            setApplications(

                response.data

            );

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Job Applications

            </h2>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Student</th>

                        <th>Job</th>

                        <th>Status</th>

                        <th>Applied On</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        applications.map(application => (

                            <tr key={application.id}>

                                <td>{application.id}</td>

                                <td>{application.student_id}</td>

                                <td>{application.job_id}</td>

                                <td>{application.status}</td>

                                <td>{application.created_at}</td>

                                <td>

                                    <button

                                        className="btn btn-success btn-sm me-2"

                                    >

                                        Approve

                                    </button>

                                    <button

                                        className="btn btn-danger btn-sm"

                                    >

                                        Reject

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

export default ApplicationList;