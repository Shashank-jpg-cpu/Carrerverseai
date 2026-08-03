import { useEffect, useState } from "react";

import api from "../../services/api";

function InterviewList() {

    const [interviews, setInterviews] = useState([]);

    useEffect(() => {

        loadInterviews();

    }, []);

    const loadInterviews = async () => {

        try {

            const response = await api.get(

                "/interview/all"

            );

            setInterviews(

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

                Interview Management

            </h2>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Student</th>

                        <th>Recruiter</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        interviews.map(interview => (

                            <tr key={interview.id}>

                                <td>{interview.id}</td>

                                <td>{interview.student_id}</td>

                                <td>{interview.recruiter_id}</td>

                                <td>{interview.interview_date}</td>

                                <td>{interview.interview_time}</td>

                                <td>{interview.status}</td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default InterviewList;