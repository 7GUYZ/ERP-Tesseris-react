import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import ChargePage from '../pages/jihun/charge/ChargePage';
import ChargeResult from '../pages/jihun/charge/ChargeResult';
import ChangePassword from '../pages/jihun/changepassword/ChangePassword';

function JihunRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='/charge/result' element={<ChargeResult />} />
                <Route path='/charge/:source' element={<ChargePage />} />
                <Route path='/mypage/changepassword' element={<ChangePassword />} />
            </Route>
        </>
    );
}

export default JihunRoute;