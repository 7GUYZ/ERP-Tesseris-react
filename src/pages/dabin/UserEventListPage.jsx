import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getUserActiveEvents, getUserEndedEvents } from '../../api/auth/DabinAuth';
import '../../styles/dabin/UserEventListPage.css';

const UserEventListPage = () => {
    const [activeTab, setActiveTab] = useState('continue');
    const [activeEvents, setActiveEvents] = useState([]);
    const [endedEvents, setEndedEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [activeTab]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            if (activeTab === 'continue') {
                const response = await getUserActiveEvents();
                if (response.data.resultCode === 200) {
                    setActiveEvents(response.data.data);
                } else {
                    console.error('이벤트 목록 조회 실패:', response.data.resultMessage);
                }
            } else {
                const response = await getUserEndedEvents();
                if (response.data.resultCode === 200) {
                    setEndedEvents(response.data.data);
                } else {
                    console.error('이벤트 목록 조회 실패:', response.data.resultMessage);
                }
            }
        } catch (error) {
            console.error('이벤트 목록 조회 오류:', error);
            alert('이벤트 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (eventMasterIndex) => {
        navigate(`/user-event-detail/${eventMasterIndex}`);
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    const formatNumber = (num) => {
        return num ? num.toLocaleString() : '0';
    };

    const formatAddress = (address) => {
        if (!address) return "";
        const parts = address.split(" ");
        if (parts.length >= 2) {
            return `[${parts[0]}/${parts[1]}]`;
        }
        return address;
    };

    return (
        <div className="user-event-list-page">
            {/* Header */}
            <div className="user-event-list-header-h">
                <header className="user-event-list-header-wrap">
                    <button className="event-list-back-btn" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <p className="user-event-list-header-title">쿠폰 이벤트</p>
                </header>
            </div>

            {/* Tab Menu */}
            <div className="user-event-list-tab-menu" style={{ margin: '0px' }}>
                <a 
                    className={`user-event-list-tab-item${activeTab === 'continue' ? ' user-event-list-tab-item-active' : ''}`} 
                    style={{ width: '50%' }}
                    onClick={() => setActiveTab('continue')}
                >
                    <p style={{ width: '100%', textAlign: 'center', fontSize: '1.25rem' }}>
                        진행중
                    </p>
                </a>
                <a 
                    className={`user-event-list-tab-item${activeTab === 'end' ? ' user-event-list-tab-item-active' : ''}`} 
                    style={{ width: '50%', textAlign: 'center' }}
                    onClick={() => setActiveTab('end')}
                >
                    <p style={{ width: '100%', textAlign: 'center', fontSize: '1.25rem' }}>
                        종료
                    </p>
                </a>
            </div>

            {/* Loading */}
            {loading && (
                <div className="user-event-list-loading">
                    <div className="user-event-list-loading-circle"></div>
                    <div className="user-event-list-loading-text">로딩 중</div>
                </div>
            )}

            {/* Active Events */}
            {activeTab === 'continue' && !loading && (
                <div>
                    {activeEvents.map((event) => (
                        <div 
                            key={event.eventMasterIndex}
                            className="user-event-list-event-card" 
                            style={{ width: '100%', cursor: 'pointer' }}
                            onClick={() => handleEventClick(event.eventMasterIndex)}
                        >
                            <div className="user-event-list-event-card-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <div style={{ width: '230px' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '17px', color: 'purple' }}>
                                        {event.eventMasterName}
                                    </p>
                                    <p>{event.eventMasterCondition}</p>
                                    <p>잔여 쿠폰 &emsp; {formatNumber(event.totalCouponPrice)} CM</p>
                                </div>
                                <div style={{ textAlign: 'center', width: '150px' }}>
                                    <p>{formatAddress(event.storeAddress)}</p>
                                    <p style={{ fontWeight: 'bold' }}>{event.storeName}</p>
                                    <p>다운로드 가능: {event.eventMasterCount || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ended Events */}
            {activeTab === 'end' && !loading && (
                <div>
                    {endedEvents.map((event) => (
                        <div 
                            key={event.eventMasterIndex}
                            className="user-event-list-event-card" 
                            style={{ width: '100%' }}
                        >
                            <div className="user-event-list-event-card-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <div style={{ width: '230px' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '17px', color: 'purple' }}>
                                        {event.eventMasterName}
                                    </p>
                                    <p>{event.eventMasterCondition}</p>
                                    <p>잔여 쿠폰 &emsp; {formatNumber(event.totalCouponPrice)} CM</p>
                                </div>
                                <div style={{ textAlign: 'center', width: '150px' }}>
                                    <p>{formatAddress(event.storeAddress)}</p>
                                    <p style={{ fontWeight: 'bold' }}>{event.storeName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Events */}
            {!loading && 
             ((activeTab === 'continue' && activeEvents.length === 0) || 
              (activeTab === 'end' && endedEvents.length === 0)) && (
                <div className="user-event-list-no-events">
                    <p>표시할 이벤트가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default UserEventListPage; 