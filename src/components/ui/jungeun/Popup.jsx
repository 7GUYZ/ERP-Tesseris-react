import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPopup } from '../../../api/auth/JungeunAuth';
import Cookies from 'js-cookie';

export default function Popup({ onClose }) {
    const [hideToday, setHideToday] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [popupImages, setPopupImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        return date.toISOString().slice(0, 10); // '2025-07-31'
    };

    // 쿠키 확인하여 팝업 표시 여부 결정
    useEffect(() => {
        const hideToday = Cookies.get('hidePopupToday');
        const today = formatDate(new Date());

        if (hideToday === today) {
            onClose(); // 오늘은 팝업 닫기
        }
    }, [onClose]);

    // 체크박스 초기 상태 설정
    useEffect(() => {
        const hideToday = Cookies.get('hidePopupToday');
        const today = formatDate(new Date());
    
        if (hideToday === today) {
            setHideToday(true);
        }
    }, []);

    const handleHideTodayChange = (e) => {
        setHideToday(e.target.checked);
        if (e.target.checked) {
            // 오늘 날짜로 쿠키 저장
            const today = formatDate(new Date());
            Cookies.set('hidePopupToday', today, { expires: 1 }); // 1일 후
        } else {
            Cookies.remove('hidePopupToday');
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < popupImages.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 팝업 이미지 데이터 가져오기
    useEffect(() => {
        const fetchPopupImages = async () => {
            try {
                setLoading(true);
                const response = await getPopup();
                console.log(response);
                if (response.data.resultCode === 200) {
                    setPopupImages(response.data.data || []);
                } else {
                    setError('팝업 데이터를 불러오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('팝업 데이터 로드 오류:', err);
                setError('팝업 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPopupImages();
    }, []);

    // 현재 페이지의 이미지 URL 가져오기
    const getCurrentImageUrl = () => {
        if (popupImages.length === 0) {
            return "https://www.mcdonalds.co.kr/upload/bbs/promotion/1753925277701.jpg"; // 기본 이미지
        }
        const currentImage = popupImages[currentPage - 1];
        console.log('현재 이미지 정보:', currentImage);
        console.log('현재 페이지:', currentPage, '전체 개수:', popupImages.length);
        return currentImage?.adPhoto || "https://www.mcdonalds.co.kr/upload/bbs/promotion/1753925277701.jpg";
    };

    // 이미지 클릭 핸들러
    const handleImageClick = () => {
        if (popupImages.length === 0) {
            return; // 기본 이미지인 경우 클릭 무시
        }

        const currentImage = popupImages[currentPage - 1];
        if (currentImage?.adUrl) {
            console.log('광고 URL로 이동:', currentImage.adUrl);
            window.open(currentImage.adUrl, '_blank'); // 새 탭에서 열기
        }
    };

    return (
        <div className="popup-container">
            {/* Header */}
            <div className="popup-header">
                <div className="popup-header-left">
                    <span className="popup-header-title">Ads</span>
                </div>
                <div className="popup-header-right">
                    <button className="popup-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="popup-content-body">
                {loading ? (
                    <div className="popup-loading">
                        <div className="popup-loading-spinner"></div>
                        <p>로딩 중...</p>
                    </div>
                ) : error ? (
                    <div className="popup-error">
                        <p>{error}</p>
                    </div>
                ) : (
                    /* 이미지 */
                    <div className="popup-image-container">
                        <img
                            src={getCurrentImageUrl()}
                            alt="프로모션 이미지"
                            className="popup-image"
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="popup-footer">
                <div className="popup-footer-left">
                    <label className="popup-checkbox-label">
                        <input
                            type="checkbox"
                            checked={hideToday}
                            onChange={handleHideTodayChange}
                            className="popup-checkbox"
                        />
                        <span className="popup-checkbox-text">오늘 하루 보지 않기</span>
                    </label>
                </div>
                <div className="popup-footer-right">
                    <div className="popup-pagination">
                        <button
                            className="popup-nav-btn"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || popupImages.length === 0}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="popup-page-info">{currentPage}/{Math.max(popupImages.length, 1)}</span>
                        <button
                            className="popup-nav-btn"
                            onClick={handleNextPage}
                            disabled={currentPage === popupImages.length || popupImages.length === 0}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}