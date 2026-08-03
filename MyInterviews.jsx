import { useEffect, useState } from "react";
import api from "../../services/api";
import authService from "../../services/auth";

function MyInterviews() {

    const user = authService.getCurrentUser();
    console.log("Current User:", user);

    const [interviews, setInterviews] = useState([]);

    useEffect(() => {

        loadInterviews();

    }, []);

    const loadInterviews = async () => {

        try {

            const response = await api.get(

                `/interview/student/${user.student_id}`

            );

            console.log(response.data);

            setInterviews(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                My Interviews

            </h2>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Interview Title</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Mode</th>

                        <th>Status</th>

                        <th>Result</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        interviews.length === 0 ?

                        <tr>

                            <td
                                colSpan="7"
                                className="text-center"
                            >

                                No Interviews Found

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

                                    <span
                                        className={
                                            interview.interview_status === "Completed"
                                            ? "badge bg-success"
                                            : "badge bg-warning text-dark"
                                        }
                                    >

                                        {interview.interview_status}

                                    </span>

                                </td>

                                <td>{interview.result}</td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default MyInterviews;