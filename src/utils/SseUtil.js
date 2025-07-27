class SseConnection {
    constructor() {
      this.eventSource = null;
      this.userIndex = null;
    }
  
    connect(userIndex) {
      this.userIndex = userIndex;
      
      // URL 파라미터로 userId 전달
      this.eventSource = new EventSource(`http://localhost:19093/api/alarms/subscribe?userIndex=${userIndex}`);
  
      this.eventSource.onopen = () => {
        console.log('SSE 연결 성공');
      };
  
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // 알림 처리 로직
        this.handleNotification(data);
      };
  
      this.eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        this.reconnect();
      };
    }
  
    handleNotification(data) {
      // 토스트 알림 표시
      // 알림 목록 업데이트
      // 등등...
    }
  
    reconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        setTimeout(() => {
          this.connect(this.userIndex);
        }, 5000);
      }
    }
  
    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  }
  
  export const sseConnection = new SseConnection();