import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import SignupPage from '../pages/taekjun/SignupPage.jsx';

function TaekjunRoute() {
    return (
        <>
            {/* 회원가입은 인증이 필요하지 않으므로 ProtectedRoute 밖에 배치 */}
            <Route path='/signup' element={<SignupPage/>} />
            
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='' element={''} />
            </Route>
        </>
    );
}

export default TaekjunRoute;