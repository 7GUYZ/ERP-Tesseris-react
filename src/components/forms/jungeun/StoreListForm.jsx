import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../../../styles/jungeun/storeList.css";
import { getImage, storeCategoryFilter, storeList } from "../../../api/auth/JungeunAuth";
import { Image } from "lucide-react";

const MAIN_COLOR = "#170F58";
const POINT_COLOR = "#FDCD00";

// 이미지 로딩 상태 관리를 위한 커스텀 훅
const useImageLoader = (imageUrl) => {
    const [imageState, setImageState] = useState({
        loading: false,
        loaded: false,
        error: false,
        data: null
    });

    useEffect(() => {
        if (!imageUrl) {
            setImageState({ loading: false, loaded: false, error: true, data: null });
            return;
        }

        setImageState({ loading: true, loaded: false, error: false, data: null });

        // 이미지 API 호출 함수
        const loadImage = async () => {
            try {
                const response = await getImage(imageUrl); // imageUrl이 fileKey

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                
                setImageState({
                    loading: false,
                    loaded: true,
                    error: false,
                    data: objectUrl
                });
            } catch (error) {
                console.error('이미지 로딩 실패:', error);
                setImageState({
                    loading: false,
                    loaded: false,
                    error: true,
                    data: null
                });
            }
        };

        loadImage();

        // cleanup: object URL 해제
        return () => {
            if (imageState.data) {
                URL.revokeObjectURL(imageState.data);
            }
        };
    }, [imageUrl]);

    return imageState;
};

// 지도 컴포넌트
export const Map = ({ stores = [] }) => {
    const container = useRef(null);
    const markersRef = useRef([]);
    const infoWindowsRef = useRef([]);
    const mapRef = useRef(null);

    useEffect(() => {
        function createMapAndMarkers() {
            if (!container.current) {
                console.warn("지도 container가 아직 준비되지 않았습니다.");
                return;
            }

            window.kakao.maps.load(() => {
                const position = new window.kakao.maps.LatLng(33.450701, 126.570667);
                const options = {
                    center: position,
                    level: 7
                };
                const map = new window.kakao.maps.Map(container.current, options);
                mapRef.current = map;

                // 기존 마커/인포윈도우 제거
                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];
                infoWindowsRef.current.forEach(info => info.close());
                infoWindowsRef.current = [];

                if (stores.length === 0) return;

                const geocoder = new window.kakao.maps.services.Geocoder();
                const bounds = new window.kakao.maps.LatLngBounds();

                stores.forEach(store => {
                    geocoder.addressSearch(store.storeAddress, (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                            const marker = new window.kakao.maps.Marker({
                                map,
                                position: coords
                            });
                            markersRef.current.push(marker);
                            bounds.extend(coords);

                            const nameSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(store.storeName)}`;
                            const addressSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(store.storeAddress)}`;
                            const infoWindow = new window.kakao.maps.InfoWindow({
                                content: `<div style="padding:6px 12px;font-size:14px;white-space:nowrap;">
                                    <a href='${nameSearchUrl}' target='_blank' rel='noopener noreferrer' style='color:#170F58;text-decoration:none;font-weight:bold;font-size:15px;'>${store.storeName}</a><br/>
                                    <a href='${addressSearchUrl}' target='_blank' rel='noopener noreferrer' style='color:#555;text-decoration:underline;font-size:13px;'>${store.storeAddress}</a>
                                </div>`,
                                removable: true
                            });
                            infoWindow.open(map, marker);
                            infoWindowsRef.current.push(infoWindow);
                        }
                        map.setBounds(bounds);
                    });
                });
            });
        }

        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            createMapAndMarkers();
        } else {
            if (!document.getElementById("kakao-map-script")) {
                const script = document.createElement("script");
                script.id = "kakao-map-script";
                const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY;
                
                // 환경변수 디버깅
                console.log('🔍 환경변수 확인:', {
                    apiKey: apiKey ? '설정됨' : '설정되지 않음',
                    apiKeyValue: apiKey ? `${apiKey.substring(0, 8)}...` : '없음',
                    envVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
                });

                if (!apiKey) {
                    console.error('❌ 카카오 지도 API 키가 설정되지 않았습니다!');
                    console.error('📝 .env 파일에 REACT_APP_KAKAO_MAP_API_KEY=d3847b4792faef3e7980502f1f8e30f2 를 추가하고 서버를 재시작해주세요.');
                    return;
                }

                script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
                script.async = true;
                script.onload = createMapAndMarkers;
                script.onerror = () => {
                    console.error('❌ 카카오 지도 스크립트 로드 실패');
                };
                document.head.appendChild(script);
            } else {
                document.getElementById("kakao-map-script").addEventListener("load", createMapAndMarkers);
            }
        }

        // cleanup: 지도, 마커, 인포윈도우 등 리소스 해제
        return () => {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
            infoWindowsRef.current.forEach(info => info.close());
            infoWindowsRef.current = [];
            if (mapRef.current) {
                mapRef.current = null;
            }
        };
    }, [stores]);

    return (
        <div
            ref={container}
            style={{
                width: '100%',
                height: '500px',
                minHeight: '300px',
                background: '#eaeaea',
                borderRadius: '12px'
            }}
        ></div>
    );
};

