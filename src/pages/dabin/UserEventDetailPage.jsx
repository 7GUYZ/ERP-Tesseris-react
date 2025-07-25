import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUserEventDetail, downloadUserCoupon } from '../../api/auth/DabinAuth';
import '../../styles/dabin/UserEventDetailPage.css';

const UserEventDetailPage = () => {
    const { eventMasterIndex } = useParams();
    const navigate = useNavigate();
    const [eventDetail, setEventDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (eventMasterIndex) {
            fetchEventDetail();
        }
    }, [eventMasterIndex]);

    const fetchEventDetail = async () => {
        setLoading(true);
        try {
            const response = await getUserEventDetail(eventMasterIndex);
            if (response.data.resultCode === 200) {
                const data = response.data.data;
                
                // 기존 단일 쿠폰 데이터를 배열로 변환
                const couponData = {
                    couponIndex: data.couponIndex,
                    couponName: data.couponName,
                    couponPrice: data.couponPrice,
                    couponIssuanceStatus: data.couponIssuanceStatus,
                    couponLimit: data.couponLimit,
                    couponLimitTime: data.couponLimitTime,
                    couponIssuanceTime: data.couponIssuanceTime,
                    backgroundImage: null // 배경 이미지 제거
                };
                
                // 가게 정보와 쿠폰 목록을 포함한 새로운 객체 생성
                const eventDetailData = {
                    ...data,
                    coupons: [couponData]
                };
                
                setEventDetail(eventDetailData);
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

    const getBusinessStateText = (state) => {
        switch (state) {
            case 0: return '영업 종료';
            case 1: return '영업중';
            case 2: return '미설정';
            default: return '';
        }
    };

    const getBusinessStateClass = (state) => {
        switch (state) {
            case 0: return 'user-event-detail-bg-wait';
            case 1: return 'user-event-detail-bg-open';
            case 2: return 'user-event-detail-bg-wait';
            default: return '';
        }
    };

    const getCouponType = (price) => {
        if (price >= 10000) return "user-event-detail-coupon-background-gray";
        if (price >= 5000) return "user-event-detail-coupon-background-bronze";
        return "user-event-detail-coupon-background-main";
    };

    if (loading) {
        return (
            <div className="user-event-detail-page">
                <div className="user-event-detail-loading">
                    <div className="user-event-detail-loading-circle"></div>
                    <div className="user-event-detail-loading-text">로딩 중</div>
                </div>
            </div>
        );
    }

    if (!eventDetail) {
        return (
            <div className="user-event-detail-page">
                <p>이벤트 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="user-event-detail-page">
            {/* Header */}
            <div className="user-event-detail-header-h">
                <header className="user-event-detail-header-wrap">
                    <button className="event-list-back-btn" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <p className="user-event-detail-header-title">쿠폰 이벤트</p>
                </header>
            </div>

            {/* Store Information */}
            <div>
                <ul className="user-event-detail-fran-listw">
                    <li className="user-event-detail-fran-list flex_between">
                        <div className="user-event-detail-franchise-imglist">
                            <div className="user-event-detail-store-image-placeholder" style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                color: '#666'
                            }}>
                                {eventDetail.storeName ? eventDetail.storeName.charAt(0) : 'S'}
                            </div>
                            <div className={getBusinessStateClass(eventDetail.storeBusinessState)}>
                                <p>{getBusinessStateText(eventDetail.storeBusinessState)}</p>
                            </div>
                        </div>
                        <div className="user-event-detail-fran-infotxt">
                            <div className="user-event-detail-fran-amountbox">
                                <p className="user-event-detail-fran-infoone">{eventDetail.storeName}</p>
                                <div className="user-event-detail-myamount-btn">
                                    <p className="user-event-detail-myamount-ltxt">{eventDetail.userCmUse} CM 가능</p>
                                </div>
                            </div>
                            <p className="user-event-detail-m-B10 user-event-detail-m-T10 user-event-detail-fran-inftw">{eventDetail.storeAddress}</p>
                            <div className="user-event-detail-flex-start user-event-detail-flex-wrap">
                                <p className="user-event-detail-fran-man-type">{eventDetail.storeCategoryName}</p>
                                <p className="user-event-detail-flex-start">
                                    <a href={`tel:${eventDetail.storePhone}`} className="user-event-detail-fran-state">
                                        📞
                                    </a>
                                    <a href={`/pages/franchisee/franchisee_map.php?fidx=${eventDetail.storeIndex}`} className="user-event-detail-m-L10 user-event-detail-fran-state">
                                        🗺️
                                    </a>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Coupon Section */}
            <div className="user-event-detail-coupon-section">
                {eventDetail.coupons && eventDetail.coupons.map((coupon, index) => (
                    <div key={coupon.couponIndex} className="user-event-detail-coupon-card">
                        <div className={`user-event-detail-coupon-background ${getCouponType(coupon.couponPrice)}`}>
                            <div className="user-event-detail-coupon-content">
                                <div className="user-event-detail-coupon-info">
                                    <div className="user-event-detail-coupon-name">{coupon.couponName}</div>
                                    <div className="user-event-detail-coupon-status">{coupon.couponIssuanceStatus}</div>
                                    <div className="user-event-detail-coupon-period">{coupon.couponLimit}일</div>
                                </div>
                            </div>
                            <div className="user-event-detail-coupon-badge">
                                <div className="user-event-detail-badge-circle">
                                    <div className="user-event-detail-badge-text">CMBARTER KOREA INC.</div>
                                    <div className="user-event-detail-badge-dots">••••••••••••</div>
                                    <div className="user-event-detail-badge-amount">{coupon.couponPrice.toLocaleString()}</div>
                                    <div className="user-event-detail-badge-dots">••••••••••••</div>
                                </div>
                            </div>
                            <div className="user-event-detail-coupon-brand">
                                <div className="user-event-detail-brand-logo">CMBarterkorea</div>
                                <div className="user-event-detail-brand-decoration"></div>
                            </div>
                            <div className="user-event-detail-coupon-decoration">
                                <div className="user-event-detail-decoration-lines"></div>
                                <div className="user-event-detail-decoration-elements">
                                    <div className="user-event-detail-decoration-leaf"></div>
                                </div>
                            </div>
                        </div>
                        {coupon.couponIssuanceStatus === '보유중' && (
                            <button
                                className="user-event-detail-download-button"
                                onClick={() => handleCouponDownload(coupon.couponIndex)}
                                disabled={downloading}
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                {downloading ? '다운로드 중...' : '쿠폰 받기'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserEventDetailPage; 