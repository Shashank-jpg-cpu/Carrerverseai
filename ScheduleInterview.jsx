import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function ScheduleInterview() {

    const navigate = useNavigate();

    const { applicationId } = useParams();

    const user = authService.getCurrentUser();

    const [interview, setInterview] = useState({

        interview_title: "",

        interview_type: "Technical",

        interview_mode: "Online",

        interview_date: "",

        interview_time: "",

        duration: 60,

        meeting_link: "",

        meeting_password: "",

        location: "",

        interviewer_name: "",

        interviewer_email: ""

    });

    const handleChange = (e) => {

        setInterview({

            ...interview,

            [e.target.name]: e.target.value

        });

    };

    const scheduleInterview = async (e) => {

        e.preventDefault();

        try {

            await api.post(

                "/interview/schedule",

                {

                    application_id: applicationId,

                    recruiter_id: user.id,

                    ...interview

                }

            );

            alert("Interview Scheduled Successfully");

            navigate("/recruiter/interviews");

        }

        catch(error){

            alert(

                error.response?.data?.message ||

                "Unable to schedule interview"

            );

        }

    };

    return(

        <div className="container mt-5">

            <h2>

                Schedule Interview

            </h2>

            <form onSubmit={scheduleInterview}>

                <input

                    className="form-control mt-3"

                    name="interview_title"

                    placeholder="Interview Title"

                    onChange={handleChange}

                    required

                />

                <select

                    className="form-select mt-3"

                    name="interview_type"

                    onChange={handleChange}

                >

                    <option>Technical</option>

                    <option>HR</option>

                    <option>Managerial</option>

                    <option>Final</option>

                </select>

                <select

                    className="form-select mt-3"

                    name="interview_mode"

                    onChange={handleChange}

                >

                    <option>Online</option>

                    <option>Offline</option>

                </select>

                <input

                    className="form-control mt-3"

                    type="date"

                    name="interview_date"

                    onChange={handleChange}

                    required

                />

                <input

                    className="form-control mt-3"

                    type="time"

                    name="interview_time"

                    onChange={handleChange}

                    required

                />

                <input

                    className="form-control mt-3"

                    type="number"

                    name="duration"

                    placeholder="Duration (Minutes)"

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="meeting_link"

                    placeholder="Meeting Link"

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="meeting_password"

                    placeholder="Meeting Password"

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="location"

                    placeholder="Location"

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="interviewer_name"

                    placeholder="Interviewer Name"

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="interviewer_email"

                    placeholder="Interviewer Email"

                    onChange={handleChange}

                />

                <button

                    className="btn btn-primary mt-4"

                    type="submit"

                >

                    Schedule Interview

                </button>

            </form>

        </div>

    );

}

export default ScheduleInterview;