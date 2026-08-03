import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddQuestion() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [isAddingSubject, setIsAddingSubject] = useState(false);

    const [form, setForm] = useState({
        subject_id: "",
        question_text: "",
        code_snippet: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A"
    });

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const res = await api.get("/test/subjects");
            setSubjects(res.data);
        } catch (error) {
            console.error("Failed to load subjects", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateSubject = async () => {
        if (!newSubject.trim()) return alert("Subject name cannot be empty");
        try {
            const res = await api.post("/test/subjects/create", { name: newSubject.trim() });
            alert("Subject Created Successfully");
            setNewSubject("");
            setIsAddingSubject(false);
            loadSubjects();
            setForm({
                ...form,
                subject_id: res.data.subject.id
            });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create subject");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject_id) return alert("Please select a subject");
        try {
            await api.post("/test/questions/create", form);
            alert("Mock Question Added Successfully");
            setForm({
                subject_id: form.subject_id,
                question_text: "",
                code_snippet: "",
                option_a: "",
                option_b: "",
                option_c: "",
                option_d: "",
                correct_option: "A"
            });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add question");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "700px" }}>
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-gradient bg-primary text-white py-3 text-center">
                    <h3 className="mb-0 fw-bold">➕ Add Mock Test Questions</h3>
                </div>
                <div className="card-body p-4 bg-light">
                    
                    {/* Subject Block */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Subject</label>
                        {!isAddingSubject ? (
                            <div className="d-flex gap-2">
                                <select 
                                    className="form-select" 
                                    name="subject_id" 
                                    value={form.subject_id} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-success text-nowrap"
                                    onClick={() => setIsAddingSubject(true)}
                                >
                                    New Subject
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter subject name (e.g. C#)" 
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handleCreateSubject}
                                >
                                    Save
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-danger"
                                    onClick={() => setIsAddingSubject(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        {/* Question Text */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Question Text</label>
                            <textarea 
                                className="form-control" 
                                name="question_text" 
                                rows="3" 
                                value={form.question_text} 
                                onChange={handleChange} 
                                placeholder="Enter the mock question..." 
                                required
                            />
                        </div>

                        {/* Code Snippet (Optional) */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Code Snippet (Optional)</label>
                            <textarea 
                                className="form-control font-monospace" 
                                name="code_snippet" 
                                rows="4" 
                                value={form.code_snippet} 
                                onChange={handleChange} 
                                placeholder={`e.g.\nx = 2\ny = 3\nprint(x ^ y)`} 
                                style={{ backgroundColor: "#2d3748", color: "#a0aec0" }}
                            />
                        </div>

                        {/* Options */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Option A</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="option_a" 
                                    value={form.option_a} 
                                    onChange={handleChange} 
                                    placeholder="Option A value" 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Option B</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="option_b" 
                                    value={form.option_b} 
                                    onChange={handleChange} 
                                    placeholder="Option B value" 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Option C</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="option_c" 
                                    value={form.option_c} 
                                    onChange={handleChange} 
                                    placeholder="Option C value" 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Option D</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="option_d" 
                                    value={form.option_d} 
                                    onChange={handleChange} 
                                    placeholder="Option D value" 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Correct Option */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Correct Option</label>
                            <select 
                                className="form-select" 
                                name="correct_option" 
                                value={form.correct_option} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                            </select>
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex gap-3 justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-secondary px-4"
                                onClick={() => navigate("/recruiter/dashboard")}
                            >
                                Back to Dashboard
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-4 fw-bold"
                            >
                                Submit Question
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddQuestion;
