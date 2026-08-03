import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function StudentList() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    useEffect(() => {

        loadStudents();

    }, []);

    const loadStudents = async () => {

        try {

            const response = await api.get("/student/all");

            setStudents(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteStudent = async (id) => {

        if (!window.confirm("Delete this student?")) {

            return;

        }

        try {

            await api.delete(`/student/delete/${id}`);

            loadStudents();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container mt-5">

            <h2>

                Student Management

            </h2>

            <table className="table table-bordered table-hover mt-4">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>USN</th>

                        <th>Department</th>

                        <th>CGPA</th>

                        <th width="180">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        students.map(student => (

                            <tr key={student.id}>

                                <td>{student.id}</td>

                                <td>{student.full_name}</td>

                                <td>{student.email}</td>

                                <td>{student.usn}</td>

                                <td>{student.department}</td>

                                <td>{student.cgpa}</td>

                                <td>

                                    <button

                                        className="btn btn-warning btn-sm me-2"

                                        onClick={() =>

                                            navigate(

                                                `/admin/student/${student.id}`

                                            )

                                        }

                                    >

                                        View

                                    </button>

                                    <button

                                        className="btn btn-danger btn-sm"

                                        onClick={() =>

                                            deleteStudent(student.id)

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

export default StudentList;