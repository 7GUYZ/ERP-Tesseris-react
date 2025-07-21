import React, { useState, useEffect } from "react";
import "../../../styles/jungeun/storeDetail.css";
import { ChevronLeft, Phone, MapPin, Clock, ChevronRight, MoveLeftIcon as SlideLeft } from "lucide-react"
import { useParams } from "react-router-dom";
import { storeDetail } from "../../../api/auth/JungeunAuth";

// 샘플 이미지만 남기고, 나머지는 props로 받음
const sampleImages = [
  "https://i.pinimg.com/1200x/b8/96/77/b896771e2e995a3f4aed1833a4c62862.jpg",
  "https://i.pinimg.com/736x/c1/f9/10/c1f910f028d6c2124c630dfc08d39ae7.jpg",
  "https://i.pinimg.com/1200x/7d/98/42/7d98422df803e4a60e8e5e4baf950054.jpg",
  "https://i.pinimg.com/1200x/6e/41/3c/6e413c6536c3bd6bc99c68e05fd639fe.jpg",
];

// const storeData = {
//   name: "맛있는 김밥천국",
//   rating: 4.5,
//   reviewCount: 128,
//   address: "서울시 강남구 테헤란로 123",
//   phone: "02-1234-5678",
//   hours: "09:00 - 22:00",
//   description:
//     "신선한 재료로 만든 다양한 김밥과 분식을 제공하는 맛집입니다. 깔끔한 매장과 친절한 서비스로 많은 고객들의 사랑을 받고 있습니다.",
//   images: [...],
//   menu: [ ... ],
// }

const StoreDetailForm = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const {storeIndex} = useParams();
    const [store, setStore] = useState([]);

    // store가 없으면 빈 값 처리
    const name = store?.name || "";
    // 별점 대신 업종명
    const storeCategoryName = store?.storeCategoryName || "";
    const address = store?.address || "";
    const phone = store?.phone || "";
    const hours = store?.hours || "";
    const description = store?.description || "";
    const menu = store?.menu || [];
    // 이미지는 샘플 사용
    const images = sampleImages;

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handlePhoneCall = () => {
        if (phone) window.location.href = `tel:${phone}`
    }

    const handleMapView = () => {
        // 실제로는 지도 앱이나 웹 지도로 연결
        const encodedAddress = encodeURIComponent(address)
        window.open(`https://map.naver.com/v5/search/${encodedAddress}`, "_blank")
    }

    const handleGoBack = () => {
        window.history.back()
    }

    useEffect(() => {
        const fetchStore = async () => {
            if (!storeIndex) return;
            // 실제 API 호출
            const data = await storeDetail(storeIndex); // fetchStoreDetail은 실제 API 함수로 교체
            console.log(data);
            setStore(data);
        };
        fetchStore();
    }, [storeIndex]);

    return (
        <div className="store-detail">
        {/* 헤더 */}
        <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="back-button" onClick={handleGoBack}>
            <ChevronLeft size={24} />
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 20, color: '#170F58'}}>
            가맹점 정보
          </div>
        </div>
  
        {/* 이미지 슬라이드 */}
        <div className="image-slider">
          <div className="slider-container">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${name} 이미지 ${currentImageIndex + 1}`}
              className="slider-image"
            />
            <button className="slider-button prev" onClick={handlePrevImage}>
              <SlideLeft size={20} />
            </button>
            <button className="slider-button next" onClick={handleNextImage}>
              <ChevronRight size={20} />
            </button>
            <div className="slider-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
  
        {/* 가게 정보 */}
        <div className="store-info">
          <div className="store-header">
            <h2 className="store-name">{name}</h2>
            {/* 업종명 position-badge 스타일 */}
            <div
              className="position-badge"
            >
              {storeCategoryName}
            </div>
          </div>
  
          <div className="store-details">
            <div className="detail-item">
              <MapPin className="detail-icon" size={16} />
              <span>{address}</span>
            </div>
            <div className="detail-item">
              <Phone className="detail-icon" size={16} />
              <span>{phone}</span>
            </div>
            <div className="detail-item">
              <Clock className="detail-icon" size={16} />
              <span>{hours}</span>
            </div>
          </div>
  
          <p className="store-description">{description}</p>
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
          <h3>주요 메뉴</h3>
          <div className="menu-list">
            {menu.map((item, index) => (
              <div key={index} className="menu-item">
                <span className="menu-name">{item.name}</span>
                <span className="menu-price">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
    );
};

export default StoreDetailForm; 