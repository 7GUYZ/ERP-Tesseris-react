import { Route } from 'react-router-dom';
import TestMain from "../pages/jungeun/TestMain";
import ProtectedRoute from "./ProtectedRoute";
import BusinessListPage from "../pages/jungeun/BusinessListPage";

function JungeunRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='/TestMain' element={<TestMain />} />
                <Route path='/BusinessList' element={<BusinessListPage />} />
            </Route>
        </>
    );
}

export default JungeunRoute;