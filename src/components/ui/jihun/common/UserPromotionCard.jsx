import React, { useEffect, useState } from "react";
import '../../../../styles/jihun/common/common.css';
import { getBannerList, getPresignedUrl } from "../../../../api/auth/JihunAuth";

export default function UserPromotionCard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastSlide, setLastSlide] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // 호출
      const response = await getBannerList();
      const visible = (response.data?.data || []).filter(b => b.bannerIsvisible === true);
      // 변환
      if (visible && visible.length > 0) {
        const bannersWithUrls = await fetchPresignedUrls(visible);
        setPromotions(bannersWithUrls.map(banner => banner.presignedUrl.data));
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  }

  // presigned URL 변환 함수
  const fetchPresignedUrls = async (banners) => {
    console.log('fetchPresignedUrls 호출, banners:', banners);
    console.log('banners type:', typeof banners);
    console.log('banners isArray:', Array.isArray(banners));

    if (!banners || !Array.isArray(banners) || banners.length === 0) {
      console.log('banners가 배열이 아니거나 비어있음');
      return [];
    }

    const bannersWithUrls = await Promise.all(
      banners.map(async (banner) => {
        try {
          const url = await getPresignedUrl(banner.bannerPhoto);
          return { ...banner, presignedUrl: url };
        } catch {
          return { ...banner, presignedUrl: null };
        }
      })
    );
    return bannersWithUrls;
  };

  const nextSlide = () => {
    if (isAnimating) return;
    if (promotions.length < 2) return;

    setIsAnimating(true);
    setCurrentSlide((prev) => {
      const next = (prev + 1) % promotions.length;
      // prev는 전환 직전의 활성 슬라이드 → lastSlide로 저장
      setLastSlide(prev);
      return next;
    });

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [promotions.length, isAnimating]);

  return (
    <>
      {promotions.length > 0 && (
        <div className="usermain-promotioncard">
          <div className="usermain-promotioncard-inner">
            {promotions.map((promotion, index) => {
              let className = 'usermain-promotioncard-slide';
              let zIndex = 1;

              if (index === currentSlide) {
                // 현재 활성 슬라이드 (가운데)
                className += ' active';
                zIndex = 3;
              } else if (index === lastSlide && isAnimating) {
                // 전환 중일 때만 직전 슬라이드를 왼쪽으로 이탈시키고,
                // 전환이 끝나면 오른쪽 대기 위치로 복귀시켜 다음 턴에서 우측→센터 진입
                className += ' slide-left';
                zIndex = 2;
              } else {
                // 나머지(다음 포함)는 오른쪽 대기 → 이후 활성화 시 오른쪽에서 진입
                className += ' slide-right';
                zIndex = 1;
              }

              const isVisible = index === currentSlide || (isAnimating && index === lastSlide);
              return (
                <div key={index} className={className} style={{ zIndex, visibility: isVisible ? 'visible' : 'hidden' }}>
                  <img src={promotion} alt={`Banner ${index + 1}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
} 