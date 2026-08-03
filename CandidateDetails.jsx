import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../services/api";

function CandidateDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadCandidate();

    }, []);

    const loadCandidate = async () => {

        try {

            const response = await api.get(

                `/application/details/${id}`

            );

            setData(

                response.data

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const updateStatus = async (status) => {

        try {

            await api.put(

                `/application/status/${id}`,

                {

                    application_status: status

                }

            );

            alert(

                `Candidate ${status}`

            );

            loadCandidate();

        }

        catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return (

            <div className="container mt-5">

                <h3>

                    Loading Candidate...

                </h3>

            </div>

        );

    }

    if (!data) {

        return (

            <div className="container mt-5">

                <div className="alert alert-danger">

                    Candidate Not Found

                </div>

            </div>

        );

    }

    return (

        <div className="container mt-5">

            <div className="card shadow-lg">

                <div className="card-body">

                    <div className="d-flex justify-content-between">

                        <h2>

                            Candidate Details

                        </h2>

                        <button

                            className="btn btn-secondary"

                            onClick={() => navigate(-1)}

                        >

                            Back

                        </button>

                    </div>

                    <hr />

                    <div className="row">

                        <div className="col-md-6">

                            <div className="card">

                                <div className="card-header bg-primary text-white">

                                    Student Profile

                                </div>

                                <div className="card-body">

                                    <table className="table">

                                        <tbody>

                                            <tr>

                                                <th>Name</th>

                                                <td>{data.student.name}</td>

                                            </tr>

                                            <tr>

                                                <th>Email</th>

                                                <td>{data.student.email}</td>

                                            </tr>

                                            <tr>

                                                <th>Phone</th>

                                                <td>{data.student.phone}</td>

                                            </tr>

                                            <tr>

                                                <th>College</th>

                                                <td>{data.student.college}</td>

                                            </tr>

                                            <tr>

                                                <th>Degree</th>

                                                <td>{data.student.degree}</td>

                                            </tr>

                                            <tr>

                                                <th>Branch</th>

                                                <td>{data.student.branch}</td>

                                            </tr>

                                            <tr>

                                                <th>Semester</th>

                                                <td>{data.student.semester}</td>

                                            </tr>

                                            <tr>

                                                <th>CGPA</th>

                                                <td>{data.student.cgpa}</td>

                                            </tr>

                                            <tr>

                                                <th>Skills</th>

                                                <td>{data.student.skills}</td>

                                            </tr>

                                            <tr>

                                                <th>LinkedIn</th>

                                                <td>

                                                    <a

                                                        href={data.student.linkedin}

                                                        target="_blank"

                                                        rel="noreferrer"

                                                    >

                                                        {data.student.linkedin}

                                                    </a>

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>Github</th>

                                                <td>

                                                    <a

                                                        href={data.student.github}

                                                        target="_blank"

                                                        rel="noreferrer"

                                                    >

                                                        {data.student.github}

                                                    </a>

                                                </td>

                                            </tr>

                                            <tr>

                                                <th>Portfolio</th>

                                                <td>

                                                    <a

                                                        href={data.student.portfolio}

                                                        target="_blank"

                                                        rel="noreferrer"

                                                    >

                                                        {data.student.portfolio}

                                                    </a>

                                                </td>

                                            </tr>

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-6">

                            <div className="card">

                                <div className="card-header bg-success text-white">

                                    Resume Analysis

                                </div>

                                <div className="card-body">

                                    {

                                        data.resume ?

                                        <>                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <div className="card border-success">

                                                        <div className="card-body text-center">

                                                            <h6>

                                                                Resume Score

                                                            </h6>

                                                            <h2 className="text-success">

                                                                {data.resume.overall_score}%

                                                            </h2>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <div className="card border-primary">

                                                        <div className="card-body text-center">

                                                            <h6>

                                                                ATS Score

                                                            </h6>

                                                            <h2 className="text-primary">

                                                                {data.resume.ats_score}%

                                                            </h2>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <div className="card border-warning">

                                                        <div className="card-body text-center">

                                                            <h6>

                                                                Grammar Score

                                                            </h6>

                                                            <h2 className="text-warning">

                                                                {data.resume.grammar_score}%

                                                            </h2>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <div className="card border-info">

                                                        <div className="card-body text-center">

                                                            <h6>

                                                                Keyword Score

                                                            </h6>

                                                            <h2 className="text-info">

                                                                {data.resume.keyword_score}%

                                                            </h2>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            <hr />

                                            <h5>

                                                AI Feedback

                                            </h5>

                                            <p>

                                                {data.resume.ai_feedback || "No feedback available."}

                                            </p>

                                            <h5>

                                                Strengths

                                            </h5>

                                            <p>

                                                {data.resume.strengths || "Not Available"}

                                            </p>

                                            <h5>

                                                Weaknesses

                                            </h5>

                                            <p>

                                                {data.resume.weaknesses || "Not Available"}

                                            </p>

                                            <div className="mt-4">

                                                <a

                                                    href={`http://127.0.0.1:5000/resume/view/${data.resume.id}`}

                                                    target="_blank"

                                                    rel="noreferrer"

                                                    className="btn btn-primary me-2"

                                                >

                                                    View Resume

                                                </a>

                                                <a

                                                    href={`http://127.0.0.1:5000/resume/view/${data.resume.id}`}

                                                    download

                                                    className="btn btn-secondary"

                                                >

                                                    Download Resume

                                                </a>

                                            </div>

                                        </>

                                        :

                                        <div className="alert alert-warning">

                                            Resume Not Uploaded

                                        </div>

                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card mt-4">

                        <div className="card-header bg-dark text-white">

                            Job Details

                        </div>

                        <div className="card-body">

                            <table className="table">

                                <tbody>

                                    <tr>

                                        <th>Job Title</th>

                                        <td>{data.job.job_title}</td>

                                    </tr>

                                    <tr>

                                        <th>Location</th>

                                        <td>{data.job.location}</td>

                                    </tr>

                                    <tr>

                                        <th>Experience</th>

                                        <td>{data.job.experience}</td>

                                    </tr>

                                    <tr>

                                        <th>Employment</th>

                                        <td>{data.job.employment_type}</td>

                                    </tr>

                                    <tr>

                                        <th>Status</th>

                                        <td>

                                            <span className="badge bg-success">

                                                {data.application.application_status}

                                            </span>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="text-center mt-4">

                        <button

                            className="btn btn-success me-2"

                            onClick={() => updateStatus("Shortlisted")}

                        >

                            Shortlist

                        </button>

                        <button

                            className="btn btn-danger me-2"

                            onClick={() => updateStatus("Rejected")}

                        >

                            Reject

                        </button>

                        <button

                            className="btn btn-primary me-2"

                            onClick={() => updateStatus("Selected")}

                        >

                            Select

                        </button>

                        <button

                            className="btn btn-warning"

                            onClick={() =>

                                navigate(

                                    `/recruiter/interview/schedule/${data.application.id}`

                                )

                            }

                        >

                            Schedule Interview

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CandidateDetails;