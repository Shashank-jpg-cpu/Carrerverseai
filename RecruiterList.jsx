import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function RecruiterList() {

    const navigate = useNavigate();

    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {

        loadRecruiters();

    }, []);

    const loadRecruiters = async () => {

        try {

            const response = await api.get("/recruiter/all");

            setRecruiters(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteRecruiter = async (id) => {

        const confirmDelete = window.confirm(

            "Delete Recruiter?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(

                `/recruiter/delete/${id}`

            );

            loadRecruiters();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Recruiter Management

            </h2>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Company ID</th>

                        <th>Designation</th>

                        <th>Department</th>

                        <th>Experience</th>

                        <th width="180">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        recruiters.map(recruiter => (

                            <tr key={recruiter.id}>

                                <td>{recruiter.id}</td>

                                <td>{recruiter.company_id}</td>

                                <td>{recruiter.designation}</td>

                                <td>{recruiter.department}</td>

                                <td>{recruiter.experience}</td>

                                <td>

                                    <button

                                        className="btn btn-warning btn-sm me-2"

                                        onClick={() =>

                                            navigate(

                                                `/admin/recruiter/edit/${recruiter.id}`

                                            )

                                        }

                                    >

                                        Edit

                                    </button>

                                    <button

                                        className="btn btn-danger btn-sm"

                                        onClick={() =>

                                            deleteRecruiter(recruiter.id)

                                        }

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default RecruiterList;