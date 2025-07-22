import React, { useState, useEffect, useRef } from "react";
import "../../../styles/jungeun/storeDetail.css";
import { ChevronLeft, Phone, MapPin, Clock, ChevronRight, MoveLeftIcon as SlideLeft, Coffee, Globe, Info, Coins, Image } from "lucide-react"
import { useParams } from "react-router-dom";
import { storeDetail } from "../../../api/auth/JungeunAuth";

// 기본 이미지 (이미지가 없을 때 사용)
const defaultImage = "https://via.placeholder.com/400x300?text=No+Image";

const StoreDetailForm = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { storeIndex } = useParams();
    const [store, setStore] = useState({});
    const autoSlideRef = useRef(null);

    // store가 없으면 빈 값 처리
    const name = store?.storeName || "";
    
    // 실제 이미지 배열 사용, 없으면 빈 배열
    const images = store?.storeImages && store.storeImages.length > 0 
        ? store.storeImages 
        : [];

    // 영어 요일 나열 -> 한국어 요일로 변환
    const convertDaysToKorean = (daysString) => {
        if (!daysString) return "";
        const dayMap = {
            monday: "월",
            tuesday: "화",
            wednesday: "수",
            thursday: "목",
            friday: "금",
            saturday: "토",
            sunday: "일",
        };
        return daysString
            .split(",")
            .map((day) => dayMap[day.trim()] || day.trim())
            .join(", ");
    };

    const businessDays = convertDaysToKorean(store?.storeBusinessDate);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        // 수동 조작 시 자동 슬라이드 재시작
        startAutoSlide();
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        // 수동 조작 시 자동 슬라이드 재시작
        startAutoSlide();
    }

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
        // 수동 조작 시 자동 슬라이드 재시작
        startAutoSlide();
    };

    // 자동 슬라이드 시작
    const startAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
        if (images.length > 1) {
            autoSlideRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }, 4000); // 4초마다 전환
        }
    };

    // 자동 슬라이드 정지
    const stopAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
            autoSlideRef.current = null;
        }
    };

    const handlePhoneCall = () => {
        if (store.storePhone != null) {
            window.location.href = `tel:${store.storePhone}`;
        }
    };

    const handleMapView = () => {
        // 1. store.storeAddress에 값이 있는지 확인
        console.log("주소:", store?.storeAddress);
    
        if (!store?.storeAddress) {
            alert("주소 정보가 없습니다.");
            return;
        }
        // 2. 백틱(`) 사용 확인
        const encodedAddress = encodeURIComponent(store.storeAddress);
        const mapUrl = `https://map.kakao.com/?q=${encodedAddress}`;
        console.log("지도 URL:", mapUrl);
        window.open(mapUrl, "_blank");
    };

    const handleGoBack = () => {
        window.history.back()
    }

    useEffect(() => {
        const fetchStore = async () => {
            if (!storeIndex) return;
            // 실제 API 호출
            const res = await storeDetail(storeIndex); // fetchStoreDetail은 실제 API 함수로 교체
            console.log(res);
            setStore(res.data.data);
        };
        fetchStore();
    }, [storeIndex]);

    // 이미지가 변경될 때 currentImageIndex 초기화 및 자동 슬라이드 시작
    useEffect(() => {
        setCurrentImageIndex(0);
        if (images.length > 1) {
            startAutoSlide();
        }
        
        // 컴포넌트 언마운트 시 인터벌 정리
        return () => {
            stopAutoSlide();
        };
    }, [store.storeImages]);

    // 이미지가 없을 때 표시할 컴포넌트
    const NoImageComponent = ({ show = false }) => (
        <div className={`store-detail-no-image-container ${show ? 'show' : ''}`}>
            <Image size={48} color="#9CA3AF" />
            <p className="store-detail-no-image-text">등록된 이미지가 없습니다</p>
        </div>
    );

    return (
        <div className="store-detail">
            {/* 헤더 */}
            <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="back-button" onClick={handleGoBack}>
                    <ChevronLeft size={24} />
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 20, color: '#170F58' }}>
                    가맹점 정보
                </div>
            </div>

            {/* 이미지 슬라이드 */}
            <div className="image-slider">
                <div className="slider-container">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={`${name} 이미지 ${currentImageIndex + 1}`}
                                className="slider-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const noImageContainer = e.target.nextSibling;
                                    if (noImageContainer) {
                                        noImageContainer.classList.add('show');
                                    }
                                }}
                                onMouseEnter={stopAutoSlide} // 마우스 오버 시 자동 슬라이드 정지
                                onMouseLeave={startAutoSlide} // 마우스 아웃 시 자동 슬라이드 재시작
                            />
                            <NoImageComponent show={false} />
                        </>
                    ) : (
                        <NoImageComponent show={true} />
                    )}
                    {images.length > 1 && (
                        <>
                            <button 
                                className="slider-button prev" 
                                onClick={handlePrevImage}
                                onMouseEnter={stopAutoSlide}
                                onMouseLeave={startAutoSlide}
                            >
                                <SlideLeft size={20} />
                            </button>
                            <button 
                                className="slider-button next" 
                                onClick={handleNextImage}
                                onMouseEnter={stopAutoSlide}
                                onMouseLeave={startAutoSlide}
                            >
                                <ChevronRight size={20} />
                            </button>
                            <div className="slider-dots">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`dot ${index === currentImageIndex ? "active" : ""}`}
                                        onClick={() => handleDotClick(index)}
                                        onMouseEnter={stopAutoSlide}
                                        onMouseLeave={startAutoSlide}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 가게 정보 */}
            <div className="store-info">
                <div className="store-header">
                    <h2 className="store-name">{store.storeName}</h2>
                    {/* 업종명 position-badge 스타일 */}
                    <div
                        className="position-badge"
                    >
                        {store.storeCategoryName}
                    </div>
                </div>


            </div>

            {/* 액션 버튼 */}
            <div className="action-buttons">
                <button className="action-button phone" onClick={handlePhoneCall}>
                    <Phone size={20} />
                    <span>전화하기</span>
                </button>
                <button className="action-button map" onClick={handleMapView}>
                    <MapPin size={20} />
                    <span>지도보기</span>
                </button>
            </div>

            {/* 메뉴 정보 */}
            <div className="menu-section">
                <h3>가맹점 정보</h3>
                <div className="detail-item cm">
                    <Coins className="detail-icon" size={16} />
                    <span>사용 가능 CM: &nbsp;{store.userCmUse?.toLocaleString()}CM</span>
                </div>
                <div className="store-details">
                    <div className="detail-item address">
                        <MapPin className="detail-icon" size={16} />
                        <span>
                            주소: &nbsp;{store.storeAddress} {store.storeDetailAddress && `(${store.storeDetailAddress})`}
                        </span>
                    </div>
                    <div className="detail-item phone">
                        <Phone className="detail-icon" size={16} />
                        <span>전화번호: &nbsp;{store.storePhone}</span>
                    </div>
                    {/* 운영시간: store.storeBusinessHour 또는 businessDays가 있을 때만 노출 */}
                    {(store?.storeBusinessHour || businessDays) && (
                        <div className="detail-item hours">
                            <Clock className="detail-icon" size={16} />
                            <span>
                                운영시간:&nbsp;
                                {store.storeBusinessHour ? store.storeBusinessHour : ""}
                                {businessDays ? ` (${businessDays})` : ""}
                            </span>
                        </div>
                    )}
                    {store?.storeRestHour && (
                        <div className="detail-item rest-hour">
                            <Coffee className="detail-icon" size={16} />
                            <span>휴게시간: &nbsp;{store.storeRestHour}</span>
                        </div>
                    )}
                    {store?.storeSite && (
                        <div className="detail-item site">
                            <Globe className="detail-icon" size={16} />
                            <span>홈페이지: &nbsp;
                                <a href={store.storeSite} target="_blank" rel="noopener noreferrer">{store.storeSite}</a>
                            </span>
                        </div>
                    )}
                    {store?.storeMemo && (
                        <div className="detail-item memo">
                            <Info className="detail-icon" size={16} />
                            <span>소개: &nbsp;{store.storeMemo}</span>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default StoreDetailForm; 