import { useEffect, useState } from "react";
import api from "../../services/api";
import authService from "../../services/auth";

function AvailableJobs() {

    const user = authService.getCurrentUser();

    const [jobs, setJobs] = useState([]);

    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {

        loadJobs();

        loadApplications();

    }, []);

    const loadJobs = async () => {

        try {

            const response = await api.get("/job/all");

            setJobs(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const loadApplications = async () => {

        try {

            const response = await api.get(

                `/application/student/${user.id}`

            );

            const applied = response.data.map(

                application => application.job_id

            );

            setAppliedJobs(applied);

        }

        catch (error) {

            console.log(error);

        }

    };

    const applyJob = async (jobId) => {

        try {

            const response = await api.post(

                "/application/apply",

                {

                    student_id: user.id,

                    job_id: jobId

                }

            );

            const appliedJobDetails = jobs.find(j => j.id === jobId);
            if (appliedJobDetails && appliedJobDetails.job_type === "Tech") {
                alert("Application Submitted! Since this is a Tech job, you must clear a Mock Test. The test is now scheduled on your Dashboard.");
            } else {
                alert("Application Submitted Successfully");
            }

            setAppliedJobs(

                [...appliedJobs, jobId]

            );

        }

        catch (error) {

            console.log(error.response?.data);

            alert(

                error.response?.data?.message ||

                "Unable to Apply"

            );

        }

    };

    return (

        <div className="container mt-5">

            <h2 className="mb-4">

                Available Jobs

            </h2>

            <div className="row">

                {

                    jobs.map(job => (

                        <div

                            className="col-lg-4 mb-4"

                            key={job.id}

                        >

                            <div className="card shadow h-100">

                                <div className="card-body">

                                    <h4>

                                        {job.job_title}

                                    </h4>

                                    <hr/>

                                    <p>

                                        <b>Job Code :</b>

                                        {" "}

                                        {job.job_code}

                                    </p>

                                    <p>

                                        <b>Location :</b>

                                        {" "}

                                        {job.location}

                                    </p>

                                    <p>

                                        <b>Experience :</b>

                                        {" "}

                                        {job.experience}

                                    </p>

                                    <p>

                                        <b>Employment :</b>

                                        {" "}

                                        {job.employment_type}

                                    </p>

                                    <p>

                                        <b>Work Mode :</b>

                                        {" "}

                                        {job.work_mode}

                                    </p>

                                    <p>

                                        <b>Salary :</b>

                                        {" "}

                                        ₹{job.salary_min}

                                        -

                                        ₹{job.salary_max}

                                    </p>

                                    <p>

                                        <b>Skills :</b>

                                        {" "}

                                        {job.required_skills}

                                    </p>

                                    <p>

                                        <b>Qualification :</b>

                                        {" "}

                                        {job.qualification}

                                    </p>

                                    <p>

                                        <b>Deadline :</b>

                                        {" "}

                                        {job.application_deadline}

                                    </p>

                                    <p>

                                        {job.description}

                                    </p>

                                    {

                                        appliedJobs.includes(job.id)

                                        ?

                                        <button

                                            className="btn btn-success w-100"

                                            disabled

                                        >

                                            ✓ Applied

                                        </button>

                                        :

                                        <button

                                            className="btn btn-primary w-100"

                                            onClick={() => applyJob(job.id)}

                                        >

                                            Apply Now

                                        </button>

                                    }

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default AvailableJobs;