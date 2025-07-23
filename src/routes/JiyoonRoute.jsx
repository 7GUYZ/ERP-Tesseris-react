import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NoticeList from "../pages/jiyun/notice/NoticeList";
import NoticeDetail from "../pages/jiyun/notice/NoticeDetail";
import TermsList from "../pages/jiyun/terms/TermsList";
import UserServicePage from "../pages/jiyun/terms/UserService";
import PrivacyTermsPage from "../pages/jiyun/terms/PrivacyTerms";
import MarketingTermsPage from "../pages/jiyun/terms/MarketingTerms";
import AdInfoTermsPage from "../pages/jiyun/terms/AdInfo";
import LocationTermsPage from "../pages/jiyun/terms/LocationTerms";
import PinPwCheck from "../pages/jiyun/pin-change/PinPwCheck";
import PinStep1 from "../pages/jiyun/pin-change/PinStep1";
import PinStep2 from "../pages/jiyun/pin-change/PinStep2";
import PinComplete from "../pages/jiyun/pin-change/PinComplete";
import Mypage from "../pages/jiyun/mypage/Mypage";

function JiyoonRoute() {
  return (
    <>
      {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/notice-list" element={<NoticeList />} />
        <Route path="/notice-view/:noticeIdx" element={<NoticeDetail />} />
        <Route path="/terms" element={<TermsList />} />
        <Route path="/terms/service" element={<UserServicePage />} />
        <Route path="/terms/privacy" element={<PrivacyTermsPage />} />
        <Route path="/terms/marketing" element={<MarketingTermsPage />} />
        <Route path="/terms/adinfo" element={<AdInfoTermsPage />} />
        <Route path="/terms/location" element={<LocationTermsPage />} />
        <Route path="/pinChange/pwCheck" element={<PinPwCheck />} />
        <Route path="/pinChange/pinInsert" element={<PinStep1 />} />
        <Route path="/pinChange/pinconfirm" element={<PinStep2 />} />
        <Route path="/pinChange/pinComplete" element={<PinComplete />} />
        <Route path="/mypage" element={<Mypage />} />
      </Route>
    </>
  );
}

export default JiyoonRoute;
