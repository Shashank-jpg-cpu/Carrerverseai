import { useState } from "react";
import api from "../../services/api";
import authService from "../../services/auth";

function Resume() {

    const user = authService.getCurrentUser();

    const [resume, setResume] = useState(null);

    const uploadResume = async (e) => {

        e.preventDefault();

        if (!resume) {

            alert("Please select a resume.");

            return;

        }

        const formData = new FormData();

        formData.append("resume", resume);

        formData.append("student_id", user.id);

        try {

            const response = await api.post(

                "/resume/upload",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            alert(

                response.data.message ||

                "Resume Uploaded Successfully"

            );

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Upload Failed"

            );

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Upload Resume

            </h2>

            <form onSubmit={uploadResume}>

                <input

                    type="file"

                    className="form-control mt-3"

                    accept=".pdf,.doc,.docx"

                    onChange={(e) =>

                        setResume(

                            e.target.files[0]

                        )

                    }

                />

                <button

                    className="btn btn-success mt-4"

                >

                    Upload Resume

                </button>

            </form>

        </div>

    );

}

export default Resume;