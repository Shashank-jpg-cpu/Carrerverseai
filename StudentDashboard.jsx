import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../services/auth";
import api from "../../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();
    const [dashboard, setDashboard] = useState({
        total_applications: 0,
        total_interviews: 0,
        ai_resume_score: 0,
        profile_completion: 0,
        placement_status: ""
    });

    const [pendingTests, setPendingTests] = useState([]);

    useEffect(() => {

        if (user) {

            loadDashboard();
            loadPendingTests();

        }

    }, []);

    const loadPendingTests = async () => {
        try {
            const res = await api.get(`/application/student/${user.id}`);
            const pending = res.data.filter(app => app.application_status === "Mock Test Pending");
            setPendingTests(pending);
        } catch (err) {
            console.error("Failed to load pending tests:", err);
        }
    };


    const loadDashboard = async () => {

        try {

            const response = await api.get(

                `/student/dashboard/${user.id}`

            );

            setDashboard(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const logout = () => {

        authService.logout();

        navigate("/login");

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center">

                <div>

                    <h2>

                        Welcome, {user?.full_name} 👋

                    </h2>

                    <p className="text-muted">

                        CareerVerse AI Student Dashboard

                    </p>

                </div>

                <button

                    className="btn btn-danger"

                    onClick={logout}

                >

                    Logout

                </button>

            </div>

            <div className="row mt-4">

                <div className="col-md-3 mb-4">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/student/applications")}

                    >

                        <h5>Applications</h5>

                        <h2>{dashboard.total_applications}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/student/interviews")}

                    >

                        <h5>Interviews</h5>

                        <h2>{dashboard.total_interviews}</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/student/resume")}

                    >

                        <h5>Resume Score</h5>

                        <h2>{dashboard.ai_resume_score}%</h2>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div

                        className="card shadow p-3"

                        style={{ cursor: "pointer" }}

                        onClick={() => navigate("/student/profile")}

                    >

                        <h5>Profile Completion</h5>

                        <h2>{dashboard.profile_completion}%</h2>

                    </div>

                </div>

            </div>

            <h4 className="mt-4 mb-3">

                Quick Actions

            </h4>

            <div className="row">

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-primary w-100"

                        onClick={() => navigate("/student/profile")}

                    >

                        👤 Update Profile

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-success w-100"

                        onClick={() => navigate("/student/resume")}

                    >

                        📄 Upload Resume

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-warning w-100"

                        onClick={() => navigate("/student/jobs")}

                    >

                        💼 Available Jobs

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-info w-100"

                        onClick={() => navigate("/student/applications")}

                    >

                        📝 My Applications

                    </button>

                </div>

            </div>

            <div className="row">

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-secondary w-100"

                        onClick={() => navigate("/student/interviews")}

                    >

                        📅 My Interviews

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-dark w-100"

                        onClick={() => navigate("/student/notifications")}

                    >

                        🔔 Notifications

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-outline-primary w-100"

                        onClick={() => navigate("/student/settings")}

                    >

                        ⚙️ Settings

                    </button>

                </div>

                <div className="col-md-3 mb-3">

                    <button

                        className="btn btn-danger w-100"

                        onClick={logout}

                    >

                        🚪 Logout

                    </button>

                </div>

            </div>

            <div className="alert alert-info mt-4">

                <strong>

                    Placement Status:

                </strong>

                {" "}

                {dashboard.placement_status || "Looking for Opportunity"}

            </div>

            {pendingTests.length > 0 && (
                <div className="card shadow mt-4 border-warning rounded-3">
                    <div className="card-header bg-warning text-dark fw-bold">
                        📅 Scheduled Mock Tests
                    </div>
                    <div className="card-body p-0">
                        <ul className="list-group list-group-flush mb-0">
                            {pendingTests.map(test => (
                                <li key={test.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <div>
                                        <h6 className="mb-1 fw-bold">{test.job_title}</h6>
                                        <p className="mb-0 text-muted small">
                                            Subject: <strong className="text-primary">{test.test_subject_name || "Python & SQL"}</strong> | Questions: <strong>{test.test_num_questions}</strong>
                                        </p>
                                    </div>
                                    <button 
                                        className="btn btn-warning btn-sm fw-bold px-3 shadow-sm"
                                        onClick={() => navigate(`/student/take-test/${test.id}`)}
                                    >
                                        Attend Mock Test
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}


        </div>

    );

}

export default StudentDashboard;