import { Outlet, Link } from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout() {

    return (

        <div className="admin-layout">

            <aside className="sidebar">

                <h2>

                    CareerVerse AI

                </h2>

                <ul>

                    <li>

                        <Link to="/admin/dashboard">

                            Dashboard

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/company/create">

                            Create Company

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/company/list">

                            Companies

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/recruiter/create">

                            Create Recruiter

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/recruiter/list">

                            Recruiters

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/students">

                            Students

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/jobs">

                            Jobs

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/analytics">

                            Analytics

                        </Link>

                    </li>

                    <li>

                        <Link to="/admin/settings">

                            Settings

                        </Link>

                    </li>

                </ul>

            </aside>

            <main className="admin-content">

                <Outlet />

            </main>

        </div>

    );

}

export default AdminLayout;