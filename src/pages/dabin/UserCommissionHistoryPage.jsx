import React, { useState, useEffect } from 'react';
import { getUserCommissionHistory } from '../../api/auth/DabinAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/dabin/UserCommissionHistory.css';

const UserCommissionHistoryPage = () => {
    const [historyData, setHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);    
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const limit = 7;

    useEffect(() => {
        // 백엔드에서 JWT로 자동 처리하므로 바로 호출
        fetchHistoryData(1);
    }, []);

    const fetchHistoryData = async (page) => {
        setLoading(true);
        try {
            const response = await getUserCommissionHistory(page, limit);
            console.log('API Response:', response);
            
            if (response && response.data && response.data.success) {
                setHistoryData(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalCount(response.data.totalCount || 0);
                setCurrentPage(response.data.currentPage || page);
            } else {
                console.error('Failed to fetch history data:', response?.data?.message || 'Unknown error');
                setHistoryData([]);
                setTotalPages(1);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching history data:', error);
            console.error('Error details:', error.response?.data);
            setHistoryData([]);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchHistoryData(page);
        }
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}\n${hh}:${min}`;
    };

    const renderPagination = () => {
        const pages = [];
        
        // 처음 페이지
        if (currentPage > 1) {
            pages.push(
                <button key="first" onClick={() => handlePageChange(1)} className="user-commission-history-pagination-btn">
                    처음
                </button>
            );
            pages.push(
                <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="user-commission-history-pagination-btn">
                    이전
                </button>
            );
        }

        // 페이지 번호들
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`user-commission-history-pagination-btn${i === currentPage ? ' user-commission-history-active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        // 다음 페이지
        if (currentPage < totalPages) {
            pages.push(
                <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="user-commission-history-pagination-btn">
                    다음
                </button>
            );
            pages.push(
                <button key="last" onClick={() => handlePageChange(totalPages)} className="user-commission-history-pagination-btn">
                    마지막
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="user-commission-history-page" style={{ 
            fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            backgroundColor: '#f5f5f9',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div className="user-commission-history-sub-header">
                <div className="user-commission-history-back-arrow" onClick={handleBackClick}>
                    ←
                </div>
                <h2 className="user-commission-history-sub-header-title">수당 내역</h2>
            </div>

            {/* Main Content */}
            <div className="user-commission-history-content">
                <div className="user-commission-history-table-container">
                    {loading ? (
                        <div className="user-commission-history-loading">로딩 중...</div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="user-commission-history-table-header">
                                <div className="user-commission-history-table-row">
                                    <div>No</div>
                                    <div>충전인</div>
                                    <div>발생일</div>
                                    <div>충전내역</div>
                                    <div>수당지급</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="user-commission-history-table-body">
                                    {historyData.length > 0 ? (
                                        historyData.map((item, index) => (
                                        <div key={index} className="user-commission-history-table-body-row">
                                            <div className="user-commission-history-no-cell">{((currentPage - 1) * limit) + index + 1}</div>
                                            <div>
                                                <span className="user-commission-history-person-badge">
                                                    {item.userName}
                                                </span>
                                            </div>
                                            <div className="user-commission-history-date-cell">{formatDate(item.chargeDate)}</div>
                                            <div>
                                                <span className="user-commission-history-type-badge">
                                                    {item.description}
                                                </span>
                                            </div>
                                            <div className="user-commission-history-amount-cell">
                                                {formatNumber(item.commissionAmount)}
                                            </div>
                                        </div>
                                        ))
                                    ) : (
                                    <div className="user-commission-history-table-body-row">
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px' }}>
                                                내역이 없습니다.
                                        </div>
                                    </div>
                                    )}
                            </div>
                        </>
                    )}
                </div>



                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="user-commission-history-pagination">
                                    {renderPagination()}
                                </div>
                            )}
            </div>
        </div>
    );
};

export default UserCommissionHistoryPage; 