import { Route } from 'react-router-dom';
import TestMain from "../pages/jungeun/TestMain";
import ProtectedRoute from "./ProtectedRoute";
import BusinessListPage from "../pages/jungeun/BusinessListPage";
import StoreListPage from '../pages/jungeun/StoreListPage';
import StoreDetailPage from "../pages/jungeun/StoreDetailPage";
import UserMainHome from '../pages/jihun/main/UserMainHome';
import GiftPage from '../pages/jungeun/GiftPage';
import PinPage from '../pages/jungeun/PinPage';
import BrokerageFeePage from '../pages/jungeun/BrokerageFeePage';

function JungeunRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='/TestMain' element={<TestMain />} />
                <Route path='/BusinessList' element={<BusinessListPage />} />
                <Route path='/StoreList' element={<StoreListPage />} />
                <Route path="/StoreList/StoreDetail/:storeIndex" element={<StoreDetailPage />} />
                <Route path="/main" element={<UserMainHome />} />
                <Route path="/gift" element={<GiftPage />} />
                <Route path="/gift/pin" element={<PinPage />} />
                <Route path="/brokerageFee" element={<BrokerageFeePage />} />
            </Route>
        </>
    );
}

export default JungeunRoute;