import AdminCourses from "./adminCourses"
import AdminUserRecords from "./adminCourses"
import AdminNav from "./adminNav"

export default function AdminPage3() {
    return (
        <div className="admin-Container">
            <div className="admin-Nav">
                <AdminNav dashboard={<AdminCourses />} />
            </div>
        </div>
    )
}