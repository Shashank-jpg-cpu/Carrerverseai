import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function CompanyDashboard() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [dashboard, setDashboard] = useState({

        company_name: "",

        industry: "",

        location: "",

        website: "",

        company_size: "",

        verified: false,

        total_recruiters: 0,

        active_jobs: 0,

        applications: 0,

        shortlisted: 0,

        rejected: 0,

        selected: 0,

        interviews: 0,

        completed_interviews: 0,

        hiring_rate: 0

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await api.get(

                `/company/dashboard/${user.id}`

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

                        {dashboard.company_name}

                    </h2>

                    <p className="text-muted">

                        Company Dashboard

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

                    <div className="card shadow p-3">

                        <h6>Recruiters</h6>

                        <h2>

                            {dashboard.total_recruiters}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow p-3">

                        <h6>Active Jobs</h6>

                        <h2>

                            {dashboard.active_jobs}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow p-3">

                        <h6>Applications</h6>

                        <h2>

                            {dashboard.applications}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card shadow p-3">

                        <h6>Hiring Rate</h6>

                        <h2>

                            {dashboard.hiring_rate}%

                        </h2>

                    </div>

                </div>

            </div>

            <div className="row">
                                <div className="col-md-3 mb-3">

                    <div className="card border-info shadow p-3">

                        <h6>Shortlisted</h6>

                        <h2>

                            {dashboard.shortlisted}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-danger shadow p-3">

                        <h6>Rejected</h6>

                        <h2>

                            {dashboard.rejected}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-success shadow p-3">

                        <h6>Selected</h6>

                        <h2>

                            {dashboard.selected}

                        </h2>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card border-warning shadow p-3">

                        <h6>Interviews</h6>

                        <h2>

                            {dashboard.interviews}

                        </h2>

                    </div>

                </div>

            </div>

            <div className="row mt-3">

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">

                            Company Information

                        </div>

                        <div className="card-body">

                            <p>

                                <b>Company</b>

                                <br />

                                {dashboard.company_name}

                            </p>

                            <p>

                                <b>Industry</b>

                                <br />

                                {dashboard.industry}

                            </p>

                            <p>

                                <b>Location</b>

                                <br />

                                {dashboard.location}

                            </p>

                            <p>

                                <b>Website</b>

                                <br />

                                {dashboard.website}

                            </p>

                            <p>

                                <b>Company Size</b>

                                <br />

                                {dashboard.company_size}

                            </p>

                            <p>

                                <b>Verified</b>

                                <br />

                                {

                                    dashboard.verified

                                        ?

                                        <span className="badge bg-success">

                                            Verified

                                        </span>

                                        :

                                        <span className="badge bg-warning">

                                            Pending

                                        </span>

                                }

                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-header bg-success text-white">

                            Recruiters

                        </div>

                        <div className="card-body">

                            <h1 className="text-center">

                                {dashboard.total_recruiters}

                            </h1>

                            <p className="text-center">

                                Recruiters Working

                            </p>

                            <button

                                className="btn btn-success w-100"

                                onClick={() => navigate("/company/recruiters")}

                            >

                                View Recruiters

                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-header bg-dark text-white">

                            Hiring Progress

                        </div>

                        <div className="card-body">

                            <div className="progress mb-3">

                                <div

                                    className="progress-bar"

                                    style={{

                                        width: `${dashboard.hiring_rate}%`

                                    }}

                                >

                                    {dashboard.hiring_rate}%

                                </div>

                            </div>

                            <p>

                                Overall Hiring Success Rate

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <hr />

            <h4>

                Quick Access

            </h4>

            <div className="row">
                                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-primary w-100"

                        onClick={() => navigate("/company/Profile")}

                    >

                        🏢 Company Profile

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-success w-100"

                        onClick={() => navigate("/company/jobs")}

                    >

                        💼 View Jobs

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-warning w-100"

                        onClick={() => navigate("/company/applications")}

                    >

                        📄 Applications

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-info w-100"

                        onClick={() => navigate("/company/interviews")}

                    >

                        📅 Interviews

                    </button>

                </div>

            </div>

            <hr />

            <div className="row">

                <div className="col-lg-4 mb-4">

                    <div className="card shadow h-100">

                        <div className="card-header bg-dark text-white">

                            📊 Company Analytics

                        </div>

                        <div className="card-body">

                            <p>

                                <b>Total Applications :</b>

                                {" "}

                                {dashboard.applications}

                            </p>

                            <p>

                                <b>Shortlisted :</b>

                                {" "}

                                {dashboard.shortlisted}

                            </p>

                            <p>

                                <b>Selected :</b>

                                {" "}

                                {dashboard.selected}

                            </p>

                            <p>

                                <b>Completed Interviews :</b>

                                {" "}

                                {dashboard.completed_interviews}

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

                                    Recruiter activities will appear here.

                                </li>

                                <li className="list-group-item">

                                    Hiring updates will appear here.

                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4 mb-4">

                    <div className="card shadow h-100">

                        <div className="card-header bg-info text-white">

                            🤖 AI Insights

                        </div>

                        <div className="card-body">

                            <p>

                                • Resume quality trends

                            </p>

                            <p>

                                • Hiring success prediction

                            </p>

                            <p>

                                • Top recruiter performance

                            </p>

                            <p>

                                • Skill demand analysis

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="alert alert-primary mt-4">

                <h5>

                    💡 Company Summary

                </h5>

                <p>

                    Manage your company's recruitment activities, monitor recruiter performance, track hiring statistics, analyze candidate applications, and review interview progress from a single dashboard.

                </p>

            </div>

        </div>

    );

}

export default CompanyDashboard;
            