import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import authService from "../../services/auth";

function CreateJob() {

    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    const [job, setJob] = useState({

        job_title: "",

        category: "",

        employment_type: "",

        work_mode: "",

        experience: "",

        salary_min: "",

        salary_max: "",

        openings: 1,

        location: "",

        description: "",

        required_skills: "",

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


    const handleChange = (e) => {

        setJob({

            ...job,

            [e.target.name]: e.target.value

        });

    };

    const createJob = async (e) => {

        e.preventDefault();

        try {

            await api.post(

                "/job/create",

                {

                    ...job,

                    user_id: user.id

                }

            );

            alert("Job Created Successfully");

            navigate("/recruiter/jobs");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to create job"

            );

        }

    };

    return (

        <div className="container mt-5">

            <h2>Create Job</h2>

            <form onSubmit={createJob}>

                <input className="form-control mt-3"
                    name="job_title"
                    placeholder="Job Title"
                    onChange={handleChange}
                    required
                />

                <input className="form-control mt-3"
                    name="category"
                    placeholder="Category"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    name="employment_type"
                    placeholder="Employment Type"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    name="work_mode"
                    placeholder="Work Mode"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    name="experience"
                    placeholder="Experience"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    type="number"
                    name="salary_min"
                    placeholder="Minimum Salary"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    type="number"
                    name="salary_max"
                    placeholder="Maximum Salary"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    type="number"
                    name="openings"
                    placeholder="Openings"
                    onChange={handleChange}
                />

                <input className="form-control mt-3"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                />

                <textarea
                    className="form-control mt-3"
                    rows="5"
                    name="description"
                    placeholder="Job Description"
                    onChange={handleChange}
                    required
                />

                <textarea
                    className="form-control mt-3"
                    rows="3"
                    name="required_skills"
                    placeholder="Required Skills"
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    name="qualification"
                    placeholder="Qualification"
                    onChange={handleChange}
                />

                <input
                    className="form-control mt-3"
                    type="date"
                    name="application_deadline"
                    onChange={handleChange}
                />

                <select className="form-select mt-3" name="job_type" value={job.job_type} onChange={handleChange} required>
                    <option value="Non-Tech">Non-Tech</option>
                    <option value="Tech">Tech</option>
                </select>

                {job.job_type === "Tech" && (
                    <>
                        <select className="form-select mt-3" name="test_subject_id" value={job.test_subject_id} onChange={handleChange} required>
                            <option value="">Select Mock Test Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        <input className="form-control mt-3" type="number" name="test_num_questions" value={job.test_num_questions} placeholder="Number of Questions" onChange={handleChange} min="1" required />
                    </>
                )}


                <button
                    className="btn btn-primary mt-4"
                    type="submit"
                >

                    Create Job

                </button>

            </form>

        </div>

    );

}

export default CreateJob;