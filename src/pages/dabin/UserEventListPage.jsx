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
        window.location.href = `/user-event-detail/${eventMasterIndex}`;
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

    if (loading) {
        return (
            <div className="user-event-list-page">
                <div className="user-event-list-loading">이벤트 목록을 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="user-event-list-page">
            {/* Header */}
            <div className="user-event-list-header">
                <button className="user-event-list-back-btn" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="user-event-list-header-title">쿠폰 이벤트</h1>
                <div className="user-event-list-header-spacer"></div>
            </div>

            {/* Tabs */}
            <div className="user-event-list-tabs">
                <button 
                    className={`user-event-list-tab${activeTab === 'continue' ? ' active' : ''}`}
                    onClick={() => setActiveTab('continue')}
                >
                    진행중
                </button>
                <button 
                    className={`user-event-list-tab${activeTab === 'end' ? ' active' : ''}`}
                    onClick={() => setActiveTab('end')}
                >
                    종료
                </button>
            </div>

            {/* Event List */}
            <div className="user-event-list-event-list">
                {(activeTab === 'continue' ? activeEvents : endedEvents).map((event) => (
                    <div 
                        key={event.eventMasterIndex}
                        className="user-event-list-event-card"
                        onClick={() => handleEventClick(event.eventMasterIndex)}
                    >
                        <div className="user-event-list-event-content">
                            <div className="user-event-list-event-info">
                                <h3 className="user-event-list-event-title">{event.eventMasterName}</h3>
                                <p className="user-event-list-event-condition">{event.eventMasterCondition}</p>
                                <p className="user-event-list-event-remaining">
                                    잔여 쿠폰 &emsp; {formatNumber(event.totalCouponPrice)} CM
                                </p>
                                <p className="user-event-list-event-downloads">
                                    {activeTab === 'continue' ? '참여 가능 횟수' : '다운로드 가능'}: {event.remainingDownloads || 0}
                                </p>
                            </div>
                            <div className="user-event-list-event-location">
                                <p className="user-event-list-location-text">{formatAddress(event.storeAddress)}</p>
                                <p className="user-event-list-store-name">{event.storeName}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {(activeTab === 'continue' ? activeEvents : endedEvents).length === 0 && (
                    <div className="user-event-list-no-events">
                        <p>{activeTab === 'continue' ? '진행중인 이벤트가 없습니다.' : '종료된 이벤트가 없습니다.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserEventListPage; 