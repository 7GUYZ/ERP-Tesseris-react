import React, { useState, useEffect, useRef } from 'react';
import { getStoreMyInfo, getMyStoreImages, updateStoreInfo, getPresignedUrl, getStoreCategories } from '../../api/auth/DabinAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/dabin/StoreInfo.css';

const StoreEditPage = () => {
    const [storeInfo, setStoreInfo] = useState(null);
    const [storeImages, setStoreImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    
    // Form states
    const [formData, setFormData] = useState({
        storeName: '',
        storeCategoryName: '',
        storePhone: '',
        storeSite: '',
        storeZoneCode: '',
        storeAddress: '',
        storeDetailAddress: '',
        storeMemo: ''
    });
    
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [charCount, setCharCount] = useState(0);
    
    const navigate = useNavigate();

    useEffect(() => {
        // JWT 방식으로 데이터 조회 (백엔드에서 자동으로 사용자 정보 추출)
        fetchStoreData();
        fetchCategories();
    }, []);

    // 카테고리 목록 조회
    const fetchCategories = async () => {
        try {
            const response = await getStoreCategories();
            if (response && response.data && response.data.resultCode === 200) {
                const categories = response.data.data.map(category => ({
                    value: category.storeCategoryName,
                    label: category.storeCategoryName
                }));
                setCategoryOptions(categories);
            } else {
                console.error('Failed to fetch categories:', response?.data?.resultMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // presigned URL 변환 함수
    const fetchPresignedUrls = async (images) => {
        if (!images || images.length === 0) {
            setStoreImages([]);
            return;
        }
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
        
        // 메인 이미지(storeMainImageStatus === 'T')를 먼저 정렬
        const sortedUrls = urls.sort((a, b) => {
            if (a.storeMainImageStatus === 'T' && b.storeMainImageStatus !== 'T') return -1;
            if (a.storeMainImageStatus !== 'T' && b.storeMainImageStatus === 'T') return 1;
            return 0;
        });
        
        setStoreImages(sortedUrls);
    };

    const fetchStoreData = async () => {
        setLoading(true);
        try {
            console.log('Fetching store data using JWT authentication');
            
            // 가맹점 정보 조회 (JWT 방식)
            const storeInfoResponse = await getStoreMyInfo();
            console.log('Store Info Response:', storeInfoResponse);
            
            if (storeInfoResponse && storeInfoResponse.data && storeInfoResponse.data.success) {
                const info = storeInfoResponse.data.data;
                setStoreInfo(info);
                setFormData({
                    storeName: info.storeName || '',
                    storeCategoryName: info.storeCategoryName || '',
                    storePhone: info.storePhone || '',
                    storeSite: info.storeSite || '',
                    storeZoneCode: info.storeZoneCode || '',
                    storeAddress: info.storeAddress || '',
                    storeDetailAddress: info.storeDetailAddress || '',
                    storeMemo: info.storeMemo || ''
                });
                setCharCount(info.storeMemo ? info.storeMemo.length : 0);
            } else {
                console.error('Failed to fetch store info:', storeInfoResponse?.data?.message || 'Unknown error');
            }
            
            // 가맹점 이미지 조회 (JWT 방식)
            const storeImagesResponse = await getMyStoreImages();
            console.log('Store Images Response:', storeImagesResponse);
            
            if (storeImagesResponse && storeImagesResponse.data) {
                await fetchPresignedUrls(storeImagesResponse.data);
            } else {
                setStoreImages([]);
            }
            
        } catch (error) {
            console.error('Error fetching store data:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/store');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (field === 'storeMemo') {
            setCharCount(value.length);
        }
    };

    const handleCategorySelect = (categoryValue) => {
        setFormData(prev => ({
            ...prev,
            storeCategoryName: categoryValue
        }));
        setShowCategoryDropdown(false);
    };

    const handleAddressSearch = () => {
        // 카카오 주소 검색 API 호출
        if (typeof window !== 'undefined' && window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    let addr = '';
                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }
                    
                    setFormData(prev => ({
                        ...prev,
                        storeZoneCode: data.zonecode,
                        storeAddress: addr,
                        storeDetailAddress: ''
                    }));
                },
                onclose: function(state) {
                    // 팝업이 닫힐 때 실행되는 콜백
                    if (state === 'FORCE_CLOSE') {
                        // 사용자가 검색 결과를 선택하지 않고 팝업을 닫은 경우
                    } else if (state === 'COMPLETE_CLOSE') {
                        // 검색 결과를 선택한 경우
                    }
                }
            }).open();
        } else {
            // 스크립트가 로드되지 않은 경우 동적으로 로드
            const script = document.createElement('script');
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.onload = () => {
                // 스크립트 로드 완료 후 다시 주소 검색 실행
                setTimeout(() => handleAddressSearch(), 100);
            };
            script.onerror = () => {
                alert('주소 검색 서비스를 불러올 수 없습니다. 인터넷 연결을 확인해주세요.');
            };
            document.head.appendChild(script);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.storeName.trim()) {
            alert('매장 명을 입력해주세요.');
            return;
        }
        if (!formData.storeAddress.trim()) {
            alert('주소를 입력해주세요.');
            return;
        }
        if (!formData.storePhone.trim()) {
            alert('핸드폰 번호를 입력해주세요.');
            return;
        }

        setSaving(true);
        try {
            // JWT 방식으로 업데이트 (백엔드에서 자동으로 사용자 정보 추출)
            const response = await updateStoreInfo(null, formData);
            console.log('Update Response:', response);
            
            if (response && response.data && response.data.success) {
                alert(response.data.message);
                navigate('/store');
            } else {
                alert(response?.data?.message || '가맹점 정보 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating store info:', error);
            alert('가맹점 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageScroll = (e) => {
        e.preventDefault();
        const container = e.currentTarget;
        container.scrollLeft += e.deltaY;
    };

    return (
        <div className="storeinfopage-edit-page">
            {/* Header */}
            <div className="storeinfopage-header">
                <button
                    onClick={handleBackClick}
                    className="storeinfopage-back-button"
                    aria-label="뒤로가기"
                >
                    {"<"}
                </button>
                <span className="storeinfopage-title">
                    매장 관리
                </span>
            </div>

            {/* Content */}
            <div className="storeinfopage-content">
                {/* Tab Navigation */}
                <div className="storeinfopage-tab-container">
                    <div className="storeinfopage-tab active">
                        기본 정보
                    </div>
                    <div className="storeinfopage-tab" onClick={() => navigate('/store/operation')} style={{ cursor: 'pointer' }}>
                        운영정보
                    </div>
                </div>

                {loading ? (
                    <div className="storeinfopage-loading">로딩 중...</div>
                ) : (
                    <>
                        {/* Store Images Section */}
                        <div className="storeinfopage-section">
                            <div className="storeinfopage-section-title">
                                <span>매장 이미지</span>
                                <span className="storeinfopage-max-images">최대 9장</span>
                            </div>
                            <div className="storeinfopage-image-container" onWheel={handleImageScroll}>
                                <div className="storeinfopage-image-list">
                                    {/* 삭제: 사진 추가 버튼 및 업로드 UI */}
                                    {/* 이미지만 보여주기 */}
                                    {storeImages.map((image, index) => (
                                        <div key={index} className="storeinfopage-image-item">
                                            {image.presignedUrl ? (
                                            <img 
                                                src={image.presignedUrl}
                                                alt={`매장 이미지 ${index + 1}`}
                                                className="storeinfopage-store-image"
                                                width={100}
                                                height={75}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            ) : (
                                                <span>이미지 없음</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* 삭제: 파일 input 및 업로드 관련 코드 */}
                            {/* 사진 등록 페이지로 이동하는 버튼 */}
                            <button
                                type="button"
                                className="storeinfopage-edit-button"
                                style={{ marginTop: 16 }}
                                onClick={() => navigate('/store/image-register')}
                            >
                                이미지 등록/설정
                            </button>
                        </div>

                        {/* Store Information Form */}
                        <div className="storeinfopage-section">
                            <div className="storeinfopage-section-title">
                                <span>매장 정보</span>
                            </div>
                            
                            <div className="storeinfopage-form-list">
                                {/* Store Name */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">매장 명</label>
                                    <input
                                        type="text"
                                        className="storeinfopage-input"
                                        value={formData.storeName}
                                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                                        placeholder="매장명을 입력해주세요."
                                    />
                                </div>
                                
                                {/* Store Category */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">매장 카테고리</label>
                                    <div className="storeinfopage-select-container">
                                        <div 
                                            className={`storeinfopage-select${showCategoryDropdown ? ' selected' : ''}`}
                                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        >
                                            <span>{formData.storeCategoryName || '카테고리를 선택해주세요'}</span>
                                            <img 
                                                src="/assets/img/layout/svg/icon_shevron_down.svg" 
                                                alt=""
                                                className={showCategoryDropdown ? 'rotated' : ''}
                                            />
                                        </div>
                                        {showCategoryDropdown && (
                                            <div className="storeinfopage-dropdown">
                                                {categoryOptions.map((category, index) => (
                                                    <div
                                                        key={index}
                                                        className="storeinfopage-dropdown-item"
                                                        onClick={() => handleCategorySelect(category.value)}
                                                    >
                                                        {category.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Address */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">주소</label>
                                    <div className="storeinfopage-address-container">
                                        <input
                                            type="text"
                                            className="storeinfopage-input storeinfopage-postcode"
                                            value={formData.storeZoneCode}
                                            placeholder="우편번호"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="storeinfopage-address-button"
                                            onClick={handleAddressSearch}
                                        >
                                            우편번호 검색
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="storeinfopage-input"
                                        value={formData.storeAddress}
                                        placeholder="주소 입력"
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className="storeinfopage-input"
                                        value={formData.storeDetailAddress}
                                        onChange={(e) => handleInputChange('storeDetailAddress', e.target.value)}
                                        placeholder="상세주소 입력"
                                    />
                                </div>
                                
                                {/* Phone */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">연락처</label>
                                    <input
                                        type="tel"
                                        className="storeinfopage-input"
                                        value={formData.storePhone}
                                        onChange={(e) => handleInputChange('storePhone', e.target.value)}
                                        placeholder="연락처를 입력해주세요."
                                    />
                                </div>
                                
                                {/* Website */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">대표 사이트</label>
                                    <input
                                        type="url"
                                        className="storeinfopage-input"
                                        value={formData.storeSite}
                                        onChange={(e) => handleInputChange('storeSite', e.target.value)}
                                        placeholder="대표사이트 주소를 입력해주세요."
                                    />
                                </div>
                                
                                {/* Description */}
                                <div className="storeinfopage-form-item">
                                    <label className="storeinfopage-label">매장 소개</label>
                                    <textarea
                                        className="storeinfopage-textarea"
                                        value={formData.storeMemo}
                                        onChange={(e) => handleInputChange('storeMemo', e.target.value)}
                                        placeholder="상세 소개를 입력하세요."
                                        maxLength={500}
                                    />
                                    <div className="storeinfopage-char-count">
                                        <span className={charCount > 0 ? 'active' : ''}>{charCount}</span>
                                        <span> / 500</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <div className="storeinfopage-action-buttons">
                <button
                    type="button"
                    className="storeinfopage-cancel-button"
                    onClick={handleBackClick}
                    disabled={loading}
                    style={{ flex: 1 }}
                >
                    취소
                </button>
                <button
                    type="button"
                    className="storeinfopage-edit-button"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ flex: 1 }}
                >
                    {saving ? '저장 중...' : '저장'}
                </button>
            </div>
        </div>
    );
};

export default StoreEditPage; 