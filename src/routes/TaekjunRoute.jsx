import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import SignupPage from '../pages/taekjun/SignupPage.jsx';
import CustomerManagement from '../pages/taekjun/CustomerManagement.jsx';
import CouponList from '../pages/taekjun/CouponList.jsx';
import StoreList from '../pages/taekjun/StoreList.jsx';
import StoreDetail from '../pages/taekjun/StoreDetail.jsx';

function TaekjunRoute() {
    return (
        <>
            {/* 회원가입은 인증이 필요하지 않으므로 ProtectedRoute 밖에 배치 */}
            <Route path='/signup' element={<SignupPage/>} />
            
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='' element={''} />
                <Route path='/customer-management' element={<CustomerManagement/>} />
                <Route path='/couponlist' element={<CouponList/>} />
                <Route path='/store-list' element={<StoreList/>} />
                <Route path='/store-detail/:storeIndex' element={<StoreDetail/>} />
            </Route>
        </>
    );
}

export default TaekjunRoute;