import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {

    return (

        <div className="sidebar">

            <h3 className="text-center mt-3">

                CareerVerse AI

            </h3>

            <ul className="list-unstyled mt-4">

                <li>

                    <NavLink

                        to="/admin/dashboard"

                    >

                        📊 Dashboard

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/students"

                    >

                        👨‍🎓 Students

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/company/list"

                    >

                        🏢 Companies

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/company/create"

                    >

                        ➕ Add Company

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/recruiter/list"

                    >

                        👨‍💼 Recruiters

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/recruiter/create"

                    >

                        ➕ Add Recruiter

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/job/list"

                    >

                        💼 Jobs

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/job/create"

                    >

                        ➕ Create Job

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/applications"

                    >

                        📄 Applications

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/interviews"

                    >

                        📅 Interviews

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/analytics"

                    >

                        📈 Analytics

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/admin/settings"

                    >

                        ⚙️ Settings

                    </NavLink>

                </li>

                <li>

                    <NavLink

                        to="/"

                    >

                        🚪 Logout

                    </NavLink>

                </li>

            </ul>

        </div>

    );

}

export default Sidebar;