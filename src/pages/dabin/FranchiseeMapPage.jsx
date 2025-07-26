import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin } from 'lucide-react';
import { getFranchiseInfo, getFranchiseCategories, getNearbyFranchises } from '../../api/auth/DabinAuth';
import '../../styles/dabin/FranchiseeMapPage.css';

const FranchiseeMapPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const franchiseMarkerRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [franchiseData, setFranchiseData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [showFranchiseInfo, setShowFranchiseInfo] = useState(false);
  const [radius, setRadius] = useState(0.5);
  const [isFranchise, setIsFranchise] = useState(false);
  
  const fidx = searchParams.get('fidx');

  useEffect(() => {
    console.log('📜 카카오맵 스크립트 로드 시작...');
    
    // 이미 로드된 경우 바로 초기화
    if (window.kakao && window.kakao.maps) {
      console.log('✅ 카카오맵 API 이미 로드됨');
      initializeMap();
      return;
    }
    

    const script = document.createElement('script');
    
    // 환경변수 확인
    const appKey = process.env.KAKAORESTAPIKEY;
    if (!appKey) {
      console.error('❌ 카카오맵 API 키가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }
    
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      console.log('✅ 카카오맵 스크립트 로드 완료');
      // autoload=false이므로 수동으로 로드
      window.kakao.maps.load(() => {
        console.log('✅ 카카오맵 API 로드 완료');
        initializeMap();
      });
    };
    script.onerror = () => {
      console.error('❌ 카카오맵 스크립트 로드 실패');
      // 실패 시 기본 위치로 설정
      setLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (fidx) {
      setIsFranchise(true);
      fetchFranchiseData();
    } else {
      setIsFranchise(false);
    }
    
    // 카테고리 데이터 로드
    fetchCategories();
  }, [fidx]);

  const initializeMap = () => {
    console.log('🗺️ 지도 초기화 시작...');
    console.log('🔍 카카오맵 API 상태:', !!window.kakao, !!window.kakao?.maps);
    
    if (window.kakao && window.kakao.maps) {
      console.log('✅ 카카오맵 API 로드 완료');
      
      const defaultPos = new window.kakao.maps.LatLng(37.464712936046, 126.89546628002);
      
      const mapOption = {
        center: defaultPos,
        level: 5,
        mapTypeId: window.kakao.maps.MapTypeId.ROADMAP
      };

      const map = new window.kakao.maps.Map(mapRef.current, mapOption);
      mapInstanceRef.current = map;
      console.log('✅ 지도 인스턴스 생성 완료');

      // 지도타입 컨트롤 추가
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 줌 변경 이벤트
      window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged);
      
      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(map, 'click', handleMapClick);

      // 현재 위치 검색 시작
      console.log('🔍 위치 검색 시작...');
      searchCurrentPosition();
    } else {
      console.log('❌ 카카오맵 API 로드 실패');
      setLoading(false);
    }
  };

  const searchCurrentPosition = () => {
    // 카카오맵 API가 로드되지 않았으면 대기
    if (!window.kakao || !window.kakao.maps) {
      console.log('⏳ 카카오맵 API 로드 대기 중...');
      setTimeout(searchCurrentPosition, 100);
      return;
    }
    
    setLoading(true);
    console.log('🔍 고정 위치로 설정...');
    
    const defaultPos = new window.kakao.maps.LatLng(37.5665, 126.9780);
    setCurrentPosition(defaultPos);
    mapInstanceRef.current.panTo(defaultPos);
    
    if (isFranchise && franchiseData) {
      // 특정 가맹점 위치로 이동
      const franchisePos = new window.kakao.maps.LatLng(
        franchiseData.latitude,
        franchiseData.longitude
      );
      mapInstanceRef.current.panTo(franchisePos);
      createFranchiseMarker(franchisePos);
      setShowFranchiseInfo(true);
      setLoading(false);
    } else {
      // 현재 위치 마커 생성 (고정 위치)
      createCurrentPositionMarker(defaultPos);
      // 주변 가맹점 검색 (비동기이므로 finally에서 로딩 해제)
      searchNearbyFranchises(defaultPos).finally(() => {
        setLoading(false);
      });
    }
  };

  const createCurrentPositionMarker = (position) => {
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
    }
    
    const marker = new window.kakao.maps.Marker({
      map: mapInstanceRef.current,
      position: position
    });
    
    currentMarkerRef.current = marker;
  };

  const createFranchiseMarker = (position) => {
    if (franchiseMarkerRef.current) {
      franchiseMarkerRef.current.setMap(null);
    }
    
    const imageSize = new window.kakao.maps.Size(29, 40);
    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
    
    const marker = new window.kakao.maps.Marker({
      map: mapInstanceRef.current,
      position: position,
      image: markerImage
    });
    
    franchiseMarkerRef.current = marker;
    
    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      setShowFranchiseInfo(true);
    });
  };

  const searchNearbyFranchises = async (position) => {
    try {
      console.log('🔍 주변 가맹점 검색 시작...');
      
      const requestData = {
        latitude: position.getLat(),
        longitude: position.getLng(),
        franType: selectedCategory || null,
        radius: radius
      };
      
      console.log('📡 API 요청 데이터:', requestData);
      
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch('/api/franchise/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? (accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`) : ''
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('📡 API 응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 API 응답 데이터:', data);
      
      if (data.success) {
        console.log('✅ 가맹점 검색 성공:', data.franchises?.length || 0, '개');
        createFranchiseMarkers(data.franchises || []);
      } else {
        console.error('❌ 주변 가맹점 검색 실패:', data.error);
        // 에러가 있어도 빈 배열로 마커 생성
        createFranchiseMarkers([]);
      }
    } catch (error) {
      console.error('❌ 가맹점 검색 실패:', error);
      // 에러가 있어도 빈 배열로 마커 생성
      createFranchiseMarkers([]);
    }
  };

  const createFranchiseMarkers = (franchises) => {
    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    franchises.forEach((franchise, index) => {
      const position = new window.kakao.maps.LatLng(
        franchise.latitude,
        franchise.longitude
      );
      
      const imageSize = new window.kakao.maps.Size(24, 35);
      const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
      
      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: position,
        image: markerImage
      });
      
      markersRef.current.push(marker);
      
      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setFranchiseInfo(franchise);
        setShowFranchiseInfo(true);
      });
    });
  };

  const handleZoomChanged = () => {
    const map = mapInstanceRef.current;
    const level = map.getLevel();
    
    if (level === 5) {
      setRadius(0.5);
    } else if (level === 6) {
      setRadius(1);
    } else if (level === 7) {
      setRadius(2);
    } else if (level > 7) {
      map.setLevel(7);
    }
    
    if (currentPosition && !isFranchise) {
      searchNearbyFranchises(currentPosition);
    }
  };

  const handleMapClick = (mouseEvent) => {
    const latlng = mouseEvent.latLng;
    console.log(latlng.getLat() + "," + latlng.getLng());
    
    if (isFranchise) {
      setShowFranchiseInfo(false);
    } else {
      setShowFranchiseInfo(false);
    }
  };

  const fetchFranchiseData = async () => {
    if (!fidx) return;
    
    try {
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch(`/api/franchise/${fidx}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? (accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`) : ''
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setFranchiseData(data.franchise);
      } else {
        console.error('가맹점 정보 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('가맹점 정보 조회 실패:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch('/api/franchise/categories', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? (accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`) : ''
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('카테고리 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  const handleCategoryClick = (categoryIndex) => {
    setSelectedCategory(categoryIndex);
    if (currentPosition) {
      searchNearbyFranchises(currentPosition);
    }
  };

  const handlePhoneClick = (phone) => {
    if (phone && phone.trim() !== '') {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length >= 10) {
        window.location.href = `tel:${cleanPhone}`;
      } else {
        alert('유효하지 않은 전화번호입니다.');
      }
    } else {
      alert('전화번호가 없습니다.');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="franchisee-map-page">
      {/* Header */}
      <div className="franchisee-map-header">
        <button className="franchisee-map-back-btn" onClick={handleBackClick}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="franchisee-map-title">가맹점 찾기</h1>
      </div>

      {/* Search Options */}
      <div className="franchisee-map-search-options">
        <div className="franchisee-map-search-tabs">
          <button 
            className={`franchisee-map-search-tab ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            내 주변
          </button>
          {categories.map((category) => (
            <button
              key={category.storeCategoryIndex}
              className={`franchisee-map-search-tab ${selectedCategory === category.storeCategoryIndex ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.storeCategoryIndex)}
            >
              {category.storeCategoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="franchisee-map-container">
        {loading && (
          <div className="franchisee-map-loading">
            <div className="franchisee-map-loading-circle"></div>
            <p className="franchisee-map-loading-text">
              지도를<br />
              불러오는 중입니다.
            </p>
          </div>
        )}
        
        <div ref={mapRef} className="franchisee-map" />
        
        <button 
          className="franchisee-map-current-btn"
          onClick={searchCurrentPosition}
        >
          서울 시청
        </button>
      </div>

      {/* Franchise Info Panel */}
      {showFranchiseInfo && franchiseInfo && (
        <div className="franchisee-map-info-panel">
          <div className="franchisee-map-info-header">
            <button 
              className="franchisee-map-info-close"
              onClick={() => setShowFranchiseInfo(false)}
            >
              ×
            </button>
          </div>
          
          <div className="franchisee-map-info-content">
            <div className="franchisee-map-info-image">
              <img 
                src={franchiseInfo.image || "/assets/img/contents/franchise/list_img.svg"} 
                alt={franchiseInfo.name}
              />
              {!franchiseInfo.image && (
                <div className="franchisee-map-info-no-image">
                  <span>미설정</span>
                </div>
              )}
            </div>
            
            <div className="franchisee-map-info-details">
              <h3 className="franchisee-map-info-name">{franchiseInfo.name}</h3>
              <p className="franchisee-map-info-address">
                {franchiseInfo.address} {franchiseInfo.detailAddress}
              </p>
              
              <div className="franchisee-map-info-actions">
                <span className="franchisee-map-info-category">{franchiseInfo.category}</span>
                <div className="franchisee-map-info-buttons">
                  <button 
                    className="franchisee-map-info-phone"
                    onClick={() => handlePhoneClick(franchiseInfo.phone)}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="franchisee-map-info-map">
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseeMapPage; 