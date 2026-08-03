import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function TakeTest() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    // Loading & Status States
    const [loading, setLoading] = useState(true);
    const [cameraAllowed, setCameraAllowed] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [jobDetails, setJobDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    
    // Quiz Progress States
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [tabSwitches, setTabSwitches] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    
    // Result States
    const [testCompleted, setTestCompleted] = useState(false);
    const [result, setResult] = useState(null);

    // Refs
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // 1. Request Camera and Load Data on Mount
    useEffect(() => {
        const startCameraAndLoad = async () => {
            try {
                // Request camera permission
                const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
});

console.log("Stream:", stream);
console.log("Tracks:", stream.getVideoTracks());

streamRef.current = stream;

if (videoRef.current) {
    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = async () => {
        console.log("Metadata loaded");

        try {
            await videoRef.current.play();
            console.log("Video playing");
        } catch (e) {
            console.error("Play failed:", e);
        }
    };
}
                streamRef.current = stream;
                setCameraAllowed(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraAllowed(false);
                setCameraError("Camera access is mandatory for this proctored test. Please enable your webcam and refresh.");
            }

            try {
                // Fetch Application Details
                const appRes = await api.get(`/application/${applicationId}`);
                const jobId = appRes.data.job_id;

                // Fetch Job Details (to show title/info)
                const jobRes = await api.get(`/job/${jobId}`);
                setJobDetails(jobRes.data);

                // Fetch Test Questions
                const questionsRes = await api.get(`/test/job/${jobId}`);
                setQuestions(questionsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load test resources:", err);
                setLoading(false);
            }
        };

        startCameraAndLoad();

        // Cleanup camera stream on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [applicationId]);

    // 2. Tab Switching Proctoring Listener
    useEffect(() => {
        if (testCompleted || loading || !cameraAllowed) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerCheatWarning();
            }
        };

        const handleWindowBlur = () => {
            triggerCheatWarning();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [tabSwitches, testCompleted, loading, cameraAllowed]);

    const triggerCheatWarning = () => {
        setTabSwitches(prev => {
            const nextVal = prev + 1;
            if (nextVal >= 4) {
                // Auto fail
                autoFailTest();
                return nextVal;
            } else {
                setShowWarning(true);
                // Auto hide warning after 5 seconds
                setTimeout(() => {
                    setShowWarning(false);
                }, 5000);
                return nextVal;
            }
        });
    };

    const autoFailTest = async () => {
        // Automatically submit with 0 score and disqualified status
        try {
            setTestCompleted(true);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const res = await api.post(`/test/application/${applicationId}/submit`, {
                answers: {},
                tab_switch_count: tabSwitches + 1,
                terminated_due_to_cheating: true
            });
            setResult(res.data);
        } catch (error) {
            console.error("Failed to submit disqualified test:", error);
        }
    };

    const handleOptionSelect = (qId, option) => {
        setAnswers({
            ...answers,
            [qId]: option
        });
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit your mock test?")) return;

        try {
            setTestCompleted(true);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const res = await api.post(`/test/application/${applicationId}/submit`, {
                answers: answers,
                tab_switch_count: tabSwitches,
                terminated_due_to_cheating: false
            });
            setResult(res.data);
        } catch (error) {
            console.error("Failed to submit test:", error);
            alert("Error submitting mock test answers. Please try again.");
            setTestCompleted(false);
        }
    };

    if (cameraError) {
        return (
            <div className="container mt-5 text-center" style={{ maxWidth: "600px" }}>
                <div className="alert alert-danger p-4 shadow rounded-4">
                    <h3 className="fw-bold mb-3">🔒 Proctoring Error</h3>
                    <p className="lead">{cameraError}</p>
                    <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                        Retry Camera Permission
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Mock Test...</span>
                </div>
                <h4 className="mt-3 text-muted">Securing environment & loading questions...</h4>
            </div>
        );
    }

    if (testCompleted) {
        return (
            <div className="container mt-5" style={{ maxWidth: "650px" }}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div className="card-header bg-gradient bg-dark text-white py-3 text-center">
                        <h4 className="mb-0 fw-bold">Mock Test Result</h4>
                    </div>
                    <div className="card-body p-5 text-center">
                        {result?.passed ? (
                            <div className="mb-4">
                                <div className="display-1 text-success mb-3">🎉</div>
                                <h2 className="text-success fw-bold">Congratulations!</h2>
                                <h3 className="my-3">Score: <strong className="text-primary">{result.score}%</strong></h3>
                                <p className="text-muted lead">
                                    You have passed the mock test requirements with a score above 75%!
                                </p>
                                <div className="alert alert-success border-success mt-4">
                                    Your application has been shortlisted. The recruiter will schedule your interview shortly.
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="display-1 text-danger mb-3">😔</div>
                                <h2 className="text-danger fw-bold">Better Luck Next Time!</h2>
                                <h3 className="my-3">Score: <strong className="text-primary">{result?.score}%</strong></h3>
                                <p className="text-muted lead">
                                    You scored below the required 75% threshold to pass.
                                </p>
                                {result?.tab_switch_count >= 4 && (
                                    <div className="alert alert-danger border-danger mt-4 fw-bold">
                                        Test disqualified due to excessive tab switching.
                                    </div>
                                )}
                                <div className="alert alert-danger border-danger mt-4">
                                    Your application status is updated to Rejected. Keep practicing!
                                </div>
                            </div>
                        )}

                        <button 
                            className="btn btn-primary btn-lg mt-4 px-5 fw-bold"
                            onClick={() => navigate("/student/dashboard")}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];

    return (
        <div className="container-fluid mt-4 px-md-5">
            
            {/* Warning Overlay banner */}
            {showWarning && (
                <div className="alert alert-warning alert-dismissible fade show fixed-top m-3 shadow-lg border-warning text-center fw-bold animate-bounce" role="alert" style={{ zIndex: 1050 }}>
                    ⚠️ Tab switching detected! Warning {tabSwitches} of 3. You will be disqualified on the 4th warning!
                </div>
            )}

            <div className="row">
                
                {/* Main Quiz Area */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-100">
                        
                        <div className="card-header bg-gradient bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                            <div>
                                <span className="badge bg-warning text-dark me-2">PROCTORED TEST</span>
                                <strong className="fs-5">{jobDetails?.job_title}</strong>
                            </div>
                            <span className="badge bg-secondary p-2 fs-6">
                                Question {currentIdx + 1} of {questions.length}
                            </span>
                        </div>

                        <div className="card-body p-4 bg-light">
                            {/* Question text */}
                            <h4 className="fw-bold mb-4">{currentQuestion?.question_text}</h4>

                            {/* Code snippet block if any */}
                            {currentQuestion?.code_snippet && (
                                <pre className="p-3 border rounded-3 font-monospace text-white bg-dark mb-4 overflow-auto" style={{ maxHeight: "300px" }}>
                                    <code>{currentQuestion.code_snippet}</code>
                                </pre>
                            )}

                            {/* Multiple choice options */}
                            <div className="row g-3">
                                {[
                                    { key: "A", val: currentQuestion?.option_a },
                                    { key: "B", val: currentQuestion?.option_b },
                                    { key: "C", val: currentQuestion?.option_c },
                                    { key: "D", val: currentQuestion?.option_d }
                                ].map((opt) => (
                                    <div className="col-12" key={opt.key}>
                                        <div 
                                            className={`card border-2 p-3 rounded-3 cursor-pointer select-option-card ${answers[currentQuestion.id] === opt.key ? "border-primary bg-primary bg-opacity-10" : "border-muted"}`}
                                            onClick={() => handleOptionSelect(currentQuestion.id, opt.key)}
                                            style={{ cursor: "pointer", transition: "all 0.2s" }}
                                        >
                                            <div className="form-check d-flex align-items-center">
                                                <input 
                                                    className="form-check-input me-3" 
                                                    type="radio" 
                                                    name={`q-${currentQuestion.id}`} 
                                                    id={`opt-${opt.key}`} 
                                                    value={opt.key}
                                                    checked={answers[currentQuestion.id] === opt.key}
                                                    onChange={() => handleOptionSelect(currentQuestion.id, opt.key)}
                                                />
                                                <label className="form-check-label fs-5 fw-medium w-100" htmlFor={`opt-${opt.key}`} style={{ cursor: "pointer" }}>
                                                    <span className="fw-bold me-2">{opt.key}.</span> {opt.val}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="card-footer bg-white p-3 d-flex justify-content-between">
                            <button 
                                className="btn btn-outline-secondary fw-bold px-4" 
                                onClick={handlePrev}
                                disabled={currentIdx === 0}
                            >
                                ⬅️ Previous
                            </button>

                            {currentIdx === questions.length - 1 ? (
                                <button 
                                    className="btn btn-success fw-bold px-5 shadow" 
                                    onClick={handleSubmit}
                                >
                                    Submit Test 🚀
                                </button>
                            ) : (
                                <button 
                                    className="btn btn-primary fw-bold px-4" 
                                    onClick={handleNext}
                                >
                                    Next ➡️
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Proctoring Stats & Camera */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-danger text-white py-3 text-center fw-bold">
                            👁️ Live Proctoring Status
                        </div>
                        <div className="card-body bg-light text-center p-4">
                            
                            {/* Live video feed */}
                            <div className="ratio ratio-4x3 border border-3 border-danger rounded-4 overflow-hidden shadow-sm bg-black mb-3 mx-auto" style={{ maxWidth: "280px" }}>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="object-fit-cover"
                                    style={{ transform: "scaleX(-1)" }} // Mirror image
                                />
                            </div>

                            <p className="fw-bold text-success mb-2">● Camera Online</p>
                            <p className="text-muted small">Your face is being monitored to prevent cheating.</p>

                            <hr />

                            {/* Warning Indicator */}
                            <div className="alert alert-light border shadow-sm p-3 rounded-3 mb-0">
                                <h6 className="fw-bold text-dark">Cheat Prevention warnings:</h6>
                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    {[1, 2, 3].map((warning) => (
                                        <div 
                                            key={warning}
                                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${tabSwitches >= warning ? "bg-danger text-white animate-pulse" : "bg-secondary text-light"}`}
                                            style={{ width: "38px", height: "38px", border: "2px solid white" }}
                                        >
                                            {warning}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-danger small mt-2 fw-semibold mb-0">
                                    Tab switches: {tabSwitches} / 3 allowed.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TakeTest;