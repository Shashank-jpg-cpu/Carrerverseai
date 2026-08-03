import { useEffect, useState } from "react";

import api from "../../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {

    const [stats, setStats] = useState({

        total_users: 0,

        total_students: 0,

        total_companies: 0,

        total_recruiters: 0,

        total_jobs: 0,

        total_applications: 0,

        total_interviews: 0,

        total_notifications: 0,

        total_resumes: 0

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await api.get(

                "/admin/dashboard"

            );

            setStats(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="admin-dashboard">

            <div className="container-fluid">

                <h1 className="mb-4">

                    Admin Dashboard

                </h1>

                <div className="row">

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Total Users</h5>

                            <h2>{stats.total_users}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Students</h5>

                            <h2>{stats.total_students}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Companies</h5>

                            <h2>{stats.total_companies}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Recruiters</h5>

                            <h2>{stats.total_recruiters}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Jobs</h5>

                            <h2>{stats.total_jobs}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Applications</h5>

                            <h2>{stats.total_applications}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Interviews</h5>

                            <h2>{stats.total_interviews}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Resumes</h5>

                            <h2>{stats.total_resumes}</h2>

                        </div>

                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h5>Notifications</h5>

                            <h2>{stats.total_notifications}</h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;