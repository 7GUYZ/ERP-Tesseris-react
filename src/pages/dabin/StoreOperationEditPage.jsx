import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack, 
  Add, 
  Close, 
  KeyboardArrowDown 
} from '@mui/icons-material';
import { 
  IconButton, 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { getStoreOperationInfo, updateStoreOperationInfo } from '../../api/auth/DabinAuth';
import Toast from '../../components/ui/jungeun/Toast';
import '../../styles/dabin/StoreOperationEditPage.css';

const StoreOperationEditPage = () => {
  const navigate = useNavigate();
  const [operationInfo, setOperationInfo] = useState({
    businessHours: [],
    holidayStatus: 'N',
    regularClosingInterval: null,
    regularClosingWeek: null,
    temporaryClosingDate: '',
    temporaryClosingComment: '',
    removeList: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showToast, setShowToast] = useState(false);

  const weekOptions = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const intervalOptions = ['매주', '격주'];
  const defaultIntervalOptions = ['주기', ...intervalOptions];
  const defaultWeekOptions = ['요일', ...weekOptions];

  // 시간 옵션 생성 (1분 단위)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 시간과 분 옵션 생성
  const generateHourOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      options.push(hour.toString().padStart(2, '0'));
    }
    return options;
  };

  const generateMinuteOptions = () => {
    const options = [];
    for (let minute = 0; minute < 60; minute++) {
      options.push(minute.toString().padStart(2, '0'));
    }
    return options;
  };

  const generateEndHourOptions = () => {
    const options = [];
    for (let hour = 0; hour <= 24; hour++) { // 00~24 포함
      options.push(hour.toString().padStart(2, '0'));
    }
    return options;
  };

  const generateEndMinuteOptions = () => {
    const options = [];
    for (let minute = 0; minute < 60; minute++) {
      options.push(minute.toString().padStart(2, '0'));
    }
    return options;
  };

  const hourOptions = generateHourOptions();
  const minuteOptions = generateMinuteOptions();
  const endHourOptions = generateEndHourOptions();
  const endMinuteOptions = generateEndMinuteOptions();

  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
  };



  useEffect(() => {
    fetchOperationInfo();
  }, []);

  const fetchOperationInfo = async () => {
    try {
      console.log('🔍 [React] EditPage API 호출 시작 (JWT 방식)');
      
      const response = await getStoreOperationInfo(); // JWT 방식으로 변경
      
      console.log('✅ [React] EditPage API 응답 성공');
      console.log('✅ [React] EditPage 응답 데이터:', response.data);
      
      if (response.data.success) {
        console.log('✅ [React] EditPage success: true, 데이터 설정');
        const data = response.data.data;
        
        // 기존 데이터에서 00:00을 00:01로 변환
        if (data.businessHours) {
          data.businessHours = data.businessHours.map(hours => ({
            ...hours,
            workEndTime: hours.workEndTime === '00:00' ? '00:01' : hours.workEndTime,
            restEndTime: hours.restEndTime === '00:00' ? '00:01' : hours.restEndTime
          }));
        }
        
        // removeList 필드가 없으면 빈 배열로 초기화
        setOperationInfo({
          ...data,
          removeList: data.removeList || []
        });
      } else {
        console.error('❌ [React] EditPage success: false, 메시지:', response.data.message);
      }
    } catch (error) {
      console.error('❌ [React] EditPage API 호출 실패');
      console.error('❌ [React] EditPage 에러 타입:', error.name);
      console.error('❌ [React] EditPage 에러 메시지:', error.message);
      console.error('❌ [React] EditPage 응답 상태:', error.response?.status);
      console.error('❌ [React] EditPage 응답 데이터:', error.response?.data);
    } finally {
      console.log('🔍 [React] EditPage 로딩 상태 해제');
      setLoading(false);
    }
  };

  const addBusinessHours = () => {
    if (operationInfo.businessHours.length >= 7) {
      showToastMessage('영업 시간은 최대 7개까지 설정 가능합니다.', 'error');
      return;
    }

    const newBusinessHours = {
      storeBusinessHoursIndex: null,
      workStartTime: '00:00',
      workEndTime: '00:01',
      restTime: 'N',
      restStartTime: '00:00',
      restEndTime: '00:01',
      businessDays: []
    };

    setOperationInfo(prev => ({
      ...prev,
      businessHours: [...prev.businessHours, newBusinessHours]
    }));
  };

  const removeBusinessHours = (index) => {
    setOperationInfo(prev => {
      const hoursToRemove = prev.businessHours[index];
      const newRemoveList = [...(prev.removeList || [])];
      
      // 기존 영업시간인 경우 (storeBusinessHoursIndex가 있음) removeList에 추가
      if (hoursToRemove.storeBusinessHoursIndex) {
        newRemoveList.push(hoursToRemove.storeBusinessHoursIndex);
      }
      
      return {
        ...prev,
        businessHours: prev.businessHours.filter((_, i) => i !== index),
        removeList: newRemoveList
      };
    });
  };

  // 시간 유효성 검증 함수
  const validateRestTime = (workStartTime, workEndTime, restStartTime, restEndTime) => {
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    let workStart = convertToMinutes(workStartTime);
    let workEnd = convertToMinutes(workEndTime);
    let restStart = convertToMinutes(restStartTime);
    let restEnd = convertToMinutes(restEndTime);
    
    // 자정을 넘어가는 경우 처리
    if (workEnd === 0) workEnd = 24 * 60; // 00:00을 24:00으로 변환
    if (restEnd === 0) restEnd = 24 * 60; // 00:00을 24:00으로 변환
    
    // 영업시간이 자정을 넘어가는 경우 (예: 16:00~04:01)
    if (workStart > workEnd) {
      workEnd += 24 * 60; // 종료시간에 24시간 추가
    }
    
    // 휴게시간이 자정을 넘어가는 경우
    if (restStart > restEnd) {
      restEnd += 24 * 60; // 종료시간에 24시간 추가
    }
    
    console.log('검증:', {
      workStart: workStartTime, workEnd: workEndTime,
      restStart: restStartTime, restEnd: restEndTime,
      workStartMin: workStart, workEndMin: workEnd,
      restStartMin: restStart, restEndMin: restEnd,
      isValid: restStart >= workStart && restEnd <= workEnd && restStart < restEnd
    });
    
    return restStart >= workStart && restEnd <= workEnd && restStart < restEnd;
  };

    const updateBusinessHours = (index, field, value) => {
    setOperationInfo(prev => ({
      ...prev,
      businessHours: prev.businessHours.map((hours, i) => {
        if (i === index) {
          // 종료시간이 23:59를 넘지 않도록 체크
          if (field === 'workEndTime') {
            const [hour, minute] = value.split(':');
            if (hour === '23' && parseInt(minute) > 59) {
              showToastMessage('종료시간은 23:59를 넘을 수 없습니다.', 'error');
              return hours; // 기존 값 유지
            }
          }

          // 00:00으로 설정된 경우 00:01로 자동 변환
          let newValue = value;
          if ((field === 'workEndTime' || field === 'restEndTime') && value === '00:00') {
            newValue = '00:01';
          }
          // 기존 데이터에서 00:00인 경우도 00:01로 변환
          const updatedHours = { ...hours, [field]: newValue };
          if (field === 'workEndTime' && updatedHours.workEndTime === '00:00') {
            updatedHours.workEndTime = '00:01';
          }
          if (field === 'restEndTime' && updatedHours.restEndTime === '00:00') {
            updatedHours.restEndTime = '00:01';
          }
          return updatedHours;
        }
        return hours;
      })
    }));
  };

  const toggleBusinessDay = (hoursIndex, day) => {
    setOperationInfo(prev => ({
      ...prev,
      businessHours: prev.businessHours.map((hours, i) => {
        if (i === hoursIndex) {
          const days = (hours.businessDays || []).filter(d => d !== ''); // 빈 문자열 제거
          const newDays = days.includes(day)
            ? days.filter(d => d !== day)
            : [...days, day];
          return { ...hours, businessDays: newDays };
        }
        return hours;
      })
    }));
  };



  const handleSave = async () => {
    // 영업시간 시작시간과 종료시간이 같은지 체크
    const sameStartEndTimes = operationInfo.businessHours.filter(hours => {
      return hours.workStartTime && hours.workEndTime && hours.workStartTime === hours.workEndTime;
    });
    
    if (sameStartEndTimes.length > 0) {
      showToastMessage('영업시간의 시작과 종료시간이 같을 수 없습니다.', 'error');
      return;
    }

    // 휴게시간 시작시간과 종료시간이 같은지 체크
    const sameRestStartEndTimes = operationInfo.businessHours.filter(hours => {
      return hours.restTime === 'Y' && hours.restStartTime && hours.restEndTime && hours.restStartTime === hours.restEndTime;
    });
    
    if (sameRestStartEndTimes.length > 0) {
      showToastMessage('휴게시간의 시작과 종료시간이 같을 수 없습니다.', 'error');
      return;
    }

    // 영업요일 설정 확인
    const emptyBusinessDays = operationInfo.businessHours.filter(hours => {
      return !hours.businessDays || 
             hours.businessDays.length === 0 || 
             (hours.businessDays.length === 1 && hours.businessDays[0] === '');
    });
    
    if (emptyBusinessDays.length > 0) {
      showToastMessage('각 영업시간별로 영업요일을 설정해주세요.', 'error');
      return;
    }

    // 영업요일 중복 확인
    const allBusinessDays = operationInfo.businessHours.flatMap(hours => hours.businessDays || []);
    const duplicateDays = allBusinessDays.filter((day, index) => allBusinessDays.indexOf(day) !== index);
    
    if (duplicateDays.length > 0) {
      showToastMessage('요일이 겹치지 않도록 설정해주세요.', 'error');
      return;
    }

    // 휴식시간 유효성 검증
    const invalidRestTimes = operationInfo.businessHours.filter(hours => {
      if (hours.restTime === 'Y') {
        return !validateRestTime(
          hours.workStartTime, 
          hours.workEndTime, 
          hours.restStartTime, 
          hours.restEndTime
        );
      }
      return false;
    });
    
    if (invalidRestTimes.length > 0) {
      showToastMessage('휴게시간은 영업시간 내에 설정해주세요.', 'error');
      return;
    }
    
    setSaving(true);
    try {
      console.log('🔍 [React] EditPage 저장 시작 (JWT 방식)');
      console.log('🔍 [React] EditPage 저장 데이터:', operationInfo);
      console.log('🔍 [React] EditPage removeList:', operationInfo.removeList);
      
      const response = await updateStoreOperationInfo(operationInfo); // JWT 방식으로 변경
      
      console.log('✅ [React] EditPage 저장 성공');
      console.log('✅ [React] EditPage 저장 응답:', response.data);
      
      if (response.data.success) {
        showToastMessage('운영정보가 성공적으로 저장되었습니다.', 'success');
        setTimeout(() => {
          navigate('/store/operation');
        }, 1500);
      } else {
        showToastMessage('저장 실패: ' + response.data.message, 'error');
      }
    } catch (error) {
      console.error('❌ [React] EditPage 저장 실패');
      console.error('❌ [React] EditPage 저장 에러:', error);
      showToastMessage('저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setSaving(false);
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

  if (loading) {
    return <div className="store-operation-edit-loading">로딩 중...</div>;
  }

  return (
    <div className="store-operation-edit-page">
      {/* Header */}
      <div className="store-operation-edit-header" style={{ borderBottom: '1px solid #e0e0e0', background: '#fff', marginBottom: 0 }}>
        <button
          onClick={() => navigate(-1)}
          className="store-operation-edit-back-button"
          aria-label="뒤로가기"
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}
        >
          {'<'}
        </button>
        <span className="store-operation-edit-title" style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '20px' }}>매장 관리</span>
      </div>

      {/* Navigation Tabs */}
      <Box className="store-operation-edit-tabs">
        <Typography 
          variant="body1" 
          className="store-operation-edit-tab store-operation-edit-inactive"
          onClick={() => navigate('/store')}
          sx={{ color: '#170F58', background: '#fff', fontWeight: 700 }}
        >
          기본 정보
        </Typography>
        <Typography 
          variant="body1" 
          className="store-operation-edit-tab store-operation-edit-active"
          sx={{ color: '#170F58', borderBottom: '2px solid #170F58', background: '#fff', fontWeight: 700 }}
        >
          운영정보
        </Typography>
      </Box>

      {/* Business Information Section */}
      <Card className="store-operation-edit-section-card">
        <CardContent>
          <Box className="store-operation-edit-section-header">
            <Box className="store-operation-edit-section-icon store-operation-edit-business-icon" sx={{ background: '#170F58' }} />
            <Typography variant="h6" className="store-operation-edit-section-title">
              영업 정보
            </Typography>
          </Box>

          {operationInfo.businessHours.map((hours, index) => (
            <Box key={index} className="store-operation-edit-business-hours-edit-item" style={{ border: '1px solid #170F58', borderRadius: '10px', marginBottom: '24px', padding: '16px' }}>
              <Box className="store-operation-edit-hours-header">
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#170F58',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </Box>
                <IconButton 
                  onClick={() => removeBusinessHours(index)}
                  className="store-operation-edit-remove-button"
                >
                  <Close />
                </IconButton>
              </Box>

              {/* Business Hours */}
              <Box className="store-operation-edit-time-input-group">
                <Typography variant="body2" className="store-operation-edit-time-label">영업 시간</Typography>
                <Box className="store-operation-edit-time-inputs">
                  <Box className="store-operation-edit-time-select-group">
                    <FormControl size="small" className="store-operation-edit-time-select">
                      <Select
                        value={hours.workStartTime ? hours.workStartTime.split(':')[0] : '00'}
                        onChange={(e) => {
                          const currentMinute = hours.workStartTime ? hours.workStartTime.split(':')[1] : '00';
                          updateBusinessHours(index, 'workStartTime', `${e.target.value}:${currentMinute}`);
                        }}
                        displayEmpty
                      >
                        {hourOptions.map((hour) => (
                          <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="body1" className="store-operation-edit-time-colon">:</Typography>
                    <FormControl size="small" className="store-operation-edit-time-select">
                      <Select
                        value={hours.workStartTime ? hours.workStartTime.split(':')[1] : '00'}
                        onChange={(e) => {
                          const currentHour = hours.workStartTime ? hours.workStartTime.split(':')[0] : '00';
                          updateBusinessHours(index, 'workStartTime', `${currentHour}:${e.target.value}`);
                        }}
                        displayEmpty
                      >
                        {minuteOptions.map((minute) => (
                          <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography variant="body1" className="store-operation-edit-time-separator">~</Typography>
                  <Box className="store-operation-edit-time-select-group">
                                            <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={hours.workEndTime ? hours.workEndTime.split(':')[0] : '00'}
                            onChange={(e) => {
                              const currentMinute = hours.workEndTime ? hours.workEndTime.split(':')[1] : '00';
                              const newHour = e.target.value;
                              let newMinute = currentMinute;
                              // 00시로 변경할 때는 00분이 아닌 다른 분으로 설정
                              if (newHour === '00' && currentMinute === '00') {
                                newMinute = '01';
                              }
                              // 24시로 변경할 때는 00분으로 설정
                              if (newHour === '24') {
                                newMinute = '00';
                              }
                              updateBusinessHours(index, 'workEndTime', `${newHour}:${newMinute}`);
                            }}
                            displayEmpty
                          >
                            {endHourOptions.map((hour) => (
                              <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                    <Typography variant="body1" className="store-operation-edit-time-colon">:</Typography>
                                            <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={(() => {
                              const currentHour = hours.workEndTime ? hours.workEndTime.split(':')[0] : '00';
                              const currentMinute = hours.workEndTime ? hours.workEndTime.split(':')[1] : '01';
                              // 00시이고 00분이면 01분으로 변경
                              if (currentHour === '00' && currentMinute === '00') {
                                return '01';
                              }
                              return currentMinute;
                            })()}
                            onChange={(e) => {
                              const currentHour = hours.workEndTime ? hours.workEndTime.split(':')[0] : '00';
                              updateBusinessHours(index, 'workEndTime', `${currentHour}:${e.target.value}`);
                            }}
                            displayEmpty
                          >
                            {endMinuteOptions
                              .filter(minute => {
                                const currentHour = hours.workEndTime ? hours.workEndTime.split(':')[0] : '00';
                                // 00시일 때는 00분 제외
                                if (currentHour === '00') {
                                  return minute !== '00';
                                }
                                // 24시일 때는 00분만 허용
                                if (currentHour === '24') {
                                  return minute === '00';
                                }
                                return true;
                              })
                              .map((minute) => (
                                <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                  </Box>
                </Box>
              </Box>
              


              {/* Rest Time */}
              <Box className="store-operation-edit-rest-time-section">
                <Box className="store-operation-edit-rest-time-header">
                  <Typography variant="body2" className="store-operation-edit-time-label">휴게 시간</Typography>
                  <Switch
                    checked={hours.restTime === 'Y'}
                    onChange={(e) => updateBusinessHours(index, 'restTime', e.target.checked ? 'Y' : 'N')}
                    className="store-operation-edit-rest-switch"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#170F58',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#170F58',
                      },
                    }}
                  />
                </Box>
                
                {hours.restTime === 'Y' && (
                  <Box className="store-operation-edit-time-input-group">
                    <Box className="store-operation-edit-time-inputs">
                      <Box className="store-operation-edit-time-select-group">
                        <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={hours.restStartTime ? hours.restStartTime.split(':')[0] : '00'}
                            onChange={(e) => {
                              const currentMinute = hours.restStartTime ? hours.restStartTime.split(':')[1] : '00';
                              updateBusinessHours(index, 'restStartTime', `${e.target.value}:${currentMinute}`);
                            }}
                            displayEmpty
                          >
                            {hourOptions.map((hour) => (
                              <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Typography variant="body1" className="store-operation-edit-time-colon">:</Typography>
                        <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={hours.restStartTime ? hours.restStartTime.split(':')[1] : '00'}
                            onChange={(e) => {
                              const currentHour = hours.restStartTime ? hours.restStartTime.split(':')[0] : '00';
                              updateBusinessHours(index, 'restStartTime', `${currentHour}:${e.target.value}`);
                            }}
                            displayEmpty
                          >
                            {minuteOptions.map((minute) => (
                              <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      <Typography variant="body1" className="store-operation-edit-time-separator">~</Typography>
                      <Box className="store-operation-edit-time-select-group">
                        <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={hours.restEndTime ? hours.restEndTime.split(':')[0] : '00'}
                            onChange={(e) => {
                              const currentMinute = hours.restEndTime ? hours.restEndTime.split(':')[1] : '01';
                              const newHour = e.target.value;
                              // 00시로 변경할 때는 00분이 아닌 다른 분으로 설정
                              let newMinute = currentMinute;
                              if (newHour === '00' && currentMinute === '00') {
                                newMinute = '01';
                              }
                              updateBusinessHours(index, 'restEndTime', `${newHour}:${newMinute}`);
                            }}
                            displayEmpty
                          >
                            {endHourOptions.map((hour) => (
                              <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Typography variant="body1" className="store-operation-edit-time-colon">:</Typography>
                        <FormControl size="small" className="store-operation-edit-time-select">
                          <Select
                            value={(() => {
                              const currentHour = hours.restEndTime ? hours.restEndTime.split(':')[0] : '00';
                              const currentMinute = hours.restEndTime ? hours.restEndTime.split(':')[1] : '01';
                              // 00시이고 00분이면 01분으로 변경
                              if (currentHour === '00' && currentMinute === '00') {
                                return '01';
                              }
                              return currentMinute;
                            })()}
                            onChange={(e) => {
                              const currentHour = hours.restEndTime ? hours.restEndTime.split(':')[0] : '00';
                              updateBusinessHours(index, 'restEndTime', `${currentHour}:${e.target.value}`);
                            }}
                            displayEmpty
                          >
                            {endMinuteOptions
                              .filter(minute => {
                                const currentHour = hours.restEndTime ? hours.restEndTime.split(':')[0] : '00';
                                // 00시일 때는 00분 제외
                                if (currentHour === '00') {
                                  return minute !== '00';
                                }
                                // 24시일 때는 00분만 허용
                                if (currentHour === '24') {
                                  return minute === '00';
                                }
                                return true;
                              })
                              .map((minute) => (
                                <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                <Typography variant="caption" className="store-operation-edit-rest-time-note" style={{ color: '#ffc107' }}>
                  * 휴게시간은 운영시간 안으로만 설정가능합니다.
                </Typography>
              </Box>

              {/* Business Days */}
              <Box className="store-operation-edit-business-days-section">
                <Typography variant="body2" className="store-operation-edit-time-label">영업 요일</Typography>
                <Box className="store-operation-edit-day-buttons">
                  {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                    <Button
                      key={day}
                      variant={hours.businessDays?.filter(d => d !== '').includes(day) ? "contained" : "outlined"}
                      className={`store-operation-edit-day-button${hours.businessDays?.filter(d => d !== '').includes(day) ? ' selected' : ''}`}
                      onClick={() => toggleBusinessDay(index, day)}
                      size="small"
                      sx={hours.businessDays?.filter(d => d !== '').includes(day) ? { background: '#170F58', color: '#fff', borderColor: '#170F58' } : { borderColor: '#170F58', color: '#170F58', background: '#fff' }}
                    >
                      {getDayName(day)}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}

          {/* Add Business Hours Button */}
          <Button
            variant="outlined"
            startIcon={<Add sx={{ color: '#ffffff' }} />}
            onClick={addBusinessHours}
            className="store-operation-edit-add-hours-button"
            fullWidth
            sx={{ 
              borderColor: '#FDCD00 !important', 
              color: '#ffffff !important',
              backgroundColor: '#FDCD00 !important',
              '&:hover': {
                backgroundColor: '#FDCD00 !important',
                borderColor: '#FDCD00 !important',
                color: '#ffffff !important'
              }
            }}
          >
            영업시간 추가
          </Button>
        </CardContent>
      </Card>

      {/* Other Settings Section */}
      <Card className="store-operation-edit-section-card">
        <CardContent>
          <Box className="store-operation-edit-section-header">
            <Box className="store-operation-edit-section-icon store-operation-edit-settings-icon" sx={{ background: '#170F58' }} />
            <Typography variant="h6" className="store-operation-edit-section-title">
              기타 설정
            </Typography>
          </Box>

          {/* Holiday Status */}
          <Box className="store-operation-edit-setting-item">
            <Typography variant="body1" className="store-operation-edit-setting-label">
              공휴일 / 국경일 휴무
            </Typography>
            <Switch
              checked={operationInfo.holidayStatus === 'Y'}
              onChange={(e) => setOperationInfo(prev => ({
                ...prev,
                holidayStatus: e.target.checked ? 'Y' : 'N'
              }))}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#170F58',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#170F58',
                },
              }}
            />
          </Box>

          {/* Regular Closing */}
          <Box className="store-operation-edit-setting-item">
            <Typography variant="body1" className="store-operation-edit-setting-label">
              정기 휴무
            </Typography>
            <Box className="store-operation-edit-regular-closing-inputs">
              <FormControl size="small" className="store-operation-edit-select-field">
                <Select
                  value={operationInfo.regularClosingInterval || '주기'}
                  onChange={(e) => setOperationInfo(prev => ({
                    ...prev,
                    regularClosingInterval: e.target.value === '주기' ? null : e.target.value
                  }))}
                  displayEmpty
                >
                  {defaultIntervalOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" className="store-operation-edit-select-field">
                <Select
                  value={operationInfo.regularClosingWeek || '요일'}
                  onChange={(e) => setOperationInfo(prev => ({
                    ...prev,
                    regularClosingWeek: e.target.value === '요일' ? null : e.target.value
                  }))}
                  displayEmpty
                >
                  {defaultWeekOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Temporary Closing */}
          <Box className="store-operation-edit-setting-item">
            <Typography variant="body1" className="store-operation-edit-setting-label">
              임시 휴무
            </Typography>
            <Box sx={{ display: 'flex', gap: '12px', flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                type="date"
                value={operationInfo.temporaryClosingDate}
                onChange={(e) => setOperationInfo(prev => ({
                  ...prev,
                  temporaryClosingDate: e.target.value
                }))}
                size="small"
                sx={{ flex: { xs: 1, sm: '0 0 40%' } }}
                className="store-operation-edit-date-input"
              />
              <TextField
                placeholder="코멘트를 입력하세요"
                value={operationInfo.temporaryClosingComment}
                onChange={(e) => setOperationInfo(prev => ({
                  ...prev,
                  temporaryClosingComment: e.target.value
                }))}
                size="small"
                sx={{ flex: { xs: 1, sm: '0 0 60%' } }}
                className="store-operation-edit-comment-input"
                inputProps={{ maxLength: 25 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          style={{
            flex: 1,
            background: '#ffffff',
            color: '#333333',
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '20px',
            cursor: 'pointer'
          }}
          onClick={() => navigate(-1)}
        >
          취소
        </button>
        <button
          style={{
            flex: 1,
            background: '#170F58',
            color: '#fff',
            padding: '16px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '20px',
            cursor: 'pointer'
          }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
      
      {/* Toast Component */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={closeToast}
        />
      )}


    </div>
  );
};

export default StoreOperationEditPage; 