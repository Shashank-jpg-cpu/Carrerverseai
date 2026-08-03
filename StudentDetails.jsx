import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

function StudentDetails() {

    const { id } = useParams();

    const [student, setStudent] = useState({});

    useEffect(() => {

        loadStudent();

    }, []);

    const loadStudent = async () => {

        try {

            const response = await api.get(

                `/student/${id}`

            );

            setStudent(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Student Details

            </h2>

            <table className="table table-bordered mt-4">

                <tbody>

                    <tr>

                        <th>Name</th>

                        <td>{student.full_name}</td>

                    </tr>

                    <tr>

                        <th>Email</th>

                        <td>{student.email}</td>

                    </tr>

                    <tr>

                        <th>USN</th>

                        <td>{student.usn}</td>

                    </tr>

                    <tr>

                        <th>Department</th>

                        <td>{student.department}</td>

                    </tr>

                    <tr>

                        <th>CGPA</th>

                        <td>{student.cgpa}</td>

                    </tr>

                </tbody>

            </table>

        </div>

    );

}

export default StudentDetails;