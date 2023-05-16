import AdminDashboard from "./adminDashboard"
import AdminNav from "./adminNav"

export default function AdminIndex(){
    return(
        <div className="admin-Container">
            <div className="admin-Nav">
                <AdminNav dashboard={<AdminDashboard/>}/>
            </div>
        </div>
        )
}