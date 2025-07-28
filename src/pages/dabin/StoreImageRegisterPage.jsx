import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dabin/StoreInfo.css';
import { getMyStoreImages, getStoreMyInfo, getPresignedUrl } from '../../api/auth/DabinAuth';
import { api } from '../../api/Http';

const MAX_DETAIL_IMAGES = 8;

const StoreImageRegisterPage = () => {
  const [mainImage, setMainImage] = useState(null); // {file, preview, id, url}
  const [detailImages, setDetailImages] = useState([]); // [{file, preview, id, url}]
  const [deleteIds, setDeleteIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const mainInputRef = useRef();
  const detailInputRef = useRef();
  const navigate = useNavigate();

  // 이미지 목록 불러오기 (JWT 방식)
  useEffect(() => {
    setLoading(true);
    getMyStoreImages()
      .then(async res => {
        const images = Array.isArray(res.data) ? res.data : [];
        // presigned URL 변환
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
        const main = urls.find(img => img.storeMainImageStatus === 'T');
        setMainImage(main ? { ...main, preview: main.presignedUrl, id: main.storeImageIndex, url: main.presignedUrl } : null);
        setDetailImages(urls.filter(img => img.storeMainImageStatus === 'N').map(img => ({ ...img, preview: img.presignedUrl, id: img.storeImageIndex, url: img.presignedUrl })));
      })
      .finally(() => setLoading(false));
  }, []);

  // 대표 이미지 업로드
  const handleMainChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setMainImage({ file, preview: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  // 상세 이미지 업로드
  const handleDetailChange = e => {
    const files = Array.from(e.target.files);
    if (detailImages.length + files.length > MAX_DETAIL_IMAGES) {
      alert(`상세 이미지는 최대 ${MAX_DETAIL_IMAGES}장까지 등록 가능합니다.`);
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setDetailImages(prev => [...prev, { file, preview: ev.target.result, id: prev.length + 1 }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 상세 이미지 삭제
  const deleteDetail = idx => {
    setDetailImages(prev => {
      const img = prev[idx];
      if (!img) return prev; // img가 없으면 아무것도 하지 않음
      if (img.id) {
        setDeleteIds(ids => [...ids, img.id]);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  // 저장 (JWT 방식)
  const handleSave = async () => {
    console.log('handleSave 호출');
    console.log('현재 deleteIds:', deleteIds);
    setLoading(true);
    try {
      // JWT 방식으로 storeIndex 조회
      const infoRes = await getStoreMyInfo();
      let storeIndex = null;
      if (infoRes && infoRes.data && infoRes.data.success) {
        storeIndex = infoRes.data.data.storeIndex;
      }
      if (!storeIndex) {
        alert('매장 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }
      // FormData 구성
      const formData = new FormData();
      formData.append('storeIndex', storeIndex);
      if (mainImage && mainImage.file) {
        formData.append('mainImage', mainImage.file);
      }
      detailImages.forEach(img => {
        if (img.file) {
          formData.append('detailImages', img.file);
        }
      });
      console.log('FormData에 deleteIds 추가:', deleteIds);
      deleteIds.forEach(id => {
        console.log('FormData에 추가하는 deleteId:', id);
        formData.append('deleteIds', id);
      });
      console.log('API 호출 시작: /store/images/batch');
      await api.post('/store/images/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      console.log('API 호출 성공');
      alert('저장되었습니다.');
      navigate(-1);
    } catch (e) {
      console.error('API 호출 실패:', e);
      alert('저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storeinfopage-edit-page">
      <div className="storeinfopage-header">
        <button onClick={() => navigate(-1)} className="storeinfopage-back-button" aria-label="뒤로가기">{'<'}</button>
        <span className="storeinfopage-title">이미지 등록</span>
        <button onClick={() => navigate(-1)} className="storeinfopage-edit-button">취소</button>
      </div>
      <div className="storeinfopage-content">
        {/* 대표 이미지 */}
        <div className="storeinfopage-section">
          <div className="storeinfopage-section-title">대표 이미지</div>
          <div className="storeinfopage-image-upload-container">
            <div className="storeinfopage-main-image-upload">
              {mainImage && mainImage.preview ? (
                <img src={mainImage.preview} alt="대표 이미지" className="storeinfopage-preview-image" />
              ) : (
                <span className="storeinfopage-upload-placeholder">+</span>
              )}
              <input type="file" accept="image/*" ref={mainInputRef} className="storeinfopage-file-input" onChange={handleMainChange} />
              <button onClick={() => mainInputRef.current.click()} className="storeinfopage-upload-button">업로드</button>
            </div>
            <div className="storeinfopage-upload-info">
              <div>* 매장의 대표 이미지로 사용할 사진을 등록해 주세요.</div>
              <div>* 4:3 비율, 최소 800x600 권장</div>
            </div>
          </div>
        </div>
        
        {/* 상세 이미지 */}
        <div className="storeinfopage-section">
          <div className="storeinfopage-section-title">상세 이미지</div>
          <div className="storeinfopage-detail-images-container">
            {detailImages.map((img, idx) => (
              <div key={idx} className="storeinfopage-detail-image-item">
                <img src={img.preview} alt="상세" className="storeinfopage-detail-preview" />
                <button 
                  onClick={e => { e.stopPropagation(); deleteDetail(idx); }} 
                  className="storeinfopage-delete-image-button"
                >
                  ×
                </button>
              </div>
            ))}
            {detailImages.length < MAX_DETAIL_IMAGES && (
              <div className="storeinfopage-add-detail-image" onClick={() => detailInputRef.current.click()}>
                <span className="storeinfopage-upload-placeholder">+</span>
                <input type="file" accept="image/*" multiple ref={detailInputRef} className="storeinfopage-file-input" onChange={handleDetailChange} />
                <span className="storeinfopage-add-text">사진 추가</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 하단 버튼 */}
      <div className="storeinfopage-action-buttons">
        <button onClick={() => navigate(-1)} className="storeinfopage-cancel-button">취소</button>
        <button onClick={handleSave} className="storeinfopage-save-button" disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default StoreImageRegisterPage; 