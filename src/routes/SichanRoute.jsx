import { Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import QnaInquiryPage from '../pages/sichan/QnaInquiryPage';
import QnaListPage from '../pages/sichan/QnaListPage';
import QnaDetailPage from '../pages/sichan/QnaDetailPage';

function SichanRoute() {
    return (
        <>
            {/* 무조건 ProtectedRoute 안에 Route 넣으세요 - 인증 및 보안 필요해서 */}
            <Route element={<ProtectedRoute />}>
                <Route path='sichan/qna/inquiry' element={<QnaInquiryPage />} />
                <Route path='sichan/qna/list' element={<QnaListPage />} />
                <Route path='sichan/qna/detail/:qnaIndex' element={<QnaDetailPage />} />
            </Route>
        </>
    );
}

export default SichanRoute;