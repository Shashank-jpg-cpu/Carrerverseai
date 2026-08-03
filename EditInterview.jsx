import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditInterview(){

    const {id}=useParams();

    const navigate=useNavigate();

    const [interview,setInterview]=useState({

        interview_title:"",

        interview_type:"Technical",

        interview_mode:"Online",

        interview_date:"",

        interview_time:"",

        duration:60,

        meeting_link:"",

        meeting_password:"",

        location:"",

        interviewer_name:"",

        interviewer_email:"",

        interview_status:"Scheduled",

        result:"Pending",

        feedback:"",

        rating:0

    });

    useEffect(()=>{

        loadInterview();

    },[]);

    const loadInterview=async()=>{

        try{

            const response=await api.get(`/interview/${id}`);

            setInterview(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    const handleChange=(e)=>{

        setInterview({

            ...interview,

            [e.target.name]:e.target.value

        });

    };

    const saveInterview=async(e)=>{

        e.preventDefault();

        try{

            await api.put(

                `/interview/update/${id}`,

                interview

            );

            alert("Interview Updated Successfully");

            navigate("/recruiter/interviews");

        }

        catch(error){

            alert("Unable to update interview.");

        }

    };

    return(

        <div className="container mt-5">

            <h2>Edit Interview</h2>

            <form onSubmit={saveInterview}>

                <input
                    className="form-control mt-3"
                    name="interview_title"
                    value={interview.interview_title}
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    type="date"
                    name="interview_date"
                    value={interview.interview_date}
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    type="time"
                    name="interview_time"
                    value={interview.interview_time}
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    name="meeting_link"
                    value={interview.meeting_link}
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    name="meeting_password"
                    value={interview.meeting_password}
                    onChange={handleChange}
                />

                <textarea
                    className="form-control mt-3"
                    rows="5"
                    name="feedback"
                    value={interview.feedback}
                    onChange={handleChange}
                />

                <select
                    className="form-select mt-3"
                    name="result"
                    value={interview.result}
                    onChange={handleChange}
                >

                    <option>Pending</option>
                    <option>Selected</option>
                    <option>Rejected</option>

                </select>

                <select
                    className="form-select mt-3"
                    name="interview_status"
                    value={interview.interview_status}
                    onChange={handleChange}
                >

                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>

                </select>

                <input
                    className="form-control mt-3"
                    type="number"
                    name="rating"
                    value={interview.rating}
                    onChange={handleChange}
                />

                <button
                    className="btn btn-success mt-4"
                >

                    Save Changes

                </button>

            </form>

        </div>

    );

}

export default EditInterview;