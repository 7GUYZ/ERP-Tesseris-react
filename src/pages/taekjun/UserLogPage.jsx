import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogApi } from '../../api/auth/TaekjunAuth';
import '../../styles/taekjun/UserLogPage.css';

const UserLogPage = () => {
  const navigate = useNavigate();
  const [currentUserIndex, setCurrentUserIndex] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 탭 상태
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'spent', 'received', 'income', 'expense'
  
  // 필터 상태
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [useDateFilter, setUseDateFilter] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  
  // 데이터 상태
  const [allLogs, setAllLogs] = useState([]);
  const [spentLogs, setSpentLogs] = useState([]);
  const [receivedLogs, setReceivedLogs] = useState([]);
  const [incomeLogs, setIncomeLogs] = useState([]);
  const [expenseLogs, setExpenseLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 페이지 로드 시 로컬스토리지에서 user_index 가져오기
  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
      const userIndex = userInfo.user_index;
      console.log('로컬스토리지 전체 데이터:', userInfo);
      console.log('로컬스토리지에서 가져온 user_index:', userIndex);
      
      if (userIndex && userIndex !== 0) {
        setCurrentUserIndex(userIndex);
        console.log('설정된 currentUserIndex:', userIndex);
      } else {
        console.error('user-info에 user_index가 없거나 0입니다.');
        setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      }
    } catch (err) {
      console.error('user-info 파싱 오류:', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
    }
  }, []);

  // API 호출 함수들
  const fetchAllLogs = useCallback(async (page = 0) => {
    if (!currentUserIndex) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = useDateFilter 
        ? await userLogApi.getAllLogs(currentUserIndex, page, 20, selectedYear, selectedMonth)
        : await userLogApi.getAllLogs(currentUserIndex, page, 20);
      
      if (response.data.resultCode === 200) {
        setAllLogs(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setCurrentPage(page);
      } else {
        setError(response.data.resultMessage || '전체 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('전체 내역 조회 오류:', err);
      setError('전체 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex, selectedYear, selectedMonth, useDateFilter]);

  const fetchSpentLogs = useCallback(async (page = 0) => {
    if (!currentUserIndex) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = useDateFilter 
        ? await userLogApi.getSpentLogs(currentUserIndex, page, 20, selectedYear, selectedMonth)
        : await userLogApi.getSpentLogs(currentUserIndex, page, 20);
      
      if (response.data.resultCode === 200) {
        setSpentLogs(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setCurrentPage(page);
      } else {
        setError(response.data.resultMessage || '지출 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('지출 내역 조회 오류:', err);
      setError('지출 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex, selectedYear, selectedMonth, useDateFilter]);

  const fetchReceivedLogs = useCallback(async (page = 0) => {
    if (!currentUserIndex) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = useDateFilter 
        ? await userLogApi.getReceivedLogs(currentUserIndex, page, 20, selectedYear, selectedMonth)
        : await userLogApi.getReceivedLogs(currentUserIndex, page, 20);
      
      if (response.data.resultCode === 200) {
        setReceivedLogs(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setCurrentPage(page);
      } else {
        setError(response.data.resultMessage || '수입 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('수입 내역 조회 오류:', err);
      setError('수입 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex, selectedYear, selectedMonth, useDateFilter]);

  // 수입 거래 조회
  const fetchIncomeLogs = useCallback(async (page = 0) => {
    if (!currentUserIndex) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await userLogApi.getIncomeLogs(currentUserIndex, page, 20);
      
      if (response.data.resultCode === 200) {
        setIncomeLogs(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setCurrentPage(page);
      } else {
        setError(response.data.resultMessage || '수입 거래를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('수입 거래 조회 오류:', err);
      setError('수입 거래를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex]);

  // 지출 거래 조회
  const fetchExpenseLogs = useCallback(async (page = 0) => {
    if (!currentUserIndex) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await userLogApi.getExpenseLogs(currentUserIndex, page, 20);
      
      if (response.data.resultCode === 200) {
        setExpenseLogs(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalElements(response.data.data.totalElements || 0);
        setCurrentPage(page);
      } else {
        setError(response.data.resultMessage || '지출 거래를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('지출 거래 조회 오류:', err);
      setError('지출 거래를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentUserIndex]);

  const fetchStatistics = useCallback(async () => {
    if (!currentUserIndex) return;
    
    try {
      const response = await userLogApi.getStatistics(currentUserIndex);
      
      if (response.data.resultCode === 200) {
        setStatistics(response.data.data);
      }
    } catch (err) {
      console.error('통계 조회 오류:', err);
    }
  }, [currentUserIndex]);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (currentUserIndex) {
      setCurrentPage(0);
      if (activeTab === 'all') {
        fetchAllLogs(0);
      } else if (activeTab === 'spent') {
        fetchSpentLogs(0);
      } else if (activeTab === 'received') {
        fetchReceivedLogs(0);
      } else if (activeTab === 'income') {
        fetchIncomeLogs(0);
      } else if (activeTab === 'expense') {
        fetchExpenseLogs(0);
      }
      fetchStatistics();
    }
  }, [currentUserIndex, activeTab, selectedYear, selectedMonth, fetchAllLogs, fetchSpentLogs, fetchReceivedLogs, fetchIncomeLogs, fetchExpenseLogs, fetchStatistics]);

  // 페이지 변경 시 데이터 로드
  const handlePageChange = (newPage) => {
    if (activeTab === 'all') {
      fetchAllLogs(newPage);
    } else if (activeTab === 'spent') {
      fetchSpentLogs(newPage);
    } else if (activeTab === 'received') {
      fetchReceivedLogs(newPage);
    } else if (activeTab === 'income') {
      fetchIncomeLogs(newPage);
    } else if (activeTab === 'expense') {
      fetchExpenseLogs(newPage);
    }
  };

  // 현재 표시할 데이터
  const getCurrentData = () => {
    switch (activeTab) {
      case 'all':
        return allLogs;
      case 'spent':
        return spentLogs;
      case 'received':
        return receivedLogs;
      case 'income':
        return incomeLogs;
      case 'expense':
        return expenseLogs;
      default:
        return [];
    }
  };

  // 거래 타입 텍스트 변환
  const getTransactionTypeText = (typeIndex) => {
    switch (typeIndex) {
      case 1:
        return '중개수수료';
      case 8:
        return '판매';
      case 9:
        return '구매';
      case 14:
        return '쿠폰';
      case 15:
        return '쿠폰발행취소';
      default:
        return '기타';
    }
  };

  // 결제 타입 텍스트 변환
  const getPaymentTypeText = (paymentIndex) => {
    switch (paymentIndex) {
      case 1:
        return '입금';
      case 2:
        return '출금';
      default:
        return '기타';
    }
  };

  // 금액 포맷팅
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '0';
    const sign = amount < 0 ? '-' : '';
    return sign + Math.abs(amount).toLocaleString() + ' CM';
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 년도 옵션 생성
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  // 월 옵션 생성
  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  // 필터 적용
  const applyFilter = () => {
    setCurrentPage(0);
    setShowFilter(false);
    
    // 필터 적용 시 현재 탭에 맞는 데이터 다시 로드
    if (currentUserIndex) {
      if (activeTab === 'all') {
        fetchAllLogs(0);
      } else if (activeTab === 'spent') {
        fetchSpentLogs(0);
      } else if (activeTab === 'received') {
        fetchReceivedLogs(0);
      } else if (activeTab === 'income') {
        fetchIncomeLogs(0);
      } else if (activeTab === 'expense') {
        fetchExpenseLogs(0);
      }
    }
  };

  return (
    <div className="user-log-page">
      <div className="user-log-container">
        {/* 헤더 */}
        <div className="user-log-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="page-title">CM 사용 내역</h1>
        </div>

        {/* 통계 정보 */}
        {statistics && (
          <div className="statistics-section">
            <div className="statistics-card">
              <div className="statistics-item">
                <span className="statistics-label">총 거래 수</span>
                <span className="statistics-value">{statistics.totalTransactions?.toLocaleString() || 0}건</span>
              </div>
              <div className="statistics-item">
                <span className="statistics-label">총 지출</span>
                <span className="statistics-value spent">{formatAmount(statistics.totalSpent || 0)}</span>
              </div>
              <div className="statistics-item">
                <span className="statistics-label">총 수입</span>
                <span className="statistics-value received">{formatAmount(statistics.totalReceived || 0)}</span>
              </div>
              <div className="statistics-item">
                <span className="statistics-label">총 쿠폰 사용</span>
                <span className="statistics-value">{formatAmount(statistics.totalCouponUsed || 0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            전체 내역
          </button>
          <button 
            className={`tab-button ${activeTab === 'spent' ? 'active' : ''}`}
            onClick={() => setActiveTab('spent')}
          >
            내가 쓴 금액
          </button>
          <button 
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            내가 받은 금액
          </button>
          <button 
            className={`tab-button ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            수입 거래
          </button>
          <button 
            className={`tab-button ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            지출 거래
          </button>
          <button 
            className="filter-button"
            onClick={() => setShowFilter(!showFilter)}
          >
            📅
          </button>
        </div>

        {/* 필터 섹션 */}
        {showFilter && (
          <div className="filter-section">
            <div className="filter-content">
              <div className="filter-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={useDateFilter}
                    onChange={(e) => setUseDateFilter(e.target.checked)}
                    className="filter-checkbox"
                  />
                  날짜 필터 사용
                </label>
              </div>
              {useDateFilter && (
                <>
                  <div className="filter-item">
                    <label>년도:</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="filter-select"
                    >
                      {generateYearOptions().map(year => (
                        <option key={year} value={year}>{year}년</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>월:</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="filter-select"
                    >
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}월</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <button 
                className="apply-filter-button"
                onClick={applyFilter}
              >
                적용
              </button>
            </div>
          </div>
        )}

        {/* 메시지 */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* 사용자 정보 확인 */}
        {!currentUserIndex && (
          <div className="info-message">
            사용자 정보를 불러오는 중입니다...
          </div>
        )}

        {/* 내역 목록 */}
        <div className="log-list-container">
          {loading ? (
            <div className="loading-message">로딩 중...</div>
          ) : getCurrentData().length === 0 ? (
            <div className="no-data-message">
              {activeTab === 'all' && '전체 내역이 없습니다.'}
              {activeTab === 'spent' && '지출 내역이 없습니다.'}
              {activeTab === 'received' && '수입 내역이 없습니다.'}
            </div>
          ) : (
            <>
              <div className="log-list">
                {getCurrentData().map((log, index) => (
                  <div key={log.userCmLogIndex || index} className="log-item">
                    <div className="log-header">
                      <div className="log-type">
                        {getTransactionTypeText(log.userCmLogTransactionTypeIndex)}
                      </div>
                      <div className={`log-amount ${log.userCmLogValue < 0 ? 'negative' : 'positive'}`}>
                        {formatAmount(log.userCmLogValue)}
                      </div>
                    </div>
                    
                    <div className="log-details">
                      <div className="log-reason">
                        {log.userCmLogReason || '거래 사유 없음'}
                      </div>
                      <div className="log-time">
                        {formatDate(log.formattedCreateTime)}
                      </div>
                    </div>
                    
                    {log.userCouponValue > 0 && (
                      <div className="log-coupon">
                        쿠폰 사용: {formatAmount(log.userCouponValue)}
                      </div>
                    )}
                    
                    <div className="log-parties">
                      {log.triggerUserName && (
                        <div className="log-party">
                          <span className="party-label">요청자:</span>
                          <span className="party-name">{log.triggerUserName}</span>
                        </div>
                      )}
                      {log.partyUserName && (
                        <div className="log-party">
                          <span className="party-label">상대방:</span>
                          <span className="party-name">{log.partyUserName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 페이징 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    이전
                  </button>
                  <span className="page-info">
                    {currentPage + 1} / {totalPages} (총 {totalElements}건)
                  </span>
                  <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogPage; 