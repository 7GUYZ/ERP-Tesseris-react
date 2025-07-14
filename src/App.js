import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoticeList from "./pages/jiyun/notice/NoticeList";
import NoticeDetail from "./pages/jiyun/notice/NoticeDetail";
import TermsList from "./pages/jiyun/terms/TermsList";
import UserServicePage from "./pages/jiyun/terms/UserService";
import PrivacyTermsPage from "./pages/jiyun/terms/PrivacyTerms";
import MarketingTermsPage from "./pages/jiyun/terms/MarketingTerms";
import AdInfoTermsPage from "./pages/jiyun/terms/AdInfo";
import LocationTermsPage from "./pages/jiyun/terms/LocationTerms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/notice-list" element={<NoticeList />} />
        <Route path="/notice-view/:noticeIdx" element={<NoticeDetail />} />
        <Route path="/terms" element={<TermsList />} />
        <Route path="/terms/service" element={<UserServicePage />} />
        <Route path="/terms/privacy" element={<PrivacyTermsPage />} />
        <Route path="/terms/marketing" element={<MarketingTermsPage />} />
        <Route path="/terms/adinfo" element={<AdInfoTermsPage />} />
        <Route path="/terms/location" element={<LocationTermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
