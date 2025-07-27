import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import MyPageStoreInfo from '../pages/dabin/MyPageStoreInfo';
import UserCommissionHistoryPage from '../pages/dabin/UserCommissionHistoryPage';
import StoreInfoPage from '../pages/dabin/StoreInfoPage';
import StoreEditPage from '../pages/dabin/StoreEditPage';
import StoreOperationViewPage from '../pages/dabin/StoreOperationViewPage';
import StoreOperationEditPage from '../pages/dabin/StoreOperationEditPage';
import EventRegistrationPage from '../pages/dabin/EventRegistrationPage';
import EventListPage from '../pages/dabin/EventListPage';
import EventDetailPage from '../pages/dabin/EventDetailPage';
import StoreImageRegisterPage from '../pages/dabin/StoreImageRegisterPage';
import UserEventListPage from '../pages/dabin/UserEventListPage';
import UserEventDetailPage from '../pages/dabin/UserEventDetailPage';



function DabinRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='/mypage-storeinfo' element={<MyPageStoreInfo />} />
                <Route path='/user-commission-history' element={<UserCommissionHistoryPage />} />
                <Route path='/store' element={<StoreInfoPage />} />
                <Route path='/store/edit' element={<StoreEditPage />} />
                <Route path='/store/operation' element={<StoreOperationViewPage />} />
                <Route path='/store/operation/edit' element={<StoreOperationEditPage />} />
                <Route path='/event-registration' element={<EventRegistrationPage />} />
                <Route path='/event-list' element={<EventListPage />} />
                <Route path='/event-detail/:eventMasterIndex' element={<EventDetailPage />} />
                <Route path='/store/image-register' element={<StoreImageRegisterPage />} />
                {/* 사용자용 쿠폰 이벤트 */}
                <Route path='/user-event-list' element={<UserEventListPage />} />
                <Route path='/user-event-detail/:eventMasterIndex' element={<UserEventDetailPage />} />

            </Route>
        </>
    );
}

export default DabinRoute;