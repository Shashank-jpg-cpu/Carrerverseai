import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function CompanyList() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    useEffect(() => {

        loadCompanies();

    }, []);

    const loadCompanies = async () => {

        try {

            const response = await api.get("/company/all");

            setCompanies(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteCompany = async (id) => {

        const confirmDelete = window.confirm(

            "Are you sure you want to delete this company?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(

                `/company/delete/${id}`

            );

            loadCompanies();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Company Management

            </h2>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Location</th>

                        <th width="180">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        companies.map(company => (

                            <tr key={company.id}>

                                <td>{company.id}</td>

                                <td>{company.company_name}</td>

                                <td>{company.company_email}</td>

                                <td>{company.location}</td>

                                <td>

                                    <button

                                        className="btn btn-warning btn-sm me-2"

                                        onClick={() =>

                                            navigate(

                                                `/admin/company/edit/${company.id}`

                                            )

                                        }

                                    >

                                        Edit

                                    </button>

                                    <button

                                        className="btn btn-danger btn-sm"

                                        onClick={() =>

                                            deleteCompany(company.id)

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

export default CompanyList;