const StoreListForm = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    // category 쿼리 없으면 "0"(전체)로
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "0");
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "list"); // "list" 또는 "map"
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(false);

    // 쿼리스트링이 바뀔 때마다 state 동기화
    useEffect(() => {
        let category = searchParams.get("category");
        if (!category) category = "0";
        const tab = searchParams.get("tab") || "list";
        setSelectedCategory(category);
        setActiveTab(tab);
    }, [searchParams]);

    // 카테고리/탭 변경 시 쿼리스트링 동기화
    useEffect(() => {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (activeTab) params.tab = activeTab;
        setSearchParams(params, { replace: true });
    }, [selectedCategory, activeTab, setSearchParams]);

    // 카테고리 목록 가져오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await storeCategoryFilter();
                console.log('카테고리 데이터:', res.data);
                if (res.data.resultCode === 200) {
                    // 전체 옵션 추가
                    const allCategories = [
                        { store_category_index: 0, store_category_name: "전체" },
                        ...res.data.data.map(item => ({
                            store_category_index: item.categoryIndex,
                            store_category_name: item.categoryName
                        }))
                    ];
                    console.log('설정된 카테고리:', allCategories);
                    setCategories(allCategories);
                }
            } catch (e) {
                console.error('카테고리 로딩 오류:', e);
            }
        };
        fetchCategories();
    }, []);

    // 카테고리가 바뀔 때마다 백엔드에서 데이터 받아오기
    useEffect(() => {
        const user_index = Number(JSON.parse(localStorage.getItem("user-info"))?.user_index);
        const fetchStores = async () => {
            if (selectedCategory === null || selectedCategory === undefined) {
                setStores([]);
                return;
            }
            try {
                const categoryIndex = selectedCategory ? Number(selectedCategory) : 0;
                const res = await storeList(user_index, categoryIndex);
             
                if (res.data.resultCode === 200) {
                    setStores(res.data.data);
                 
                }
            } catch (e) {
                
                setStores([]);
            }
        };
        fetchStores();
    }, [selectedCategory]);

    // 이미지가 없을 때 표시할 컴포넌트
    const NoImageComponent = ({ show = false }) => (
        <div className={`store-list-no-image-container ${show ? 'show' : ''}`}>
            <Image size={32} color="#9CA3AF" />
            <p className="store-list-no-image-text">등록된 이미지가 없습니다</p>
        </div>
    );

    // 이미지 로딩 중 표시할 컴포넌트
    const LoadingImageComponent = () => (
        <div className="store-list-loading-image-container">
            <div className="loading-spinner"></div>
            <p className="store-list-loading-text">이미지 로딩 중...</p>
        </div>
    );

    const StoreCard = ({ store }) => {
        // 이미지 로딩 상태 관리
        const imageState = useImageLoader(store.storeImage);

        return (
            <div className="business-partner-card" style={{ padding: 0 }}>
                {/* 이미지 영역 */}
                <div className="store-list-image-container">
                    {imageState.loading ? (
                        // 로딩 중
                        <LoadingImageComponent />
                    ) : imageState.loaded ? (
                        // 이미지 로딩 성공
                        <>
                            <img
                                src={imageState.data}
                                alt="가맹점 이미지"
                                className="store-list-image"
                            />
                            <NoImageComponent show={false} />
                        </>
                    ) : (
                        // 이미지 로딩 실패 또는 이미지 없음
                        <NoImageComponent show={true} />
                    )}
                </div>
                <div className="card-header" style={{ padding: "1.2rem 1.5rem 0.5rem 1.5rem" }}>
                    <div
                        className="company-info"
                        style={{
                            display: "flex",
                            flexDirection: "row", // row로 변경
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem"
                        }}
                    >
                        <h3 className="company-name" style={{ fontSize: "1.1rem", margin: 0 }}>{store.storeName || '가맹점명 없음'}</h3>
                        <div
                            className="position-badge"
                            style={{
                                backgroundColor: POINT_COLOR,
                                color: MAIN_COLOR,
                                borderColor: POINT_COLOR,
                                fontSize: "0.9rem",
                                padding: "0.3rem 0.8rem",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {store.storeCategoryName || '업종 없음'}
                        </div>
                    </div>
                </div>

                <div className="card-content" style={{ padding: "0 1.5rem 1.2rem 1.5rem" }}>
                    <div className="info-row">
                        <span className="info-label">가맹점명</span>
                        <span className="info-value">{store.storeName || '정보 없음'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">업종</span>
                        <span className="info-value">{store.storeCategoryName || '정보 없음'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">사용 가능 CM</span>
                        <span className="info-value">{store.userCmUse ? store.userCmUse.toLocaleString() : '0'} CM</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">영업 상태</span>
                        <span className="info-value">
                            {store.storeBusinessState === 0 && '영업 종료'}
                            {store.storeBusinessState === 1 && '영업 중'}
                            {store.storeBusinessState === 2 && '영업일 아님'}
                            {store.storeBusinessState === 3 && '브레이크 타임'}
                            {store.storeBusinessState === 4 && '영업일 미지정'}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">전화번호</span>
                        <span className="info-value">{store.storePhone || '정보 없음'}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">주소</span>
                        <span className="info-value">{store.storeAddress || '정보 없음'}</span>
                    </div>
                </div>

                <div className="card-actions" style={{ padding: "0 1.5rem 1.2rem 1.5rem" }}>
                    <button className="action-button primary" style={{ backgroundColor: MAIN_COLOR, color: '#fff' }}
                        onClick={() => navigate(`/StoreList/StoreDetail/${store.storeIndex}${location.search}`)}
                    >
                        가맹점 상세정보
                    </button>
                </div>
            </div>
        )
    }

    const TabSelector = ({ activeTab, onTabChange }) => {
        return (
            <div className="tab-selector">
                <button
                    className={`tab-button ${activeTab === "list" ? "active" : ""}`}
                    onClick={() => onTabChange("list")}
                    style={{
                        borderColor: MAIN_COLOR,
                        background: activeTab === "list" ? MAIN_COLOR : "transparent",
                        color: activeTab === "list" ? "#fff" : MAIN_COLOR,
                    }}
                >
                    목록
                </button>
                <button
                    className={`tab-button ${activeTab === "map" ? "active" : ""}`}
                    onClick={() => onTabChange("map")}
                    style={{
                        borderColor: MAIN_COLOR,
                        background: activeTab === "map" ? MAIN_COLOR : "transparent",
                        color: activeTab === "map" ? "#fff" : MAIN_COLOR,
                    }}
                >
                    지도 보기
                </button>
            </div>
        )
    }

    const StoreList = ({ stores, category }) => {
        const displayCategoryName = category?.store_category_name || "전체";
        return (
            <div className="business-partner-list">
                <div className="list-header">
                    <div className="list-title-section">
                        <h2 className="list-title" style={{ color: MAIN_COLOR }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.2em", color: MAIN_COLOR }}>
                                {displayCategoryName}
                            </span>
                            <span style={{ marginLeft: 14, color: "#888", fontSize: "1em" }}>
                                {displayCategoryName === "전체"
                                    ? "가맹점"
                                    : `${displayCategoryName} 가맹점`}
                            </span>
                        </h2>
                    </div>
                    <div className="total-count" style={{ background: MAIN_COLOR, color: '#fff' }}>
                        가맹점 수 : {stores.length}개
                    </div>
                </div>

                <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "list" ? (
                    stores.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🏪</div>
                            <p>해당 카테고리의 가맹점이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="partner-grid">
                            {stores.map((store) => (
                                <StoreCard key={store.storeIndex} store={store} />
                            ))}
                        </div>
                    )
                ) : (
                    stores.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🏪</div>
                            <p>해당 카테고리의 가맹점이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="map-container">
                            {activeTab === "map" && stores.length > 0 && (
                                <Map stores={stores} />
                            )}
                        </div>
                    )
                )}
            </div>
        )
    }

    const CategorySelector = ({ categories, selectedCategory, onCategorySelect }) => {
        return (
            <div className="grade-selector">
                <h2 className="selector-title" style={{ color: MAIN_COLOR }}>가맹점 업종 선택</h2>
                <div className="grade-buttons">
                    {categories.map((category) => (
                        <button
                            key={category.store_category_index}
                            className={`grade-button ${selectedCategory === String(category.store_category_index) ? "active" : ""}`}
                            onClick={() => onCategorySelect(String(category.store_category_index))}
                            style={{
                                borderColor: MAIN_COLOR,
                                background: selectedCategory === String(category.store_category_index) ? MAIN_COLOR : "transparent",
                                color: selectedCategory === String(category.store_category_index) ? "#fff" : MAIN_COLOR,
                            }}
                        >
                            <span className="grade-name">{category.store_category_name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="business-partner-page">
            <div className="page-header">
                <h1 className="page-title">가맹점 목록</h1>
                <p className="page-subtitle">선택한 카테고리의 가맹점 정보를 조회할 수 있습니다</p>
            </div>

            <CategorySelector categories={categories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            {selectedCategory !== "" && selectedCategory !== null && selectedCategory !== undefined && (
                <StoreList
                    stores={stores}
                    category={categories.find((c) => c.store_category_index === selectedCategory)}
                />
            )}
        </div>
    )
}

export default StoreListForm; 