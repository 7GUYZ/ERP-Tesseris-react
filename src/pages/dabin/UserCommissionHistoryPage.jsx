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
    const limit = 20;

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
        <div className={"user-commission-history-page"}>
            {/* Header */}
            <div className="user-commission-history-header">
                <button
                    onClick={handleBackClick}
                    className="user-commission-history-back-button"
                    aria-label="뒤로가기"
                >
                    {"<"}
                </button>
                <span className="user-commission-history-title">
                    수당 내역
                </span>
            </div>

            {/* Content */}
            <div className="user-commission-history-content">
                <div className="user-commission-history-table-container">
                    {loading ? (
                        <div className="user-commission-history-loading">로딩 중...</div>
                    ) : (
                        <>
                            <table className="user-commission-history-history-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>충전인</th>
                                        <th>발생일</th>
                                        <th>충전내역</th>
                                        <th>수당지급</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.length > 0 ? (
                                        historyData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.rowNumber}</td>
                                                <td>{item.userName}</td>
                                                <td>{item.chargeDate}</td>
                                                <td>{item.description}</td>
                                                <td>{formatNumber(item.commissionAmount)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="user-commission-history-no-data">
                                                내역이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="user-commission-history-pagination">
                                    {renderPagination()}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserCommissionHistoryPage; 