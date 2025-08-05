import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../../../styles/jungeun/storeList.css";
import { storeCategoryFilter, storeList } from "../../../api/auth/JungeunAuth";
import { Image, ChevronLeft } from "lucide-react";

const MAIN_COLOR = "#170F58";
const POINT_COLOR = "#FDCD00";

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

                let completedGeocoding = 0;
                const totalStores = stores.length;

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
                        
                        completedGeocoding++;
                        // 모든 주소 변환이 완료된 후에 지도 범위 설정
                        if (completedGeocoding === totalStores) {
                            map.setBounds(bounds);
                        }
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
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("store_category_index") ?? "0");
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "list"); // "list" 또는 "map"
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // URL 파라미터에서 user_index 가져오기, 없으면 로그인한 유저의 user_index 사용
    const urlUserIndex = searchParams.get("user_index");
    const [currentUserIndex, setCurrentUserIndex] = useState(
        urlUserIndex ? Number(urlUserIndex) : Number(JSON.parse(localStorage.getItem("user-info"))?.user_index)
    );

    // 쿼리스트링이 바뀔 때마다 state 동기화
    useEffect(() => {
        let category = searchParams.get("store_category_index");
        if (!category) category = "0";
        const tab = searchParams.get("tab") || "list";
        setSelectedCategory(category);
        setActiveTab(tab);
        
        // user_index도 업데이트
        const newUrlUserIndex = searchParams.get("user_index");
        if (newUrlUserIndex) {
            setCurrentUserIndex(Number(newUrlUserIndex));
        }
    }, [searchParams]);

    // 카테고리/탭 변경 시 쿼리스트링 동기화
    useEffect(() => {
        const params = {};
        if (selectedCategory) params.store_category_index = selectedCategory;
        if (activeTab) params.tab = activeTab;
        // user_index도 유지
        if (currentUserIndex !== Number(JSON.parse(localStorage.getItem("user-info"))?.user_index)) {
            params.user_index = currentUserIndex;
        }
        setSearchParams(params, { replace: true });
    }, [selectedCategory, activeTab, currentUserIndex, setSearchParams]);

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
        console.log('🔍 URL 파라미터 디버깅:', {
            urlUserIndex: urlUserIndex,
            parsedUrlUserIndex: urlUserIndex ? Number(urlUserIndex) : null,
            localStorageUserIndex: Number(JSON.parse(localStorage.getItem("user-info"))?.user_index),
            currentUserIndex: currentUserIndex,
            selectedCategory: selectedCategory
        });
        
        const fetchStores = async () => {
            if (selectedCategory === null || selectedCategory === undefined) {
                setStores([]);
                return;
            }
            try {
                const categoryIndex = selectedCategory ? Number(selectedCategory) : 0;
                console.log('📞 API 호출:', { user_index: currentUserIndex, categoryIndex });
                const res = await storeList(currentUserIndex, categoryIndex);
             
                if (res.data.resultCode === 200) {
                    console.log('📦 받아온 스토어 데이터:', res.data.data);
                    console.log('📦 첫 번째 스토어 이미지 정보:', res.data.data[0]?.storeImage);
                    setStores(res.data.data);
                 
                }
            } catch (e) {
                console.error('❌ 스토어 데이터 로딩 오류:', e);
                setStores([]);
            }
        };
        fetchStores();
    }, [selectedCategory, currentUserIndex]);

    // 이미지가 없을 때 표시할 컴포넌트
    const NoImageComponent = ({ show = false }) => (
        <div className={`store-list-no-image-container ${show ? 'show' : ''}`}>
            <Image size={32} color="#9CA3AF" />
            <p className="store-list-no-image-text">등록된 이미지가 없습니다</p>
        </div>
    );

    const StoreCard = ({ store }) => {
        console.log('🖼️ 스토어 이미지 정보:', {
            storeIndex: store.storeIndex,
            storeName: store.storeName,
            storeImage: store.storeImage,
            storeImageType: typeof store.storeImage,
            storeImageLength: store.storeImage?.length
        });

        return (
            <div className="storelist-business-partner-card" style={{ padding: 0 }}>
                {/* 이미지 영역 */}
                <div className="store-list-image-container">
                    {store.storeImage ? (
                        // 이미지가 있으면 바로 표시
                        <img
                            src={store.storeImage}
                            alt="가맹점 이미지"
                            className="store-list-image"
                            onError={(e) => {
                                console.error('❌ 이미지 로드 실패:', store.storeImage);
                                // 이미지 로드 실패 시 기본 이미지 표시
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={() => {
                                console.log('✅ 이미지 로드 성공:', store.storeImage);
                            }}
                        />
                    ) : null}
                    {/* 이미지가 없거나 로드 실패 시 표시할 컴포넌트 */}
                    <NoImageComponent show={!store.storeImage} />
                </div>
                <div className="storelist-card-header" style={{ padding: "1.2rem 1.5rem 0.5rem 1.5rem" }}>
                    <div
                        className="storelist-company-info"
                        style={{
                            display: "flex",
                            flexDirection: "row", // row로 변경
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem"
                        }}
                    >
                        <h3 className="storelist-company-name" style={{ fontSize: "1.1rem", margin: 0 }}>{store.storeName || '가맹점명 없음'}</h3>
                        <div
                            className="storelist-position-badge"
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

                <div className="storelist-card-content" style={{ padding: "0 1.5rem 1.2rem 1.5rem" }}>
                    <div className="storelist-info-row">
                        <span className="storelist-info-label">가맹점명</span>
                        <span className="storelist-info-value">{store.storeName || '정보 없음'}</span>
                    </div>
                    <div className="storelist-info-row">
                        <span className="storelist-info-label">업종</span>
                        <span className="storelist-info-value">{store.storeCategoryName || '정보 없음'}</span>
                    </div>
                    <div className="storelist-info-row">
                                    <span className="storelist-info-label">사용 가능 TS</span>
            <span className="storelist-info-value">{store.userCmUse ? store.userCmUse.toLocaleString() : '0'} TS</span>
                    </div>
                    <div className="storelist-info-row">
                        <span className="storelist-info-label">영업 상태</span>
                        <span className="storelist-info-value">
                            {store.storeBusinessState === 0 && '영업 종료'}
                            {store.storeBusinessState === 1 && '영업 중'}
                            {store.storeBusinessState === 2 && '영업일 아님'}
                            {store.storeBusinessState === 3 && '브레이크 타임'}
                            {store.storeBusinessState === 4 && '영업일 미지정'}
                        </span>
                    </div>
                    <div className="storelist-info-row">
                        <span className="storelist-info-label">전화번호</span>
                        <span className="storelist-info-value">{store.storePhone || '정보 없음'}</span>
                    </div>
                    <div className="storelist-info-row">
                        <span className="storelist-info-label">주소</span>
                        <span className="storelist-info-value">{store.storeAddress || '정보 없음'}</span>
                    </div>
                </div>

                <div className="storelist-card-actions" style={{ padding: "0 1.5rem 1.2rem 1.5rem" }}>
                    <button className="storelist-action-button primary" style={{ backgroundColor: MAIN_COLOR, color: '#fff' }}
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
            <div className="storelist-tab-selector">
                <button
                    className={`storelist-tab-button ${activeTab === "list" ? "active" : ""}`}
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
                    className={`storelist-tab-button ${activeTab === "map" ? "active" : ""}`}
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
            <div className="storelist-business-partner-list">
                <div className="storelist-list-header">
                    <div className="storelist-list-title-section">
                        <h2 className="storelist-list-title" style={{ color: MAIN_COLOR }}>
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
                    <div className="storelist-total-count" style={{ background: MAIN_COLOR, color: '#fff' }}>
                        가맹점 수 : {stores.length}개
                    </div>
                </div>

                <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "list" ? (
                    stores.length === 0 ? (
                        <div className="storelist-empty-state">
                            <div className="storelist-empty-icon">🏪</div>
                            <p>해당 카테고리의 가맹점이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="storelist-partner-grid">
                            {stores.map((store) => (
                                <StoreCard key={store.storeIndex} store={store} />
                            ))}
                        </div>
                    )
                ) : (
                    stores.length === 0 ? (
                        <div className="storelist-empty-state">
                            <div className="storelist-empty-icon">🏪</div>
                            <p>해당 카테고리의 가맹점이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="storelist-map-container">
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
            <div className="storelist-grade-selector">
                <h2 className="storelist-selector-title" style={{ color: MAIN_COLOR }}>가맹점 업종 선택</h2>
                <div className="storelist-grade-buttons">
                    {categories.map((category) => (
                        <button
                            key={category.store_category_index}
                            className={`storelist-grade-button ${selectedCategory === String(category.store_category_index) ? "active" : ""}`}
                            onClick={() => onCategorySelect(String(category.store_category_index))}
                            style={{
                                borderColor: MAIN_COLOR,
                                background: selectedCategory === String(category.store_category_index) ? MAIN_COLOR : "transparent",
                                color: selectedCategory === String(category.store_category_index) ? "#fff" : MAIN_COLOR,
                            }}
                        >
                            <span className="storelist-grade-name">{category.store_category_name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const handleGoBack = () => {
        window.history.back();
    };

    // user_index 파라미터가 있으면 산하 사업자에서 온 것으로 판단
    const isFromBusinessList = urlUserIndex !== null;

    return (
        <div className="storelist-business-partner-page">
            {/* 뒤로가기 버튼과 헤더 */}
            <div className="storelist-header-section">
                {isFromBusinessList && (
                    <button className="storelist-back-button" onClick={handleGoBack}>
                        <ChevronLeft size={24} />
                    </button>
                )}
                <div className="storelist-page-header">
                    <h1 className="storelist-page-title">가맹점 목록</h1>
                    <p className="storelist-page-subtitle">선택한 카테고리의 가맹점 정보를 조회할 수 있습니다</p>
                </div>
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