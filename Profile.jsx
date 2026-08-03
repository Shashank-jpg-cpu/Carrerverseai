import { useEffect, useState } from "react";

import authService from "../../services/auth";
import api from "../../services/api";

function Profile() {

    const user = authService.getCurrentUser();

    const [profile, setProfile] = useState({

        college: "",

        university: "",

        degree: "",

        branch: "",

        semester: "",

        cgpa: "",

        skills: "",

        linkedin: "",

        github: "",

        portfolio: "",

        profile_summary: ""

    });

    const [message, setMessage] = useState("");

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const response = await api.get(

                `/student/profile/${user.id}`

            );

            setProfile(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put(

                `/student/profile/update/${user.id}`,

                profile

            );

            setMessage(response.data.message);

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Unable to update profile."

            );

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                My Profile

            </h2>

            {

                message &&

                <div className="alert alert-success mt-3">

                    {message}

                </div>

            }

            <form
                className="mt-4"
                onSubmit={updateProfile}
            >

                <input

                    className="form-control mb-3"

                    name="college"

                    placeholder="College"

                    value={profile.college}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="university"

                    placeholder="University"

                    value={profile.university}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="degree"

                    placeholder="Degree"

                    value={profile.degree}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="branch"

                    placeholder="Branch"

                    value={profile.branch}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    type="number"

                    name="semester"

                    placeholder="Semester"

                    value={profile.semester}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    type="number"

                    step="0.01"

                    name="cgpa"

                    placeholder="CGPA"

                    value={profile.cgpa}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mb-3"

                    rows="3"

                    name="skills"

                    placeholder="Skills"

                    value={profile.skills}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="linkedin"

                    placeholder="LinkedIn"

                    value={profile.linkedin}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="github"

                    placeholder="GitHub"

                    value={profile.github}

                    onChange={handleChange}

                />

                <input

                    className="form-control mb-3"

                    name="portfolio"

                    placeholder="Portfolio"

                    value={profile.portfolio}

                    onChange={handleChange}

                />

                <textarea

                    className="form-control mb-3"

                    rows="4"

                    name="profile_summary"

                    placeholder="Profile Summary"

                    value={profile.profile_summary}

                    onChange={handleChange}

                />

                <button

                    className="btn btn-primary"

                    type="submit"

                >

                    Save Profile

                </button>

            </form>

        </div>

    );

}

export default Profile;