import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storeListApi } from '../../api/auth/TaekjunAuth';
import { Map } from '../../components/forms/jungeun/StoreListForm';
import '../../styles/taekjun/StoreDetail.css';

const StoreDetail = () => {
  const navigate = useNavigate();
  const { storeIndex } = useParams();
  const [storeDetail, setStoreDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 가맹점 상세 정보 가져오기
  const fetchStoreDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await storeListApi.getStoreDetail(storeIndex);
      console.log('태균님 가맹점 상세 데이터:', response.data);
      if (response.data.resultCode === 200) {
        setStoreDetail(response.data.data);
        console.log('태균님 설정된 가맹점 상세:', response.data.data);
      } else {
        setError(response.data.resultMessage || '가맹점 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('가맹점 상세 정보 로딩 오류:', err);
      setError('가맹점 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [storeIndex]);

  useEffect(() => {
    if (storeIndex) {
      fetchStoreDetail();
    }
  }, [storeIndex, fetchStoreDetail]);

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
        return '영업시간이 설정되지 않았습니다.';
      default:
        return '영업시간이 설정되지 않았습니다.';
    }
  };

  // 전화번호 클릭 처리
  const handlePhoneClick = () => {
    if (storeDetail?.storePhone) {
      window.location.href = `tel:${storeDetail.storePhone}`;
    }
  };

  // 지도 클릭 처리
  const handleMapClick = () => {
    if (storeDetail?.storeAddress) {
      // 카카오맵 또는 네이버맵으로 주소 검색
      const address = encodeURIComponent(storeDetail.storeAddress);
      window.open(`https://map.naver.com/search2/searchMore.naver?query=${address}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="store-detail-page">
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-detail-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!storeDetail) {
    return (
      <div className="store-detail-page">
        <div className="no-data-message">가맹점 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="store-detail-page">
      {/* 헤더 */}
      <div className="store-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <button className="close-button" onClick={() => navigate('/store-list')}>
          ✕
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="store-detail-content">

        {/* 영업 상태 바 */}
        <div className="business-status-bar">
          {getBusinessStatusText(storeDetail.storeBusinessState)}
        </div>

        {/* 가맹점 기본 정보 */}
        <div className="store-basic-info">
          <div className="store-name">
            {storeDetail.storeName}
          </div>
          <div className="store-category">
            {storeDetail.storeCategoryName}
          </div>
        </div>

        {/* CM 정보 및 액션 버튼 */}
        <div className="store-actions">
          <button className="cm-button">
            {storeDetail.userCmUse?.toLocaleString()}만 CM 가능
          </button>
          <div className="action-icons">
            <button className="action-icon phone-icon" onClick={handlePhoneClick}>
              📞
            </button>
            <button className="action-icon location-icon" onClick={handleMapClick}>
              📍
            </button>
          </div>
        </div>

        {/* 정보 탭 */}
        <div className="info-tab">
          <span>정보</span>
        </div>

        {/* 상세 정보 */}
        <div className="store-detail-info">
          <div className="info-section">
            <div className="info-item">
              <span className="info-label">주소</span>
              <span className="info-value">{storeDetail.storeAddress}</span>
            </div>
            
            {/* 가맹점 위치 지도 */}
            <div className="store-map-section">
              <div className="info-label">위치</div>
              <div className="store-map-container">
                <Map stores={[storeDetail]} />
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-label">연락처</span>
              <span className="info-value">{storeDetail.storePhone}</span>
            </div>
            
            {storeDetail.storeSite && (
              <div className="info-item">
                <span className="info-label">홈페이지</span>
                <span className="info-value">
                  <a href={storeDetail.storeSite} target="_blank" rel="noopener noreferrer">
                    {storeDetail.storeSite}
                  </a>
                </span>
              </div>
            )}
            
            {storeDetail.storeBusinessHour && (
              <div className="info-item">
                <span className="info-label">영업시간</span>
                <span className="info-value">{storeDetail.storeBusinessHour}</span>
              </div>
            )}
            
            {storeDetail.storeRestHour && (
              <div className="info-item">
                <span className="info-label">휴게시간</span>
                <span className="info-value">{storeDetail.storeRestHour}</span>
              </div>
            )}
            
            {storeDetail.storeBusinessDate && (
              <div className="info-item">
                <span className="info-label">영업일</span>
                <span className="info-value">{storeDetail.storeBusinessDate}</span>
              </div>
            )}
            
            <div className="info-item">
              <span className="info-label">영업 상태</span>
              <span className="info-value">{getBusinessStatusText(storeDetail.storeBusinessState)}</span>
            </div>
            
            {storeDetail.storeTemporaryClosingDate && (
              <div className="info-item">
                <span className="info-label">임시 휴무</span>
                <span className="info-value">
                  {storeDetail.storeTemporaryClosingDate}
                  {storeDetail.storeTemporam && ` (${storeDetail.storeTemporam})`}
                </span>
              </div>
            )}
          </div>

          {/* 가맹점 소개 */}
          {storeDetail.storeMemo && (
            <div className="store-introduction">
              <h3 className="introduction-title">가맹점 소개</h3>
              <div className="introduction-content">
                {storeDetail.storeMemo}
              </div>
            </div>
          )}

          {/* 가맹점 이미지 갤러리 */}
          {storeDetail.storeImages && storeDetail.storeImages.length > 0 && (
            <div className="store-gallery">
              <h3 className="gallery-title">가맹점 사진</h3>
              <div className="gallery-grid">
                {storeDetail.storeImages.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`${storeDetail.storeName} 이미지 ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail; 