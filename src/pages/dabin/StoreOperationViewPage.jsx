import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Edit } from '@mui/icons-material';
import { IconButton, Button, Typography, Box, Card, CardContent, Chip } from '@mui/material';
import { getStoreOperationInfo } from '../../api/auth/DabinAuth';
import '../../styles/dabin/StoreOperationViewPage.css';

const StoreOperationViewPage = () => {
  const navigate = useNavigate();
  const [operationInfo, setOperationInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperationInfo();
  }, []);

  const fetchOperationInfo = async () => {
    try {
      console.log('🔍 [React] API 호출 시작 (JWT 방식)');
      
      const response = await getStoreOperationInfo(); // JWT 방식으로 변경
      
      console.log('✅ [React] API 응답 성공');
      console.log('✅ [React] 응답 데이터:', response.data);
      
      if (response.data.success) {
        console.log('✅ [React] success: true, 데이터 설정');
        setOperationInfo(response.data.data);
      } else {
        console.error('❌ [React] success: false, 메시지:', response.data.message);
      }
    } catch (error) {
      console.error('❌ [React] API 호출 실패');
      console.error('❌ [React] 에러 타입:', error.name);
      console.error('❌ [React] 에러 메시지:', error.message);
      console.error('❌ [React] 응답 상태:', error.response?.status);
      console.error('❌ [React] 응답 데이터:', error.response?.data);
      console.error('❌ [React] 요청 설정:', error.config);
      console.error('❌ [React] 에러:', error);
    } finally {
      console.log('🔍 [React] 로딩 상태 해제');
      setLoading(false);
    }
  };

  const getDayName = (day) => {
    const dayMap = {
      'sunday': '일',
      'monday': '월',
      'tuesday': '화',
      'wednesday': '수',
      'thursday': '목',
      'friday': '금',
      'saturday': '토'
    };
    return dayMap[day] || day;
  };

  const getWeekName = (week) => {
    const weekMap = {
      '월요일': '월요일',
      '화요일': '화요일',
      '수요일': '수요일',
      '목요일': '목요일',
      '금요일': '금요일',
      '토요일': '토요일',
      '일요일': '일요일'
    };
    return weekMap[week] || week;
  };

  if (loading) {
    return <div className="store-operation-view-loading">로딩 중...</div>;
  }

  if (!operationInfo) {
    return <div className="store-operation-view-error">운영정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="store-operation-view-page">
      {/* Header */}
      <div className="store-operation-view-header">
        <button
          onClick={() => navigate(-1)}
          className="store-operation-view-back-button"
          aria-label="뒤로가기"
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}
        >
          {'<'}
        </button>
        <span className="store-operation-view-title" style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '20px' }}>매장 관리</span>
      </div>

      {/* Navigation Tabs */}
      <Box className="store-operation-view-tabs">
        <Typography 
          variant="body1" 
          className="store-operation-view-tab store-operation-view-tab.inactive"
          onClick={() => navigate('/store')}
          sx={{ color: '#170F58', background: '#fff', fontWeight: 700 }}
        >
          기본 정보
        </Typography>
        <Typography 
          variant="body1" 
          className="store-operation-view-tab store-operation-view-tab.active"
          sx={{ color: '#170F58', borderBottom: '2px solid #170F58', background: '#fff', fontWeight: 700 }}
        >
          운영정보
        </Typography>
      </Box>

      {/* Business Information Section */}
      <Card className="store-operation-view-section-card" sx={{ borderLeft: '4px solid #e0e0e0' }}>
        <CardContent>
          <Box className="store-operation-view-section-header">
            <Box className="store-operation-view-section-icon store-operation-view-business-icon" sx={{ background: '#170F58' }} />
            <Typography variant="h6" className="store-operation-view-section-title">
              영업 정보
            </Typography>
          </Box>

          {operationInfo.businessHours && operationInfo.businessHours.length > 0 ? (
            operationInfo.businessHours.map((hours, index) => (
              <Box key={index} className="store-operation-view-business-hours-item">
                <Typography variant="subtitle1" className="store-operation-view-hours-title">
                  영업 시간 {index + 1}
                </Typography>
                
                <Box className="store-operation-view-hours-content">
                  <Box className="store-operation-view-time-row">
                    <Typography variant="body2" className="store-operation-view-time-label">영업시간</Typography>
                    <Typography variant="body1" className="store-operation-view-time-value">
                      {hours.workStartTime} ~ {hours.workEndTime}
                    </Typography>
                  </Box>
                  
                  {hours.restTime === 'Y' && (
                    <Box className="store-operation-view-time-row">
                      <Typography variant="body2" className="store-operation-view-time-label">휴게시간</Typography>
                      <Typography variant="body1" className="store-operation-view-time-value">
                        {hours.restStartTime} ~ {hours.restEndTime}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box className="store-operation-view-business-days">
                    {hours.businessDays
                      .sort((a, b) => {
                        const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
                      })
                      .map((day, dayIndex) => (
                        <Chip
                          key={dayIndex}
                          label={getDayName(day)}
                          className="store-operation-view-day-chip active"
                          size="small"
                          sx={{ background: '#170F58', color: '#fff' }}
                        />
                      ))}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" className="store-operation-view-no-data">
              등록된 영업시간이 없습니다.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Other Settings Section */}
      <Card className="store-operation-view-section-card" sx={{ borderLeft: '4px solid #e0e0e0' }}>
        <CardContent>
          <Box className="store-operation-view-section-header">
            <Box className="store-operation-view-section-icon store-operation-view-settings-icon" sx={{ background: '#170F58' }} />
            <Typography variant="h6" className="store-operation-view-section-title">
              기타 설정
            </Typography>
          </Box>

          <Box className="store-operation-view-setting-item">
            <Typography variant="body1" className="store-operation-view-setting-label">
              공휴일 / 국경일 휴무
            </Typography>
            <Chip
              label={operationInfo.holidayStatus === 'Y' ? '휴무' : '정상영업'}
              className={operationInfo.holidayStatus === 'Y' ? 'store-operation-view-status-chip closed' : 'store-operation-view-status-chip open'}
              size="small"
              sx={{ background: '#ffc107', color: '#fff' }}
            />
          </Box>

          <Box className="store-operation-view-setting-item">
            <Typography variant="body1" className="store-operation-view-setting-label">
              정기 휴무
            </Typography>
            <Typography variant="body1" className="store-operation-view-setting-value">
              {operationInfo.regularClosingInterval && operationInfo.regularClosingWeek 
                ? `${operationInfo.regularClosingInterval} ${getWeekName(operationInfo.regularClosingWeek)}`
                : '설정 없음'
              }
            </Typography>
          </Box>

          <Box className="store-operation-view-setting-item">
            <Typography variant="body1" className="store-operation-view-setting-label">
              임시 휴무
            </Typography>
            <Typography variant="body1" className="store-operation-view-setting-value">
              {operationInfo.temporaryClosingDate 
                ? `${operationInfo.temporaryClosingDate} (${operationInfo.temporaryClosingComment || '임시 휴무'})`
                : '설정 없음'
              }
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Button */}
      <button
        style={{
          width: '100%',
          background: '#170F58',
          color: '#fff',
          padding: '16px',
          border: 'none',
          borderRadius: '10px',
          fontSize: '20px',
          marginTop: '32px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/store/operation/edit')}
      >
        수정
      </button>
    </div>
  );
};

export default StoreOperationViewPage; 