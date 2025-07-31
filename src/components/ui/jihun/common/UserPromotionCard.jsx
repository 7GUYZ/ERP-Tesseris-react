import React, { useEffect, useState } from "react";
import '../../../../styles/jihun/common/common.css';
import { getBannerList, getPresignedUrl } from "../../../../api/auth/JihunAuth";

export default function UserPromotionCard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // 호출
      const response = await getBannerList();
      console.log("배너 목록", response.data.data.map(banner => banner.bannerPhoto));
      // 변환
      if (response.data.data && response.data.data.length > 0) {
        const bannersWithUrls = await fetchPresignedUrls(response.data.data);
        console.log("포함된 배너 URL", bannersWithUrls.map(banner => banner.presignedUrl.data));
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
    
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
    
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
               const prevIndex = (currentSlide - 1 + promotions.length) % promotions.length;
               const nextIndex = (currentSlide + 1) % promotions.length;
               
               let className = 'usermain-promotioncard-slide';
               let zIndex = 1;
               
               if (index === currentSlide) {
                 className += ' active';
                 zIndex = 4;
               } else if (index === prevIndex) {
                 className += ' slide-left';
                 zIndex = 3;
               } else if (index === nextIndex) {
                 className += ' slide-right';
                 zIndex = 2;
               } else {
                 className += ' slide-right';
                 zIndex = 1;
               }
               
               return (
                 <div 
                   key={index} 
                   className={className}
                   style={{ zIndex: zIndex }}
                 >
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