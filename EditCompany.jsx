import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditCompany(){

    const { id } = useParams();

    const navigate = useNavigate();

    const [company,setCompany]=useState({

        company_name:"",

        company_email:"",

        company_phone:"",

        website:"",

        location:""

    });

    useEffect(()=>{

        loadCompany();

    },[]);

    const loadCompany=async()=>{

        const response=await api.get(

            `/company/${id}`

        );

        setCompany(response.data);

    }

    const handleChange=(e)=>{

        setCompany({

            ...company,

            [e.target.name]:e.target.value

        });

    }

    const handleSubmit=async(e)=>{

        e.preventDefault();

        await api.put(

            `/company/update/${id}`,

            company

        );

        navigate("/admin/company/list");

    }

    return(

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Company</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)} type="button">
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                <input

                    className="form-control mt-3"

                    name="company_name"

                    value={company.company_name}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="company_email"

                    value={company.company_email}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="company_phone"

                    value={company.company_phone}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="website"

                    value={company.website}

                    onChange={handleChange}

                />

                <input

                    className="form-control mt-3"

                    name="location"

                    value={company.location}

                    onChange={handleChange}

                />

                <button

                    className="btn btn-success mt-4"

                >

                    Update Company

                </button>

            </form>

        </div>

    );

}

export default EditCompany;