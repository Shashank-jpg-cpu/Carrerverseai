import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [dashboard, setDashboard] = useState({

        jobs_posted: 0,

        applications: 0,

        pending: 0,

        shortlisted: 0,

        rejected: 0,

        selected: 0,

        interviews: 0,

        completed: 0,

        designation: "",

        department: "",

        experience: 0,

        verified: false

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await api.get(

                `/recruiter/dashboard/${user.id}`

            );

            setDashboard(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center">

                <div>

                    <h2>

                        Welcome, {user.full_name} 👋

                    </h2>

                    <p className="text-muted">

                        Recruiter Dashboard

                    </p>

                </div>

                <button

                    className="btn btn-danger"

                    onClick={() => {

                        authService.logout();

                        navigate("/login");

                    }}

                >

                    Logout

                </button>

            </div>

            <div className="row mt-4">

                <div className="col-md-3 mb-3">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/recruiter/jobs")}

                    >

                        <h6>Jobs Posted</h6>

                        <h2>{dashboard.jobs_posted}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/recruiter/applications")}

                    >

                        <h6>Total Applications</h6>

                        <h2>{dashboard.applications}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/recruiter/interviews")}

                    >

                        <h6>Interviews</h6>

                        <h2>{dashboard.interviews}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow p-3">

                        <h6>Total Hires</h6>

                        <h2>{dashboard.selected}</h2>

                    </div>

                </div>

            </div>

            <div className="row">

                <div className="col-md-3 mb-3">

                    <div className="card border-warning shadow p-3">

                        <h6>Pending</h6>

                        <h2>{dashboard.pending}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-info shadow p-3">

                        <h6>Shortlisted</h6>

                        <h2>{dashboard.shortlisted}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-danger shadow p-3">

                        <h6>Rejected</h6>

                        <h2>{dashboard.rejected}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-success shadow p-3">

                        <h6>Completed Interviews</h6>

                        <h2>{dashboard.completed}</h2>

                    </div>

                </div>

            </div>

            <hr />

            <h4>

                Quick Actions

            </h4>

            <div className="row">                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-primary w-100"

                        onClick={() => navigate("/recruiter/job/create")}

                    >

                        ➕ Create Job

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-success w-100"

                        onClick={() => navigate("/recruiter/jobs")}

                    >

                        📄 My Jobs

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-warning w-100"

                        onClick={() => navigate("/recruiter/applications")}

                    >

                        👨‍🎓 View Applications

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-info w-100"

                        onClick={() => navigate("/recruiter/interviews")}

                    >

                        📅 Interviews

                    </button>

                </div>

            </div>

            <div className="row mt-2">
                <div className="col-md-3 mb-3">
                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => navigate("/recruiter/questions/add")}
                    >
                        📝 Add Mock Questions
                    </button>
                </div>
            </div>


            <hr />

            <div className="row">

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">

                            Recruiter Information

                        </div>

                        <div className="card-body">

                            <table className="table">

                                <tbody>

                                    <tr>

                                        <th>Designation</th>

                                        <td>{dashboard.designation}</td>

                                    </tr>

                                    <tr>

                                        <th>Department</th>

                                        <td>{dashboard.department}</td>

                                    </tr>

                                    <tr>

                                        <th>Experience</th>

                                        <td>{dashboard.experience} Years</td>

                                    </tr>

                                    <tr>

                                        <th>Verified</th>

                                        <td>

                                            {

                                                dashboard.verified

                                                    ?

                                                    <span className="badge bg-success">

                                                        Verified

                                                    </span>

                                                    :

                                                    <span className="badge bg-warning">

                                                        Pending Approval

                                                    </span>

                                            }

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                <div className="col-lg-6 mb-4">

                    <div className="card shadow">

                        <div className="card-header bg-success text-white">

                            Recruitment Summary

                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <strong>Total Applications</strong>

                                <div className="progress">

                                    <div

                                        className="progress-bar"

                                        style={{

                                            width: `${Math.min(dashboard.applications * 10, 100)}%`

                                        }}

                                    >

                                        {dashboard.applications}

                                    </div>

                                </div>

                            </div>

                            <div className="mb-3">

                                <strong>Shortlisted</strong>

                                <div className="progress">

                                    <div

                                        className="progress-bar bg-info"

                                        style={{

                                            width: `${Math.min(dashboard.shortlisted * 10, 100)}%`

                                        }}

                                    >

                                        {dashboard.shortlisted}

                                    </div>

                                </div>

                            </div>

                            <div className="mb-3">

                                <strong>Selected</strong>

                                <div className="progress">

                                    <div

                                        className="progress-bar bg-success"

                                        style={{

                                            width: `${Math.min(dashboard.selected * 10, 100)}%`

                                        }}

                                    >

                                        {dashboard.selected}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <hr />

            <div className="row">                <div className="col-lg-4 mb-4">

                    <div className="card shadow h-100">

                        <div className="card-header bg-dark text-white">

                            📊 Analytics

                        </div>

                        <div className="card-body">

                            <p>

                                <b>Pending Applications:</b>

                                {" "}

                                {dashboard.pending}

                            </p>

                            <p>

                                <b>Rejected Applications:</b>

                                {" "}

                                {dashboard.rejected}

                            </p>

                            <p>

                                <b>Completed Interviews:</b>

                                {" "}

                                {dashboard.completed}

                            </p>

                            <p>

                                <b>Total Hires:</b>

                                {" "}

                                {dashboard.selected}

                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4 mb-4">

                    <div className="card shadow h-100">

                        <div className="card-header bg-warning">

                            🔔 Notifications

                        </div>

                        <div className="card-body">

                            <ul className="list-group">

                                <li className="list-group-item">

                                    New applications will appear here.

                                </li>

                                <li className="list-group-item">

                                    Interview updates will appear here.

                                </li>

                                <li className="list-group-item">

                                    Selected candidates will appear here.

                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4 mb-4">

                    <div className="card shadow h-100">

                        <div className="card-header bg-info text-white">

                            📅 Upcoming

                        </div>

                        <div className="card-body">

                            <p>

                                Upcoming interviews will be displayed here.

                            </p>

                            <button

                                className="btn btn-info w-100"

                                onClick={() =>

                                    navigate("/recruiter/interviews")

                                }

                            >

                                View Interview Schedule

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <hr />

            <div className="alert alert-primary">

                <h5>

                    💡 Recruiter Tips

                </h5>

                <ul>

                    <li>

                        Review applications regularly.

                    </li>

                    <li>

                        Schedule interviews quickly for shortlisted candidates.

                    </li>

                    <li>

                        Update candidate status after every interview.

                    </li>

                    <li>

                        Select candidates to increase your hiring statistics.

                    </li>

                </ul>

            </div>

        </div>

    );

}

export default RecruiterDashboard;
            