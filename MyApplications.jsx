import { useEffect, useState } from "react";
import api from "../../services/api";
import authService from "../../services/auth";

function MyApplications() {

    const [applications, setApplications] = useState([]);

    const user = authService.getCurrentUser();
    console.log("Current User:", user)

    useEffect(() => {

        if (user) {

            loadApplications();

        }

    }, []);

  const loadApplications = async () => {

    console.log("Loading applications...");

    console.log("Current User:", user);

    const response = await api.get(`/application/student/${user.id}`);

    console.log("API Response:", response.data);

    setApplications(response.data);
};
    return (

        <div className="container mt-5">

            <h2 className="mb-4">

                My Applications

            </h2>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>Job Title</th>

                        <th>Status</th>

                        <th>Applied On</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        applications.length === 0 ?

                        (

                            <tr>

                                <td colSpan="3" className="text-center">

                                    No Applications Found

                                </td>

                            </tr>

                        )

                        :

                        (

                            applications.map((application) => (

                                <tr key={application.id}>

                                    <td>

                                        {application.job_title}

                                    </td>

                                    <td>

                                        <span className="badge bg-primary">

                                            {application.application_status}

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            application.applied_at ?

                                            new Date(

                                                application.applied_at

                                            ).toLocaleDateString()

                                            :

                                            "-"

                                        }

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default MyApplications;