import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { getUserEventDetail, downloadUserCoupon, getMyStoreImages, getPresignedUrl } from '../../api/auth/DabinAuth';
import '../../styles/dabin/EventDetailPage.css';

const UserEventDetailPage = () => {
    const { eventMasterIndex } = useParams();
    const navigate = useNavigate();
    const [eventDetail, setEventDetail] = useState(null);
    const [storeImages, setStoreImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

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
                
                // 2. 가맹점 이미지 조회 (store_main_image_status = 'T'인 메인 이미지만)
                try {
                    const storeImagesResponse = await getMyStoreImages();
                    console.log('Store Images Response:', storeImagesResponse);
                    
                    if (storeImagesResponse && storeImagesResponse.data) {
                        await fetchPresignedUrls(storeImagesResponse.data);
                    } else {
                        setStoreImages([]);
                    }
                } catch (imageError) {
                    console.error('가맹점 이미지 조회 실패:', imageError);
                    setStoreImages([]);
                }
            } else {
                alert('이벤트 정보를 불러오는데 실패했습니다.');
                navigate('/user-event-list');
            }
        } catch (error) {
            console.error('이벤트 상세 조회 오류:', error);
            alert('이벤트 정보를 불러오는데 실패했습니다.');
            navigate('/user-event-list');
        } finally {
            setLoading(false);
        }
    };

    const handleCouponDownload = async (couponIndex) => {
        if (!window.confirm('쿠폰을 받으시겠습니까?')) {
            return;
        }

        console.log('쿠폰 다운로드 버튼 클릭 - couponIndex:', couponIndex, 'eventMasterIndex:', eventMasterIndex);
        
        setDownloading(true);
        try {
            const response = await downloadUserCoupon(parseInt(eventMasterIndex), couponIndex);
            console.log('쿠폰 다운로드 응답:', response);

            if (response.data.resultCode === 200) {
                console.log('쿠폰 다운로드 성공:', response.data.resultMessage);
                alert(response.data.resultMessage);
                // PHP와 동일하게 성공 후 이벤트 목록 페이지로 이동
                navigate('/user-event-list');
            } else {
                console.log('쿠폰 다운로드 실패:', response.data.resultMessage);
                alert(response.data.resultMessage);
            }
        } catch (error) {
            console.error('쿠폰 다운로드 오류:', error);
            console.error('오류 상세:', error.response?.data);
            alert('쿠폰 다운로드 중 오류가 발생했습니다.');
        } finally {
            setDownloading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/user-event-list');
    };



    const getCouponType = (price) => {
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
        <div className="event-detail-page">
            {/* Header */}
            <div className="event-detail-header">
                <button className="event-detail-back-btn" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="event-detail-header-title">쿠폰 이벤트</h1>
                <div className="event-detail-header-spacer"></div>
            </div>

            {/* Store Information */}
            <div className="event-detail-store-section">
                <div className="event-detail-store-card">
                    <div className="event-detail-store-image">
                        {storeImages.length > 0 ? (
                            <img 
                                src={storeImages[0].presignedUrl || storeImages[0].storeImage} 
                                alt={eventDetail.storeName}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const noImageDiv = e.target.nextSibling;
                                    if (noImageDiv) {
                                        noImageDiv.style.display = 'flex';
                                    }
                                }}
                            />
                        ) : null}
                        <div className="event-detail-no-image" style={{ display: storeImages.length > 0 ? 'none' : 'flex' }}>
                            <span>{eventDetail.storeName ? eventDetail.storeName.charAt(0) : 'S'}</span>
                        </div>
                    </div>
                    <div className="event-detail-store-info">
                        <div className="event-detail-store-header">
                            <h2 className="event-detail-store-name">{eventDetail.storeName}</h2>
                        </div>
                        <p className="event-detail-store-address">{eventDetail.storeAddress}</p>
                        <div className="event-detail-store-actions">
                            <span className="event-detail-store-category">{eventDetail.storeCategoryName}</span>
                            <div className="event-detail-action-buttons">
                                <button 
                                    className="event-detail-action-btn event-detail-phone-btn"
                                    onClick={() => window.location.href = `tel:${eventDetail.storePhone}`}
                                >
                                    📞
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="event-reg-coupons-container">
                {eventDetail.coupons && eventDetail.coupons.map((coupon, index) => (
                    <div key={coupon.couponIndex} className="event-reg-coupon-card selected">
                        <div className={`event-reg-coupon-background ${getCouponType(coupon.couponPrice)}`}>
                            {/* Checkbox */}
                            <div className="event-reg-coupon-checkbox">
                                <input
                                    type="checkbox"
                                    id={`user-event-detail-coupon-checkbox-${coupon.couponIndex}`}
                                    checked={true}
                                    readOnly
                                    className="event-reg-checkbox-input"
                                />
                                <label htmlFor={`user-event-detail-coupon-checkbox-${coupon.couponIndex}`} className="event-reg-checkbox-label"></label>
                            </div>

                            <div className="event-reg-coupon-brand">
                                <div className="event-reg-brand-logo">Tesseris</div>
                                <div className="event-reg-brand-decoration"></div>
                            </div>

                            <div className="event-reg-coupon-content">
                                <div className="event-reg-coupon-info-box">
                                    <div className="event-reg-coupon-name">{coupon.couponName}</div>
                                    <div className="event-reg-coupon-status">{coupon.couponIssuanceStatus}</div>
                                    <div className="event-reg-coupon-period">
                                        {coupon.couponLimitTime 
                                            ? new Date(coupon.couponLimitTime).toLocaleDateString() 
                                            : (coupon.couponLimit ? `${coupon.couponLimit}일` : '')}
                                    </div>
                                </div>
                            </div>

                            <div className="event-reg-coupon-badge">
                                <div className="event-reg-badge-circle">
                                    <div className="event-reg-badge-text">TESSERIS KOREA INC.</div>
                                    <div className="event-reg-badge-dots">••••••••••••</div>
                                    <div className="event-reg-badge-amount">{coupon.couponPrice.toLocaleString()}</div>
                                    <div className="event-reg-badge-dots">••••••••••••</div>
                                </div>
                            </div>

                            <div className="event-reg-coupon-decoration">
                                <div className="event-reg-decoration-lines"></div>
                                <div className="event-reg-decoration-elements">
                                    <div className="event-reg-decoration-leaf"></div>
                                </div>
                            </div>

                            <div className="event-reg-selection-overlay">
                                <div className="event-reg-selection-check">
                                    <Check className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

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
                ))}
            </div>
        </div>
    );
};

export default UserEventDetailPage; 