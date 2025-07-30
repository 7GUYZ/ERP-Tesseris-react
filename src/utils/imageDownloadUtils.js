// 이미지 다운로드 유틸리티 함수들
export const downloadImage = async (imageUrl, fileName) => {
  try {
    // 모바일 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일에서는 새 탭에서 이미지 열기
      const newWindow = window.open(imageUrl, '_blank');
      if (newWindow) {
        console.log('이미지가 새 탭에서 열렸습니다. 브라우저에서 "이미지 저장" 기능을 사용하세요.');
        // 사용자에게 안내 메시지
        setTimeout(() => {
          alert('이미지가 새 탭에서 열렸습니다.\n\n📱 모바일에서 저장하는 방법:\n• 이미지를 길게 누르기\n• "이미지 저장" 또는 "사진에 저장" 선택\n\n💻 데스크톱에서 저장하는 방법:\n• 이미지 우클릭 → "이미지 저장"');
        }, 100);
      } else {
        // 팝업이 차단된 경우
        alert('팝업이 차단되었습니다.\n\n📱 모바일에서 저장하는 방법:\n• 이미지를 길게 누르기\n• "이미지 저장" 또는 "사진에 저장" 선택');
      }
    } else {
      // 데스크톱에서는 직접 다운로드 시도
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    alert('이미지 다운로드에 실패했습니다. 이미지를 우클릭하여 "이미지 저장"을 선택해주세요.');
  }
};

export const handleMouseDown = (imageUrl, fileName, setLongPressTimer) => {
  const timerId = setTimeout(() => {
    downloadImage(imageUrl, fileName);
  }, 500);
  setLongPressTimer(timerId);
};

export const handleMouseUp = (setLongPressTimer) => {
  if (setLongPressTimer) {
    clearTimeout(setLongPressTimer);
    setLongPressTimer(null);
  }
};

export const handleTouchStart = (imageUrl, fileName, setLongPressTimer) => {
  const timerId = setTimeout(() => {
    downloadImage(imageUrl, fileName);
  }, 1000); // 모바일에서는 1초로 늘림
  setLongPressTimer(timerId);
};

export const handleTouchEnd = (setLongPressTimer) => {
  if (setLongPressTimer) {
    clearTimeout(setLongPressTimer);
    setLongPressTimer(null);
  }
}; 