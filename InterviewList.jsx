import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function InterviewList() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [interviews, setInterviews] = useState([]);

    useEffect(() => {

        loadInterviews();

    }, []);

    const loadInterviews = async () => {

        try {

            const response = await api.get(

                `/interview/recruiter/${user.id}`

            );

            setInterviews(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(

                `/interview/update/${id}`,

                {

                    interview_status: status

                }

            );

            loadInterviews();

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateResult = async (id, result) => {

        try {

            await api.put(

                `/interview/update/${id}`,

                {

                    result: result

                }

            );

            loadInterviews();

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteInterview = async (id) => {

        if (!window.confirm("Delete Interview?")) {

            return;

        }

        try {

            await api.delete(

                `/interview/delete/${id}`

            );

            loadInterviews();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center">

                <h2>

                    Interview Schedule

                </h2>

            </div>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Title</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Mode</th>

                        <th>Status</th>

                        <th>Result</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        interviews.length === 0 ?

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center"
                                >

                                    No Interviews Scheduled

                                </td>

                            </tr>

                            :

                            interviews.map((interview) => (

                                <tr key={interview.id}>

                                    <td>{interview.id}</td>

                                    <td>{interview.interview_title}</td>

                                    <td>{interview.interview_date}</td>

                                    <td>{interview.interview_time}</td>

                                    <td>{interview.interview_mode}</td>

                                    <td>

                                        <span className={

                                            interview.interview_status === "Completed"

                                                ? "badge bg-success"

                                                : "badge bg-warning text-dark"

                                        }>

                                            {interview.interview_status}

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            interview.result === "Selected"

                                                ?

                                                <span className="badge bg-success">

                                                    Selected

                                                </span>

                                                :

                                                interview.result === "Rejected"

                                                    ?

                                                    <span className="badge bg-danger">

                                                        Rejected

                                                    </span>

                                                    :

                                                    <span className="badge bg-secondary">

                                                        Pending

                                                    </span>

                                        }

                                    </td>

                                    <td>

                                        <button

                                            className="btn btn-success btn-sm me-2"

                                            disabled={interview.interview_status === "Completed"}

                                            onClick={() => updateStatus(

                                                interview.id,

                                                "Completed"

                                            )}

                                        >

                                            Complete

                                        </button>

                                        <button

                                            className="btn btn-primary btn-sm me-2"

                                            disabled={interview.result !== "Pending"}

                                            onClick={() => updateResult(

                                                interview.id,

                                                "Selected"

                                            )}

                                        >

                                            Select

                                        </button>

                                        <button

                                            className="btn btn-danger btn-sm me-2"

                                            disabled={interview.result !== "Pending"}

                                            onClick={() => updateResult(

                                                interview.id,

                                                "Rejected"

                                            )}

                                        >

                                            Reject

                                        </button>

                                        <button

                                            className="btn btn-warning btn-sm me-2"

                                            onClick={() => navigate(

                                                `/recruiter/interview/edit/${interview.id}`

                                            )}

                                        >

                                            Edit

                                        </button>

                                        <button

                                            className="btn btn-dark btn-sm"

                                            onClick={() => deleteInterview(

                                                interview.id

                                            )}

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

export default InterviewList;