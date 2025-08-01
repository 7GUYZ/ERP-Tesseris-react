"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, MapPin } from "lucide-react"
import { getActiveEvents, getEndedEvents } from "../../api/auth/DabinAuth"
import "../../styles/dabin/EventListPage.css"

export default function EventListPage() {
  const [activeTab, setActiveTab] = useState("continue") // "continue" | "end"
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = activeTab === "continue" 
        ? await getActiveEvents()
        : await getEndedEvents()
      
      if (response.data.resultCode === 200) {
        setEvents(response.data.data)
      } else {
        console.error('이벤트 목록 조회 실패:', response.data.resultMessage)
      }
    } catch (error) {
      console.error('이벤트 목록 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (eventMasterIndex) => {
    window.location.href = `/event-detail/${eventMasterIndex}`
  }

  const formatAddress = (address) => {
    if (!address) return ""
    const parts = address.split(" ")
    if (parts.length >= 2) {
      return `[${parts[0]}/${parts[1]}]`
    }
    return address
  }

  if (loading) {
    return (
      <div className="event-list-page">
        <div className="event-list-loading">이벤트 목록을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="event-list-page">
      {/* Header */}
      <div className="event-list-header">
        <button className="event-list-back-btn" onClick={() => window.history.back()}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="event-list-header-title">쿠폰 이벤트</h1>
        <div className="event-list-header-spacer"></div>
      </div>

      {/* Tabs */}
      <div className="event-list-tabs">
        <button 
          className={`event-list-tab${activeTab === "continue" ? " active" : ""}`}
          onClick={() => setActiveTab("continue")}
        >
          진행중
        </button>
        <button 
          className={`event-list-tab${activeTab === "end" ? " active" : ""}`}
          onClick={() => setActiveTab("end")}
        >
          종료
        </button>
      </div>

      {/* Event List */}
      <div className="event-list-event-list">
        {events.map((event) => (
          <div 
            key={event.eventMasterIndex}
            className="event-list-event-card"
            onClick={() => handleEventClick(event.eventMasterIndex)}
          >
            <div className="event-list-event-content">
              <div className="event-list-event-info">
                <h3 className="event-list-event-title">{event.eventMasterName}</h3>
                <p className="event-list-event-remaining">
                  잔여 쿠폰 &emsp; {event.totalCouponPrice.toLocaleString()} CM
                </p>
              </div>
              <div className="event-list-event-location">
                <p className="event-list-location-text">{formatAddress(event.storeAddress)}</p>
                <p className="event-list-store-name">{event.storeName}</p>
              </div>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="event-list-no-events">
            <p>{activeTab === "continue" ? "진행중인 이벤트가 없습니다." : "종료된 이벤트가 없습니다."}</p>
          </div>
        )}
      </div>
    </div>
  )
} 