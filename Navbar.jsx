import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {

    const { user, logout } = useAuth();

    const getDashboardLink = () => {

        if (!user) return "/";

        switch (user.role) {

            case "Student":
                return "/student/dashboard";

            case "Recruiter":
                return "/recruiter/dashboard";

            case "Company":
                return "/company/dashboard";

            case "Admin":
                return "/admin/dashboard";

            default:
                return "/";
        }

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">

            <div className="container">

                <Link

                    className="navbar-brand fw-bold"

                    to="/"

                >

                    CareerVerse AI

                </Link>

                <button

                    className="navbar-toggler"

                    type="button"

                    data-bs-toggle="collapse"

                    data-bs-target="#navbar"

                >

                    <span className="navbar-toggler-icon"></span>

                </button>

                <div

                    className="collapse navbar-collapse"

                    id="navbar"

                >

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">

                            <Link

                                className="nav-link"

                                to="/"

                            >

                                Home

                            </Link>

                        </li>

                        {

                            !user &&

                            <>

                                <li className="nav-item">

                                    <Link

                                        className="nav-link"

                                        to="/login"

                                    >

                                        Login

                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <Link

                                        className="nav-link"

                                        to="/register"

                                    >

                                        Register

                                    </Link>

                                </li>

                            </>

                        }

                        {

                            user &&

                            <>

                                <li className="nav-item">

                                    <Link

                                        className="nav-link"

                                        to={getDashboardLink()}

                                    >

                                        Dashboard

                                    </Link>

                                </li>

                                <li className="nav-item">

                                    <button

                                        className="btn btn-warning ms-3"

                                        onClick={logout}

                                    >

                                        Logout

                                    </button>

                                </li>

                            </>

                        }

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;