import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dabin/StoreInfo.css';
import { getStoreImages, uploadStoreImage, getStoreInfo, getPresignedUrl } from '../../api/auth/DabinAuth';
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
  // 실제는 세션 등에서 받아와야 함
  const userIndex = parseInt(sessionStorage.getItem('user_index') || '110', 10);

  // 이미지 목록 불러오기
  useEffect(() => {
    setLoading(true);
    getStoreImages(userIndex)
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
  }, [userIndex]);

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

  // 저장
  const handleSave = async () => {
    console.log('handleSave 호출');
    console.log('현재 deleteIds:', deleteIds);
    setLoading(true);
    try {
      // userIndex로 storeIndex 조회
      const infoRes = await getStoreInfo(userIndex);
      let storeIndex = null;
      if (infoRes && infoRes.data) {
        if (infoRes.data.storeInfo && infoRes.data.storeInfo.storeIndex) {
          storeIndex = infoRes.data.storeInfo.storeIndex;
        } else if (infoRes.data.data && infoRes.data.data.storeIndex) {
          storeIndex = infoRes.data.data.storeIndex;
        }
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
    <div className="store-info-page">
      <div className="store-info-header">
        <button onClick={() => navigate(-1)} className="store-info-back-button" aria-label="뒤로가기">{'<'}</button>
        <span className="store-info-title">이미지 등록</span>
        <button onClick={() => navigate(-1)} className="store-info-edit-button">취소</button>
      </div>
      <div className="store-info-content">
        {/* 대표 이미지 */}
        <div className="store-info-section">
          <div className="store-info-section-title">대표 이미지</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 240, height: 180, border: '2px dashed #ccc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, background: '#fafafa', position: 'relative' }}>
              {mainImage && mainImage.preview ? (
                <img src={mainImage.preview} alt="대표 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              ) : (
                <span style={{ color: '#bbb', fontSize: 32 }}>+</span>
              )}
              <input type="file" accept="image/*" ref={mainInputRef} style={{ display: 'none' }} onChange={handleMainChange} />
              <button onClick={() => mainInputRef.current.click()} style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>업로드</button>
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>* 매장의 대표 이미지로 사용할 사진을 등록해 주세요.</div>
            <div style={{ fontSize: 13, color: '#666' }}>* 4:3 비율, 최소 800x600 권장</div>
          </div>
        </div>
        {/* 상세 이미지 */}
        <div className="store-info-section">
          <div className="store-info-section-title">상세 이미지</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {detailImages.map((img, idx) => (
              <div key={idx} style={{ width: 100, height: 75, border: '2px dashed #ccc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', position: 'relative' }}>
                <img src={img.preview} alt="상세" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                <button onClick={e => { e.stopPropagation(); deleteDetail(idx); }} style={{ position: 'absolute', top: 2, right: 2, background: '#fff', border: '1px solid #ccc', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontWeight: 'bold' }}>×</button>
              </div>
            ))}
            {detailImages.length < MAX_DETAIL_IMAGES && (
              <div style={{ width: 100, height: 75, border: '2px dashed #ccc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', cursor: 'pointer', position: 'relative' }} onClick={() => detailInputRef.current.click()}>
                <span style={{ color: '#bbb', fontSize: 32 }}>+</span>
                <input type="file" accept="image/*" multiple ref={detailInputRef} style={{ display: 'none' }} onChange={handleDetailChange} />
                <span style={{ position: 'absolute', bottom: 4, left: 0, width: '100%', textAlign: 'center', fontSize: 12, color: '#888' }}>사진 추가</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 하단 버튼을 위로 올림 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, background: 'linear-gradient(90deg, #6e6e6e 0%, #ffd600 100%)', borderRadius: 12, padding: '12px 0' }}>
        <button onClick={() => navigate(-1)} style={{ minWidth: 120, background: '#888', border: 'none', color: '#fff', fontWeight: 500, fontSize: 16, borderRadius: 8, padding: '10px 0', cursor: 'pointer' }}>취소</button>
        <button onClick={handleSave} style={{ minWidth: 120, background: '#ffd600', border: 'none', color: '#333', fontWeight: 700, fontSize: 16, borderRadius: 8, padding: '10px 0', cursor: 'pointer' }} disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
      </div>
    </div>
  );
};

export default StoreImageRegisterPage; 