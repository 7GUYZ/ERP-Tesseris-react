import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Phone, MapPin, X } from 'lucide-react';
import { getUserEventDetail, downloadUserCoupon, getEventStoreImages, getPresignedUrl } from '../../api/auth/DabinAuth';
import Toast from '../../components/ui/jungeun/Toast';
import '../../styles/dabin/EventDetailPage.css';
import '../../styles/dabin/dabinStoreDetail.css';

const UserEventDetailPage = () => {
    const { eventMasterIndex } = useParams();
    const navigate = useNavigate();
    const [eventDetail, setEventDetail] = useState(null);
    const [storeImages, setStoreImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Toast states
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [showToast, setShowToast] = useState(false);

    const showToastMessage = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const closeToast = () => {
        setShowToast(false);
    };

    useEffect(() => {
        if (eventMasterIndex) {
            fetchEventDetail();
        }
    }, [eventMasterIndex]);

    // StoreInfoPage와 동일한 Presigned URL 변환 함수
    const fetchPresignedUrls = async (images) => {
        if (!images || images.length === 0) {
            setStoreImages([]);
            return;
        }
        const urls = await Promise.all(
            images.map(async (img) => {
                try {
                    const url = await getPresignedUrl(img.storeImage);
                    return { ...img, presignedUrl: url };
                } catch {
                    return { ...img, presignedUrl: null };
                }
            })
        );
        // 대표이미지(T)만 필터링
        const mainImages = urls.filter(img => img.storeMainImageStatus === 'T');
        setStoreImages(mainImages);
    };

    const fetchEventDetail = async () => {
        setLoading(true);
        try {
            // 1. 이벤트 상세 정보 조회
            const response = await getUserEventDetail(eventMasterIndex);
            if (response.data.resultCode === 200) {
                const data = response.data.data;
                
                // 새로운 API 응답 구조에 맞게 처리
                // coupons 배열이 이미 포함되어 있음
                setEventDetail(data);
                
                // 2. 이벤트에 해당하는 매장 이미지 조회
                try {
                    const storeImagesResponse = await getEventStoreImages(eventMasterIndex);
                    console.log('Event Store Images Response:', storeImagesResponse);
                    
                    if (storeImagesResponse && storeImagesResponse.length > 0) {
                        await fetchPresignedUrls(storeImagesResponse);
                    } else {
                        setStoreImages([]);
                    }
                } catch (imageError) {
                    console.error('이벤트 매장 이미지 조회 실패:', imageError);
                    setStoreImages([]);
                }
            } else {
                showToastMessage('이벤트 정보를 불러오는데 실패했습니다.', 'error');
                setTimeout(() => {
                    navigate('/user-event-list');
                }, 1500);
            }
        } catch (error) {
            console.error('이벤트 상세 조회 오류:', error);
            showToastMessage('이벤트 정보를 불러오는데 실패했습니다.', 'error');
            setTimeout(() => {
                navigate('/user-event-list');
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedCouponForDownload, setSelectedCouponForDownload] = useState(null);

    const handleCouponDownload = async (couponIndex) => {
        setSelectedCouponForDownload(couponIndex);
        setShowDownloadModal(true);
    };

    const confirmDownload = async () => {
        if (!selectedCouponForDownload) return;

        console.log('쿠폰 다운로드 버튼 클릭 - couponIndex:', selectedCouponForDownload, 'eventMasterIndex:', eventMasterIndex);
        
        setDownloading(true);
        try {
            const response = await downloadUserCoupon(parseInt(eventMasterIndex), selectedCouponForDownload);
            console.log('쿠폰 다운로드 응답:', response);

            if (response.data.resultCode === 200) {
                console.log('쿠폰 다운로드 성공:', response.data.resultMessage);
                showToastMessage(response.data.resultMessage, 'success');
                // PHP와 동일하게 성공 후 이벤트 목록 페이지로 이동
                setTimeout(() => {
                    navigate('/user-event-list');
                }, 1500);
            } else {
                console.log('쿠폰 다운로드 실패:', response.data.resultMessage);
                showToastMessage(response.data.resultMessage, 'error');
            }
        } catch (error) {
            console.error('쿠폰 다운로드 오류:', error);
            console.error('오류 상세:', error.response?.data);
            showToastMessage('쿠폰 다운로드 중 오류가 발생했습니다.', 'error');
        } finally {
            setDownloading(false);
            // 성공/실패와 관계없이 모달 닫기
            setShowDownloadModal(false);
            setSelectedCouponForDownload(null);
        }
    };

    const handleBackClick = () => {
        navigate('/user-event-list');
    };

    const handlePhoneClick = (phone) => {
        if (phone && phone.trim() !== '') {
            // 전화번호 형식 정리 (하이픈 제거)
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.length >= 10) {
                window.location.href = `tel:${cleanPhone}`;
            } else {
                showToastMessage('유효하지 않은 전화번호입니다.', 'error');
            }
        } else {
            showToastMessage('전화번호가 없습니다.', 'error');
        }
    };

    // 지도 클릭 처리
    const handleMapClick = () => {
        if (eventDetail?.storeAddress) {
            // 카카오맵으로 주소 검색
            const address = encodeURIComponent(eventDetail.storeAddress);
            window.open(`https://map.kakao.com/?q=${address}`, '_blank');
        } else {
            showToastMessage('주소 정보가 없습니다.', 'error');
        }
    };

    const getCouponType = (price) => {
        if (!price) return "main";  // price가 없으면 기본값 반환
        if (price >= 50000) return "price-50000"      // ₩50,000 - 신사임당 - 노란색
        if (price >= 10000) return "price-10000"      // ₩10,000 - 세종대왕 - 초록색
        if (price >= 5000) return "price-5000"        // ₩5,000 - 율곡 이이 - 주황색
        if (price >= 1000) return "price-1000"        // ₩1,000 - 퇴계 이황 - 파란색
        return "main"                                  // 기본값
    };

    if (loading) {
        return (
            <div className="event-detail-page">
                <div className="event-detail-loading">이벤트 상세 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (!eventDetail) {
        return (
            <div className="event-detail-page">
                <div className="event-detail-error">이벤트 정보를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="dabin-store-detail">
            {/* 헤더 */}
            <div className="dabin-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="dabin-back-button" onClick={() => window.history.back()}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 20, color: '#170F58' }}>
                    쿠폰 이벤트
                </div>
            </div>

            {/* 이미지 슬라이드 */}
            <div className="dabin-image-slider">
                <div className="dabin-slider-container">
                    {storeImages.length > 0 ? (
                        <>
                            <img
                                src={storeImages[0].presignedUrl || storeImages[0].storeImage}
                                alt={`${eventDetail.storeName} 이미지`}
                                className="dabin-slider-image"
                                onError={(e) => {
                                    console.error('이미지 로드 실패:', storeImages[0].storeImage);
                                    // presigned URL이 실패하면 원본 URL로 재시도
                                    if (e.target.src === storeImages[0].presignedUrl && storeImages[0].storeImage) {
                                        e.target.src = storeImages[0].storeImage;
                                    } else {
                                        // 이미지 로드 실패 시 기본 이미지 표시
                                        e.target.style.display = 'none';
                                        const noImageContainer = e.target.nextSibling;
                                        if (noImageContainer) {
                                            noImageContainer.classList.add('show');
                                        }
                                    }
                                }}
                            />
                            <div className="dabin-store-detail-no-image-container" style={{ display: 'none' }}>
                                <span>등록된 이미지가 없습니다</span>
                            </div>
                        </>
                    ) : (
                        <div className="dabin-store-detail-no-image-container" style={{ display: 'flex' }}>
                            <span>등록된 이미지가 없습니다</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 가게 정보 */}
            <div className="dabin-store-info">
                <div className="dabin-store-header">
                    <h2 className="dabin-store-name">{eventDetail.storeName}</h2>
                    <div className="position-badge">{eventDetail.storeCategoryName}</div>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="dabin-action-buttons">
                <button className="dabin-action-button phone" onClick={() => handlePhoneClick(eventDetail.storePhone)}>
                    <Phone size={20} />
                    <span>전화하기</span>
                </button>
                <button className="dabin-action-button map" onClick={handleMapClick}>
                    <MapPin size={20} />
                    <span>지도보기</span>
                </button>
            </div>

            {/* Coupon Section */}
            <div className="event-reg-coupons-container">
                {eventDetail.coupons && eventDetail.coupons.length > 0 ? (
                    eventDetail.coupons.map((coupon, index) => (
                        <div key={coupon.couponIndex} className="event-detail-coupon-card">
                            <div className="event-reg-coupon-header">
                                <div className="event-reg-coupon-price">
                                    {(coupon.couponPrice || 0).toLocaleString()}원
                                </div>
                            </div>
                            
                            <div className="event-reg-coupon-body">
                                <h3 className="event-reg-coupon-name">{coupon.couponName}</h3>
                                <div className="event-reg-coupon-store">
                                    발급 가맹점: {coupon.storeName || '가맹점 정보 없음'}
                                </div>
                                
                                <div className="event-reg-coupon-details">
                                    <div className="event-reg-coupon-detail-item">
                                        <span className="event-reg-detail-label">사용 기간:</span>
                                        <span className="event-reg-detail-value">
                                            {coupon.couponLimit ? `${coupon.couponLimit}일` : '기간 정보 없음'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 쿠폰 받기 기능 유지 */}
                            <div className="event-reg-coupon-footer">
                                {coupon.couponIssuanceStatus === '보유중' ? (
                                    <button
                                        className="user-event-detail-download-button"
                                        onClick={() => handleCouponDownload(coupon.couponIndex)}
                                        disabled={downloading}
                                    >
                                        {downloading ? '다운로드 중...' : '쿠폰 받기'}
                                    </button>
                                ) : (
                                    <button className="event-reg-coupon-detail-btn">
                                        쿠폰 상세보기
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="event-detail-error">쿠폰 정보가 없습니다.</div>
                )}
            </div>
            
            {/* Download Confirmation Modal */}
            {showDownloadModal && (
                <div className="user-event-detail-modal-overlay" onClick={() => setShowDownloadModal(false)}>
                    <div className="user-event-detail-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="user-event-detail-modal-header">
                            <h2>쿠폰 받기</h2>
                            <button 
                                className="user-event-detail-modal-close" 
                                onClick={() => setShowDownloadModal(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="user-event-detail-modal-body">
                            <p>쿠폰을 받으시겠습니까?</p>
                        </div>
                        <div className="user-event-detail-modal-actions">
                            <button 
                                className="user-event-detail-modal-cancel"
                                onClick={() => setShowDownloadModal(false)}
                            >
                                취소
                            </button>
                            <button 
                                className="user-event-detail-modal-confirm"
                                onClick={confirmDownload}
                                disabled={downloading}
                            >
                                {downloading ? '다운로드 중...' : '받기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Toast Component */}
            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    onClose={closeToast}
                />
            )}
        </div>
    );
};

export default UserEventDetailPage; 