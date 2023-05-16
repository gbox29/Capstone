import AdminUserRecords from "./adminUserRecords"
import AdminNav from "./adminNav"

export default function AdminPage2() {
    return (
        <div className="admin-Container">
            <div className="admin-Nav">
                <AdminNav dashboard={<AdminUserRecords />} />
            </div>
        </div>
    )
}