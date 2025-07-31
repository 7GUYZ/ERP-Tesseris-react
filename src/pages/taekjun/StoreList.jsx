import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeListApi } from '../../api/auth/TaekjunAuth';
import { Map } from '../../components/forms/jungeun/StoreListForm';
import '../../styles/taekjun/StoreList.css';

const StoreList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    fetchCategories();
  }, []);

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await storeListApi.getStoreCategories();
      console.log('태균님 카테고리 데이터:', response.data);
      if (response.data.resultCode === 200) {
        setCategories(response.data.data);
        console.log('태균님 설정된 카테고리:', response.data.data);
      }
    } catch (err) {
      console.error('카테고리 로딩 오류:', err);
    }
  };

  // 가맹점 목록 가져오기
  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await storeListApi.getFilteredStoreList(selectedCategory);
      console.log('태균님 가맹점 데이터:', response.data);
      if (response.data.resultCode === 200) {
        setStores(response.data.data);
        console.log('태균님 설정된 가맹점:', response.data.data);
        // 영업시간 데이터 확인
        response.data.data.forEach((store, index) => {
          console.log(`가맹점 ${index + 1}:`, {
            storeName: store.storeName,
            storeImage: store.storeImage,
            storeImageType: typeof store.storeImage,
            storeImageLength: store.storeImage?.length,
            storeBusinessDate: store.storeBusinessDate,
            storeBusinessHour: store.storeBusinessHour,
            storeRestHour: store.storeRestHour,
            storeBusinessState: store.storeBusinessState
          });
        });
      } else {
        setError(response.data.resultMessage || '가맹점 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('가맹점 목록 로딩 오류:', err);
      setError('가맹점 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchStores();
  }, [selectedCategory, fetchStores]);

  // 검색 실행
  const handleSearch = () => {
    fetchStores();
  };

  // 가맹점 상세 페이지로 이동
  const handleStoreClick = (storeIndex) => {
    navigate(`/store-detail/${storeIndex}`);
  };

  // 영업 상태 텍스트 변환
  const getBusinessStatusText = (status) => {
    switch (status) {
      case 0:
        return '영업종료';
      case 1:
        return '영업중';
      case 2:
        return '영업요일 아님';
      case 3:
        return '브레이크타임';
      case 4:
        return '영업시간 미설정';
      default:
        return '영업시간 미설정';
    }
  };

  // 영업 상태에 따른 스타일 클래스
  const getBusinessStatusClass = (status) => {
    switch (status) {
      case 0:
        return 'status-closed';
      case 1:
        return 'status-open';
      case 2:
        return 'status-closed';
      case 3:
        return 'status-break';
      case 4:
        return 'status-unknown';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="store-list-page">
      {/* 헤더 */}
      <div className="store-list-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title">가맹점 찾기</h1>
      </div>

      {/* 뷰 모드 탭 */}
      <div className="view-mode-tabs">
        <button 
          className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          목록 검색
        </button>
        <button 
          className={`view-tab ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          지도보기
        </button>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="search-filter-section">
        {/* 카테고리 필터 */}
        <div className="category-filters">
          <button 
            className={`category-tab ${selectedCategory === 0 ? 'active' : ''}`}
            onClick={() => setSelectedCategory(0)}
          >
            전체
          </button>
          {categories.map((category) => (
            <button 
              key={category.categoryIndex}
              className={`category-tab ${selectedCategory === category.categoryIndex ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.categoryIndex)}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        {/* 검색 입력 */}
        <div className="search-input-group">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요."
            className="search-input"
          />
          <button 
            onClick={handleSearch}
            className="search-button"
            disabled={loading}
          >
            검색
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}



      {/* 가맹점 목록 또는 지도 */}
      <div className="store-list-content">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : stores.length === 0 ? (
          <div className="no-data-message">
            검색 조건에 맞는 가맹점이 없습니다.
          </div>
        ) : viewMode === 'map' ? (
          // 지도 모드
          <div className="map-container">
            <Map stores={stores} />
          </div>
        ) : (
          // 목록 모드
          <div className="store-grid">
            {stores.map((store) => (
              <div 
                key={store.storeIndex} 
                className="store-card"
                onClick={() => handleStoreClick(store.storeIndex)}
              >
                {/* 가맹점 이미지 */}
                <div className="store-image">
                  {store.storeImage ? (
                    <img 
                      src={store.storeImage} 
                      alt={store.storeName}
                      onLoad={() => console.log('✅ 이미지 로드 성공:', store.storeImage)}
                      onError={(e) => {
                        console.error('❌ 이미지 로드 실패:', store.storeImage);
                        e.target.style.display = 'none';
                        const placeholder = e.target.nextSibling;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="store-image-placeholder" style={{ display: store.storeImage ? 'none' : 'flex' }}>
                    <span>🏪</span>
                  </div>
                </div>

                {/* 가맹점 정보 */}
                <div className="store-info">
                  <div className="store-name">
                    {store.storeName}
                  </div>
                  <div className="store-address">
                    {store.storeAddress}
                  </div>
                  <div className="store-category">
                    {store.storeCategoryName}
                  </div>
                  {/* 영업시간 정보 추가 */}
                  {store.storeBusinessDate && (
                    <div className="store-business-info">
                      <span className="business-label">영업일:</span>
                      <span className="business-value">{store.storeBusinessDate}</span>
                    </div>
                  )}
                  {store.storeBusinessHour && (
                    <div className="store-business-info">
                      <span className="business-label">영업시간:</span>
                      <span className="business-value">{store.storeBusinessHour}</span>
                    </div>
                  )}
                  {store.storeRestHour && (
                    <div className="store-business-info">
                      <span className="business-label">휴게시간:</span>
                      <span className="business-value">{store.storeRestHour}</span>
                    </div>
                  )}
                </div>

                {/* CM 정보 및 액션 버튼 */}
                <div className="store-actions">
                  <button className="cm-button">
                    {store.userCmUse?.toLocaleString()}만 CM 가능
                  </button>
                  <div className="action-icons">
                    <button className="action-icon phone-icon">
                      📞
                    </button>
                    <button className="action-icon location-icon">
                      📍
                    </button>
                  </div>
                </div>

                {/* 영업 상태 */}
                <div className={`business-status ${getBusinessStatusClass(store.storeBusinessState)}`}>
                  {getBusinessStatusText(store.storeBusinessState)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList; 