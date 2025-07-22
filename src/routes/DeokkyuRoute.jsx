import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import RegisterStore0 from '../pages/deokkyu/RegisterStore0';
import RegisterStore1 from '../pages/deokkyu/RegisterStore1';
import RegisterStore2 from '../pages/deokkyu/RegisterStore2';

function DeokkyuRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='/registerstore0' element={<RegisterStore0/>} />
                <Route path='/registerstore1' element={<RegisterStore1/>} />
                <Route path='/registerstore2' element={<RegisterStore2/>} />
            </Route>
        </>
    );
}

export default DeokkyuRoute;