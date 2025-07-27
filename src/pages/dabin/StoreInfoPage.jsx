import React, { useState, useEffect } from 'react';
import { getStoreInfo, getStoreImages, getPresignedUrl } from '../../api/auth/DabinAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/dabin/StoreInfo.css';

const StoreInfoPage = () => {
    const [storeInfo, setStoreInfo] = useState(null);
    const [storeImages, setStoreImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userIndex, setUserIndex] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        // 세션에서 사용자 정보 가져오기
        const userIdx = sessionStorage.getItem('user_index');
        
        // 테스트용: 임의의 user_index 설정 (실제 테스트할 때만 사용)
        const testUserIndex = 110; // 여기에 테스트할 user_index 입력
        
        setUserIndex(testUserIndex); // 실제: parseInt(userIdx)
        
        // 테스트용: 임의의 user_index로 데이터 조회
        fetchStoreData(testUserIndex); // 실제: parseInt(userIdx)
    }, []);

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
        setStoreImages(urls);
    };

    const fetchStoreData = async (userIdx) => {
        setLoading(true);
        try {
            console.log('Fetching store data for userIndex:', userIdx);
            
            // 가맹점 정보 조회
            const storeInfoResponse = await getStoreInfo(userIdx);
            console.log('Store Info Response:', storeInfoResponse);
            
            if (storeInfoResponse && storeInfoResponse.data && storeInfoResponse.data.success) {
                setStoreInfo(storeInfoResponse.data.storeInfo);
            } else {
                console.error('Failed to fetch store info:', storeInfoResponse?.data?.message || 'Unknown error');
            }
            
            // 가맹점 이미지 조회
            const storeImagesResponse = await getStoreImages(userIdx);
            console.log('Store Images Response:', storeImagesResponse);
            // 응답 구조에 따라 안전하게 파싱
            let images = [];
            if (storeImagesResponse && storeImagesResponse.data) {
                if (Array.isArray(storeImagesResponse.data)) {
                    images = storeImagesResponse.data;
                } else if (Array.isArray(storeImagesResponse.data.images)) {
                    images = storeImagesResponse.data.images;
                } else if (Array.isArray(storeImagesResponse.data.data)) {
                    images = storeImagesResponse.data.data;
                }
            }
            await fetchPresignedUrls(images);
            
        } catch (error) {
            console.error('Error fetching store data:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    const handleEditClick = () => {
        navigate('/store/edit');
    };

    const handleImageScroll = (e) => {
        e.preventDefault();
        const container = e.currentTarget;
        container.scrollLeft += e.deltaY;
    };

    const handleOperationClick = () => {
        navigate('/store/operation');
    };

    return (
        <div className="storeinfopage-page">
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
                    <div className="storeinfopage-tab" onClick={handleOperationClick} style={{ cursor: 'pointer' }}>
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
                                    {storeImages.length > 0 ? (
                                        storeImages.map((image, index) => (
                                            <div key={index} className="storeinfopage-image-item">
                                                <img 
                                                    src={image.presignedUrl || image.storeImage} 
                                                    alt={`매장 이미지 ${index + 1}`}
                                                    className="storeinfopage-store-image"
                                                />
                                            </div>
                                        ))
                                    ) : ( // 이미지가 없습니다 텍스트로 대체하기 
                                        <div className="storeinfopage-no-image">
                                            <img 
                                                src="/assets/img/contents/franchise/list_img.svg" 
                                                alt="기본 이미지"
                                                className="storeinfopage-default-image"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Store Information Section */}
                        <div className="storeinfopage-section">
                            <div className="storeinfopage-section-title">
                                <span>매장 정보</span>
                            </div>
                            {storeInfo ? (
                                <div className="storeinfopage-info-list">
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">매장 명</span>
                                        <span className="storeinfopage-value">{storeInfo.storeName || '등록된 매장명이 없습니다.'}</span>
                                    </div>
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">매장 카테고리</span>
                                        <span className="storeinfopage-value">{storeInfo.storeCategoryName || '등록된 카테고리가 없습니다.'}</span>
                                    </div>
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">주소</span>
                                        <span className="storeinfopage-value">
                                            {storeInfo.storeAddress ? 
                                                `${storeInfo.storeZoneCode} ${storeInfo.storeAddress} ${storeInfo.storeDetailAddress || ''}`.trim() : 
                                                '등록된 주소가 없습니다.'
                                            }
                                        </span>
                                    </div>
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">연락처</span>
                                        <span className="storeinfopage-value">{storeInfo.storePhone || '등록된 연락처가 없습니다.'}</span>
                                    </div>
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">대표 사이트</span>
                                        <span className="storeinfopage-value">
                                            {storeInfo.storeSite || '등록된 사이트가 없습니다.'}
                                        </span>
                                    </div>
                                    <div className="storeinfopage-info-item">
                                        <span className="storeinfopage-label">소개</span>
                                        <span className="storeinfopage-value">
                                            {storeInfo.storeMemo || '등록된 업체의 소개정보가 존재하지 않습니다.'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="storeinfopage-no-data">
                                    매장 정보를 불러올 수 없습니다.
                                </div>
                            )}
                        </div>
                        {/* 하단 정보변경(수정) 버튼 */}
                        <button
                            className="storeinfopage-change-button"
                            onClick={handleEditClick}
                        >
                            수정
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreInfoPage; 