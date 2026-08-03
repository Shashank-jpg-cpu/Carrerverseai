import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditJob() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState({

        job_title: "",

        category: "",

        employment_type: "",

        work_mode: "",

        experience: "",

        salary_min: "",

        salary_max: "",

        openings: "",

        location: "",

        description: "",

        required_skills: "",

        preferred_skills: "",

        qualification: "",

        application_deadline: "",

        job_type: "Non-Tech",

        test_subject_id: "",

        test_num_questions: 10

    });

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get("/test/subjects");
                setSubjects(res.data);
            } catch (err) {
                console.error("Failed to load subjects:", err);
            }
        };
        fetchSubjects();
    }, []);


    useEffect(() => {

        loadJob();

    }, []);

    const loadJob = async () => {

        try {

            const response = await api.get(

                `/job/${id}`

            );

            setJob(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setJob({

            ...job,

            [e.target.name]: e.target.value

        });

    };

    const updateJob = async (e) => {

        e.preventDefault();

        try {

            await api.put(

                `/job/update/${id}`,

                job

            );

            alert("Job Updated Successfully");

            navigate("/recruiter/jobs");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to update job"

            );

        }

    };

    return (

        <div className="container mt-5">

            <h2>Edit Job</h2>

            <form onSubmit={updateJob}>

                <input
                    className="form-control mt-3"
                    name="job_title"
                    value={job.job_title}
                    onChange={handleChange}
                    placeholder="Job Title"
                />

                <input
                    className="form-control mt-3"
                    name="category"
                    value={job.category}
                    onChange={handleChange}
                    placeholder="Category"
                />

                <input
                    className="form-control mt-3"
                    name="employment_type"
                    value={job.employment_type}
                    onChange={handleChange}
                    placeholder="Employment Type"
                />

                <input
                    className="form-control mt-3"
                    name="work_mode"
                    value={job.work_mode}
                    onChange={handleChange}
                    placeholder="Work Mode"
                />

                <input
                    className="form-control mt-3"
                    name="experience"
                    value={job.experience}
                    onChange={handleChange}
                    placeholder="Experience"
                />

                <input
                    className="form-control mt-3"
                    type="number"
                    name="salary_min"
                    value={job.salary_min}
                    onChange={handleChange}
                    placeholder="Minimum Salary"
                />

                <input
                    className="form-control mt-3"
                    type="number"
                    name="salary_max"
                    value={job.salary_max}
                    onChange={handleChange}
                    placeholder="Maximum Salary"
                />

                <input
                    className="form-control mt-3"
                    type="number"
                    name="openings"
                    value={job.openings}
                    onChange={handleChange}
                    placeholder="Openings"
                />

                <input
                    className="form-control mt-3"
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    placeholder="Location"
                />

                <textarea
                    className="form-control mt-3"
                    rows="5"
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    placeholder="Description"
                />

                <textarea
                    className="form-control mt-3"
                    rows="3"
                    name="required_skills"
                    value={job.required_skills}
                    onChange={handleChange}
                    placeholder="Required Skills"
                />

                <textarea
                    className="form-control mt-3"
                    rows="3"
                    name="preferred_skills"
                    value={job.preferred_skills}
                    onChange={handleChange}
                    placeholder="Preferred Skills"
                />

                <input
                    className="form-control mt-3"
                    name="qualification"
                    value={job.qualification}
                    onChange={handleChange}
                    placeholder="Qualification"
                />

                <input
                    className="form-control mt-3"
                    type="date"
                    name="application_deadline"
                    value={job.application_deadline || ""}
                    onChange={handleChange}
                />

                <select className="form-select mt-3" name="job_type" value={job.job_type || "Non-Tech"} onChange={handleChange} required>
                    <option value="Non-Tech">Non-Tech</option>
                    <option value="Tech">Tech</option>
                </select>

                {job.job_type === "Tech" && (
                    <>
                        <select className="form-select mt-3" name="test_subject_id" value={job.test_subject_id || ""} onChange={handleChange} required>
                            <option value="">Select Mock Test Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <input className="form-control mt-3" type="number" name="test_num_questions" value={job.test_num_questions || 10} placeholder="Number of Questions" onChange={handleChange} min="1" required />
                    </>
                )}


                <button

                    className="btn btn-success mt-4"

                    type="submit"

                >

                    Update Job

                </button>

            </form>

        </div>

    );

}

export default EditJob;