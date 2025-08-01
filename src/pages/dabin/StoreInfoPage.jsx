import React, { useState, useEffect } from 'react';
import { getStoreMyInfo, getMyStoreImages, getPresignedUrl } from '../../api/auth/DabinAuth';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import '../../styles/dabin/StoreInfo.css';

const StoreInfoPage = () => {
    const [storeInfo, setStoreInfo] = useState(null);
    const [storeImages, setStoreImages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // JWT 방식으로 데이터 조회 (백엔드에서 자동으로 사용자 정보 추출)
        fetchStoreData();
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
                } catch (error) {
                    console.error('Presigned URL 생성 실패:', error);
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
                setStoreInfo(storeInfoResponse.data.data);
            } else {
                console.error('Failed to fetch store info:', storeInfoResponse?.data?.message || 'Unknown error');
            }
            
            // 가맹점 이미지 조회 (JWT 방식)
            const storeImagesResponse = await getMyStoreImages();
            console.log('Store Images Response:', storeImagesResponse);
            
            if (storeImagesResponse && storeImagesResponse.data) {
                console.log('원본 이미지 데이터:', storeImagesResponse.data);
                await fetchPresignedUrls(storeImagesResponse.data);
            } else {
                console.error('이미지 데이터가 없습니다');
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
            <div className="storeinfopage-header" style={{ borderBottom: '1px solid #e0e0e0', background: '#fff', marginBottom: 0 }}>
                <button
                    onClick={handleBackClick}
                    className="storeinfopage-back-button"
                    aria-label="뒤로가기"
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}
                >
                    {"<"}
                </button>
                <span className="storeinfopage-title" style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '20px' }}>
                    매장 관리
                </span>
            </div>

            {/* Navigation Tabs */}
            <Box className="storeinfopage-tabs">
                <Typography 
                    variant="body1" 
                    className="storeinfopage-tab storeinfopage-tab-active"
                    sx={{ color: '#170F58', borderBottom: '2px solid #170F58', background: '#fff', fontWeight: 700 }}
                >
                    기본 정보
                </Typography>
                <Typography 
                    variant="body1" 
                    className="storeinfopage-tab storeinfopage-tab-inactive"
                    onClick={handleOperationClick}
                    sx={{ color: '#170F58', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                    운영정보
                </Typography>
            </Box>

            {/* Content */}
            <div className="storeinfopage-content">
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
                                                    onError={(e) => {
                                                        console.error('이미지 로드 실패:', image.storeImage);
                                                        // presigned URL이 실패하면 원본 URL로 재시도
                                                        if (e.target.src === image.presignedUrl && image.storeImage) {
                                                            e.target.src = image.storeImage;
                                                        } else {
                                                            // 이미지 로드 실패 시 기본 이미지 표시
                                                            e.target.style.display = 'none';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="storeinfopage-no-image-text">등록된 이미지가 없습니다</span>
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
                                                `${storeInfo.storeZoneCode || ''} ${storeInfo.storeAddress} ${storeInfo.storeDetailAddress || ''}`.trim() : 
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