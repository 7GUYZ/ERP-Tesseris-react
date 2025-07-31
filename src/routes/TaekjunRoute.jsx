import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import SignupPage from '../pages/taekjun/SignupPage.jsx';
import PasswordFindPage from '../pages/taekjun/PasswordFindPage.jsx';
import CustomerManagement from '../pages/taekjun/CustomerManagement.jsx';
import CouponList from '../pages/taekjun/CouponList.jsx';
import StoreList from '../pages/taekjun/StoreList.jsx';
import StoreDetail from '../pages/taekjun/StoreDetail.jsx';
import PaymentPage from '../pages/taekjun/PaymentPage.jsx';
import UserLogPage from '../pages/taekjun/UserLogPage.jsx';
import UserUpdatePage from '../pages/taekjun/UserUpdatePage.jsx';


function TaekjunRoute() {
    return [
        /* 회원가입과 패스워드 찾기는 인증이 필요하지 않으므로 ProtectedRoute 밖에 배치 */
        <Route key="signup" path='/signup' element={<SignupPage/>} />,
        <Route key="passwordfind" path='/passwordfind' element={<PasswordFindPage/>} />,
        
        /* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */
        <Route key="protected" element={<ProtectedRoute />}>
            <Route path='' element={''} />
            <Route path='/customer-management' element={<CustomerManagement/>} />
            <Route path='/couponlist' element={<CouponList/>} />
            <Route path='/userstoreList' element={<StoreList/>} />
            <Route path='/store-detail/:storeIndex' element={<StoreDetail/>} />
            <Route path='/payment' element={<PaymentPage/>} />
            <Route path='/user-log' element={<UserLogPage/>} />
            <Route path='/user_update' element={<UserUpdatePage/>} />
        </Route>
    ];
}

export default TaekjunRoute;