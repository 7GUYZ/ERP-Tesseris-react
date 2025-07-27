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
    const [userRoleIndex, setUserRoleIndex] = useState(null);
    const [userIndex, setUserIndex] = useState(null);
    
    const navigate = useNavigate();
    const limit = 20;

    useEffect(() => {
        // 세션에서 사용자 정보 가져오기
        const userRole = sessionStorage.getItem('user_role_index');
        const userIdx = sessionStorage.getItem('user_index');
        
        // 테스트용: 임의의 user_index 설정 (실제 테스트할 때만 사용)
        const testUserIndex = 110; // 여기에 테스트할 user_index 입력
        
        setUserRoleIndex(parseInt(userRole));
        setUserIndex(testUserIndex); // 실제: parseInt(userIdx)
        
        // 테스트용: 임의의 user_index로 데이터 조회
        fetchHistoryData(testUserIndex, 1); // 실제: parseInt(userIdx)
    }, []);

    const fetchHistoryData = async (userIdx, page) => {
        setLoading(true);
        try {
            console.log('Fetching data for userIndex:', userIdx, 'page:', page);
            const response = await getUserCommissionHistory(userIdx, page, limit);
            console.log('API Response:', response);
            
            if (response && response.data && response.data.success) {
                setHistoryData(response.data.data);
                setTotalPages(response.data.totalPages);
                setTotalCount(response.data.totalCount);
                setCurrentPage(response.data.currentPage);
            } else {
                console.error('Failed to fetch history data:', response?.data?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching history data:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchHistoryData(userIndex, page);
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
                {userRoleIndex === 1 && (
                    <div className="user-commission-history-info-note">
                        <span className="user-commission-history-star">★</span> 정회원만 지급가능합니다.
                    </div>
                )}
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