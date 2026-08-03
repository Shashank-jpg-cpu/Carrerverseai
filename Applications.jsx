import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function Applications() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [applications, setApplications] = useState([]);

    useEffect(() => {

        loadApplications();

    }, []);

    const loadApplications = async () => {

        try {

            const response = await api.get(

                `/application/recruiter/${user.id}`

            );

            setApplications(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(

                `/application/status/${id}`,

                {

                    application_status: status

                }

            );

            loadApplications();

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

                        <th>Student ID</th>

                        <th>Job ID</th>

                        <th>Status</th>

                        <th width="420">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        applications.length === 0 ?

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center"
                                >

                                    No Applications Found

                                </td>

                            </tr>

                            :

                            applications.map(application => (

                                <tr key={application.id}>

                                    <td>

                                        {application.id}

                                    </td>

                                    <td>

                                        {application.student_id}

                                    </td>

                                    <td>

                                        {application.job_id}

                                    </td>

                                    <td>

                                        <span className="badge bg-primary">

                                            {application.application_status}

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            className="btn btn-info btn-sm me-2"

                                            onClick={() =>

                                                navigate(

                                                    `/recruiter/application/${application.id}`

                                                )

                                            }

                                        >

                                            View Candidate

                                        </button>

                                        <button

                                            className="btn btn-success btn-sm me-2"

                                            onClick={() =>

                                                updateStatus(

                                                    application.id,

                                                    "Shortlisted"

                                                )

                                            }

                                        >

                                            Shortlist

                                        </button>

                                        <button

                                            className="btn btn-danger btn-sm me-2"

                                            onClick={() =>

                                                updateStatus(

                                                    application.id,

                                                    "Rejected"

                                                )

                                            }

                                        >

                                            Reject

                                        </button>

                                        <button

                                            className="btn btn-primary btn-sm"

                                            onClick={() =>

                                                updateStatus(

                                                    application.id,

                                                    "Selected"

                                                )

                                            }

                                        >

                                            Select

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

export default Applications;