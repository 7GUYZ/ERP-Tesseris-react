import React, { useState, useEffect } from 'react';
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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { getStoreOperationInfo, updateStoreOperationInfo } from '../../api/auth/DabinAuth';
import '../../styles/dabin/StoreOperationEditPage.css';

const StoreOperationEditPage = () => {
  const navigate = useNavigate();
  const [operationInfo, setOperationInfo] = useState({
    businessHours: [],
    holidayStatus: 'N',
    regularClosingInterval: '매주',
    regularClosingWeek: '일요일',
    temporaryClosingDate: '',
    temporaryClosingComment: '',
    removeList: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeField, setCurrentTimeField] = useState(null);
  const [currentTimeValue, setCurrentTimeValue] = useState('00:00');

  const weekOptions = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const intervalOptions = ['매주', '격주'];

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
      alert('영업 시간은 최대 7개까지 설정 가능합니다.');
      return;
    }

    const newBusinessHours = {
      storeBusinessHoursIndex: null,
      workStartTime: '00:00',
      workEndTime: '00:00',
      restTime: 'N',
      restStartTime: '00:00',
      restEndTime: '00:00',
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
    
    // 자정(00:00)을 넘어가는 경우 처리
    if (workEnd === 0) workEnd = 24 * 60; // 00:00을 24:00으로 변환
    if (restEnd === 0) restEnd = 24 * 60; // 00:00을 24:00으로 변환
    
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
      businessHours: prev.businessHours.map((hours, i) => 
        i === index ? { ...hours, [field]: value } : hours
      )
    }));
  };

  const toggleBusinessDay = (hoursIndex, day) => {
    setOperationInfo(prev => ({
      ...prev,
      businessHours: prev.businessHours.map((hours, i) => {
        if (i === hoursIndex) {
          const days = hours.businessDays || [];
          const newDays = days.includes(day)
            ? days.filter(d => d !== day)
            : [...days, day];
          return { ...hours, businessDays: newDays };
        }
        return hours;
      })
    }));
  };

  const openTimePicker = (field, value) => {
    setCurrentTimeField(field);
    setCurrentTimeValue(value);
    setShowTimePicker(true);
  };

  const handleTimeChange = (time) => {
    if (time && currentTimeField) {
      const timeString = format(time, 'HH:mm');
      setCurrentTimeValue(timeString);
    }
  };

  const confirmTimeChange = () => {
    if (currentTimeField) {
      // 현재 편집 중인 영업시간 찾기
      const hoursIndex = parseInt(currentTimeField.split('_')[0]);
      const field = currentTimeField.split('_')[1];
      
      // 휴식시간 변경인 경우 유효성 검증
      if (field === 'restStartTime' || field === 'restEndTime') {
        const hours = operationInfo.businessHours[hoursIndex];
        const newRestStart = field === 'restStartTime' ? currentTimeValue : hours.restStartTime;
        const newRestEnd = field === 'restEndTime' ? currentTimeValue : hours.restEndTime;
        
        if (!validateRestTime(hours.workStartTime, hours.workEndTime, newRestStart, newRestEnd)) {
          alert('휴식시간은 운영시간 안으로만 설정 가능합니다.');
          setShowTimePicker(false);
          return;
        }
      }
      
      updateBusinessHours(hoursIndex, field, currentTimeValue);
    }
    setShowTimePicker(false);
  };

  const handleSave = async () => {
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
      alert('휴식시간이 운영시간을 벗어나는 설정이 있습니다. 확인해주세요.');
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
        alert('운영정보가 성공적으로 저장되었습니다.');
        navigate('/store/operation');
      } else {
        alert('저장 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('❌ [React] EditPage 저장 실패');
      console.error('❌ [React] EditPage 저장 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="store-operation-edit-page">
        {/* Header */}
        <div className="store-operation-edit-header">
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
            className="store-operation-edit-tab store-operation-edit-tab.inactive"
            onClick={() => navigate('/store')}
            sx={{ color: '#170F58', background: '#fff', fontWeight: 700 }}
          >
            기본 정보
          </Typography>
          <Typography variant="body1" className="store-operation-edit-tab store-operation-edit-tab.active" sx={{ color: '#170F58', borderBottom: '2px solid #170F58', background: '#fff', fontWeight: 700 }}>
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
                  <Typography variant="subtitle1" className="store-operation-edit-hours-title">
                    영업 시간 {index + 1}
                  </Typography>
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
                    <Box 
                      className="store-operation-edit-time-input"
                      onClick={() => openTimePicker(`${index}_workStartTime`, hours.workStartTime)}
                    >
                      <Typography variant="body1">{hours.workStartTime}</Typography>
                      <KeyboardArrowDown />
                    </Box>
                    <Typography variant="body1" className="store-operation-edit-time-separator">~</Typography>
                    <Box 
                      className="store-operation-edit-time-input"
                      onClick={() => openTimePicker(`${index}_workEndTime`, hours.workEndTime)}
                    >
                      <Typography variant="body1">{hours.workEndTime}</Typography>
                      <KeyboardArrowDown />
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
                        <Box 
                          className="store-operation-edit-time-input"
                          onClick={() => openTimePicker(`${index}_restStartTime`, hours.restStartTime)}
                        >
                          <Typography variant="body1">{hours.restStartTime}</Typography>
                          <KeyboardArrowDown />
                        </Box>
                        <Typography variant="body1" className="store-operation-edit-time-separator">~</Typography>
                        <Box 
                          className="store-operation-edit-time-input"
                          onClick={() => openTimePicker(`${index}_restEndTime`, hours.restEndTime)}
                        >
                          <Typography variant="body1">{hours.restEndTime}</Typography>
                          <KeyboardArrowDown />
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
                        variant={hours.businessDays?.includes(day) ? "contained" : "outlined"}
                        className={`store-operation-edit-day-button${hours.businessDays?.includes(day) ? ' selected' : ''}`}
                        onClick={() => toggleBusinessDay(index, day)}
                        size="small"
                        sx={hours.businessDays?.includes(day) ? { background: '#170F58', color: '#fff', borderColor: '#170F58' } : { borderColor: '#170F58', color: '#170F58', background: '#fff' }}
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
              startIcon={<Add sx={{ color: '#ffc107' }} />}
              onClick={addBusinessHours}
              className="store-operation-edit-add-hours-button"
              fullWidth
              sx={{ borderColor: '#ffc107', color: '#ffc107' }}
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
                    value={operationInfo.regularClosingInterval}
                    onChange={(e) => setOperationInfo(prev => ({
                      ...prev,
                      regularClosingInterval: e.target.value
                    }))}
                  >
                    {intervalOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" className="store-operation-edit-select-field">
                  <Select
                    value={operationInfo.regularClosingWeek}
                    onChange={(e) => setOperationInfo(prev => ({
                      ...prev,
                      regularClosingWeek: e.target.value
                    }))}
                  >
                    {weekOptions.map(option => (
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
              <TextField
                type="date"
                value={operationInfo.temporaryClosingDate}
                onChange={(e) => setOperationInfo(prev => ({
                  ...prev,
                  temporaryClosingDate: e.target.value
                }))}
                size="small"
                fullWidth
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
                fullWidth
                className="store-operation-edit-comment-input"
                inputProps={{ maxLength: 25 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="store-operation-edit-bottom-actions" style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            className="store-operation-edit-cancel-button"
            sx={{
              backgroundColor: '#6c757d',
              color: '#fff',
              fontSize: '20px',
              borderRadius: '10px',
              padding: '16px',
              flex: 1,
              border: 'none',
              '&:hover': { backgroundColor: '#495057' }
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            className="store-operation-edit-save-button"
            sx={{
              backgroundColor: '#170F58',
              color: '#fff',
              fontSize: '20px',
              borderRadius: '10px',
              padding: '16px',
              flex: 1,
              '&:hover': { backgroundColor: '#120a40' }
            }}
          >
            {saving ? '저장 중...' : '저장'}
          </Button>
        </div>

        {/* Time Picker Dialog */}
        <Dialog 
          open={showTimePicker} 
          onClose={() => setShowTimePicker(false)}
          PaperProps={{
            sx: {
              '& .MuiDialogTitle-root': {
                backgroundColor: '#170F58 !important',
                color: '#fff !important'
              },
              '& .MuiDialog-paper': {
                '& .MuiDialogTitle-root': {
                  backgroundColor: '#170F58 !important',
                  color: '#fff !important'
                }
              }
            }
          }}
        >
          <DialogTitle style={{ backgroundColor: '#170F58', color: '#fff' }}>
            시간 선택
          </DialogTitle>
          <DialogContent>
            <TimePicker
              value={currentTimeValue ? parse(currentTimeValue, 'HH:mm', new Date()) : null}
              onChange={handleTimeChange}
              format="HH:mm"
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowTimePicker(false)}
              sx={{ color: '#170F58' }}
            >
              취소
            </Button>
            <Button 
              onClick={confirmTimeChange} 
              variant="contained"
              sx={{ 
                backgroundColor: '#170F58',
                '&:hover': { backgroundColor: '#120a40' }
              }}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default StoreOperationEditPage; 