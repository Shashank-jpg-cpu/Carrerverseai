import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";

// Layout
import AdminLayout from "../layouts/AdminLayout";

// ================= ADMIN =================

import AdminDashboard from "../pages/Admin/AdminDashboard";

import CreateCompany from "../pages/Admin/CreateCompany";
import CompanyList from "../pages/Admin/CompanyList";
import EditCompany from "../pages/Admin/EditCompany";

import CreateRecruiter from "../pages/Admin/CreateRecruiter";
import RecruiterList from "../pages/Admin/RecruiterList";
import EditRecruiter from "../pages/Admin/EditRecruiter";

import StudentList from "../pages/Admin/StudentList";
import StudentDetails from "../pages/Admin/StudentDetails";

import JobList from "../pages/Admin/JobList";
import CreateJob from "../pages/Admin/CreateJob";
import EditJob from "../pages/Admin/EditJob";

import Analytics from "../pages/Admin/Analytics";
import Settings from "../pages/Admin/Settings";

// ================= STUDENT =================

import StudentDashboard from "../pages/Student/StudentDashboard";
import Profile from "../pages/Student/Profile";
import Resume from "../pages/Student/Resume";
import AvailableJobs from "../pages/Student/AvailableJobs";
import MyApplications from "../pages/Student/MyApplications";
import MyInterviews from "../pages/Student/MyInterviews";
import Notifications from "../pages/Student/Notifications";
import StudentSettings from "../pages/Student/Settings";
import TakeTest from "../pages/Student/TakeTest";


// ================= RECRUITER =================

import RecruiterDashboard from "../pages/Recruiter/RecruiterDashboard";
import MyJobs from "../pages/Recruiter/MyJobs";
import RecruiterCreateJob from "../pages/Recruiter/CreateJob";
import RecruiterEditJob from "../pages/Recruiter/EditJob";
import Applications from "../pages/Recruiter/Applications";
import ScheduleInterview from "../pages/Recruiter/ScheduleInterview";
import InterviewList from "../pages/Recruiter/InterviewList";
import EditInterview from "../pages/Recruiter/EditInterview";
import CandidateDetails from "../pages/Recruiter/CandidateDetails";
import AddQuestion from "../pages/Recruiter/AddQuestion";


// ================= COMPANY =================

import CompanyDashboard from "../pages/Company/CompanyDashboard";
import CompanyProfile from "../pages/Company/Profile";
import Recruiters from "../pages/Company/Recruiters";
import Jobs from "../pages/Company/Jobs";

export default function AppRoutes() {
    return (
        <Routes>

            {/* PUBLIC */}

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* STUDENT */}

            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/resume" element={<Resume />} />
            <Route path="/student/jobs" element={<AvailableJobs />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/interviews" element={<MyInterviews />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/take-test/:applicationId" element={<TakeTest />} />


            {/* RECRUITER */}

            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/job/create" element={<RecruiterCreateJob />} />
            <Route path="/recruiter/job/edit/:id" element={<RecruiterEditJob />} />
            <Route path="/recruiter/applications" element={<Applications />} />
            <Route path="/recruiter/interviews" element={<InterviewList />} />
            <Route
                path="/recruiter/interview/schedule/:applicationId"
                element={<ScheduleInterview />}
            />
            <Route
                path="/recruiter/interview/edit/:id"
                element={<EditInterview />}
            />
            <Route
                path="/recruiter/questions/add"
                element={<AddQuestion />}
            />


            {/* FIXED ROUTE */}

            <Route
                path="/recruiter/application/:id"
                element={<CandidateDetails />}
            />

            {/* COMPANY */}

            <Route
                path="/company/dashboard"
                element={<CompanyDashboard />}
            />

<Route
    path="/company/profile"
    element={<CompanyProfile />}
/>

<Route
    path="/company/recruiters"
    element={<Recruiters />}
/>

<Route
    path="/company/jobs"
    element={<Jobs />}
/>
{/* #hiii */}


            {/* ADMIN */}

            <Route
                path="/admin"
                element={<AdminLayout />}
            >

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                {/* Company */}

                <Route
                    path="company/create"
                    element={<CreateCompany />}
                />

                <Route
                    path="company/list"
                    element={<CompanyList />}
                />

                <Route
                    path="company/edit/:id"
                    element={<EditCompany />}
                />

                {/* Recruiter */}

                <Route
                    path="recruiter/create"
                    element={<CreateRecruiter />}
                />

                <Route
                    path="recruiter/list"
                    element={<RecruiterList />}
                />

                <Route
                    path="recruiter/edit/:id"
                    element={<EditRecruiter />}
                />

                {/* Students */}

                <Route
                    path="students"
                    element={<StudentList />}
                />

                <Route
                    path="student/:id"
                    element={<StudentDetails />}
                />

                {/* Jobs */}

                <Route
                    path="job/list"
                    element={<JobList />}
                />

                <Route
                    path="job/create"
                    element={<CreateJob />}
                />

                <Route
                    path="job/edit/:id"
                    element={<EditJob />}
                />

                {/* Analytics */}

                <Route
                    path="analytics"
                    element={<Analytics />}
                />

                {/* Settings */}

                <Route
                    path="settings"
                    element={<Settings />}
                />

            </Route>

        </Routes>
    );
}