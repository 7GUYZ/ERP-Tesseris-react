import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/Http';
import '../../styles/sichan/QnaListPage.css';

const QnaListPage = () => {
    const [qnaList, setQnaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQnaList();
    }, []);

    const testApiConnection = async () => {
        try {
            console.log('API 연결 테스트 시작');
            
            // 헬스체크 테스트
            const healthResponse = await api.get('/sichan/qna/health');
            console.log('헬스체크 응답:', healthResponse.data);
            
            // 데이터베이스 테스트
            const dbResponse = await api.get('/sichan/qna/db-test');
            console.log('DB 테스트 응답:', dbResponse.data);
            
            // 테스트 엔드포인트
            const testResponse = await api.get('/sichan/qna/test');
            console.log('테스트 응답:', testResponse.data);
            
            console.log('API 연결 테스트 완료:', {
                헬스체크: healthResponse.data,
                DB테스트: dbResponse.data,
                테스트: testResponse.data
            });
            
        } catch (error) {
            console.error('API 연결 테스트 실패:', error);
        }
    };

    const fetchQnaList = async () => {
        try {
            setLoading(true);
            setError('');

            // 먼저 API 연결 테스트
            await testApiConnection();

            console.log('QnA 목록 조회 시작');
            const response = await api.get('/sichan/qna/inquiry/list');
            console.log('QnA 목록 응답:', response);

            if (response.data) {
                console.log('=== QnA 목록 API 응답 데이터 ===');
                console.log('전체 응답:', response.data);
                
                // 각 QnA 항목의 날짜 데이터 확인
                response.data.forEach((qna, index) => {
                    console.log(`QnA ${index + 1}:`, {
                        qnaIndex: qna.qnaIndex,
                        qnaCreateTime: qna.qnaCreateTime,
                        qnaCreateTimeType: typeof qna.qnaCreateTime,
                        answerCreateTime: qna.answerCreateTime,
                        answerCreateTimeType: typeof qna.answerCreateTime,
                        isAnswered: qna.isAnswered
                    });
                });
                
                setQnaList(response.data);
                console.log('QnA 목록 설정 완료:', response.data);
            } else {
                setError('문의 내역을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 내역 조회 오류:', error);
            
            if (error.response?.status === 401) {
                setError('인증이 만료되었습니다. 다시 로그인해주세요.');
            } else if (error.response?.status === 500) {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                setError('문의 내역을 불러오는 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '날짜 없음';
        
        try {
            console.log('날짜 파싱 시도:', dateString, '타입:', typeof dateString);
            
            let date;
            
            // 문자열인 경우 다양한 형식 시도
            if (typeof dateString === 'string') {
                // ISO 형식 (2024-01-15T14:30:00)
                if (dateString.includes('T')) {
                    date = new Date(dateString);
                }
                // 한국 형식 (2024-01-15 14:30:00)
                else if (dateString.includes('-') && dateString.includes(':')) {
                    date = new Date(dateString.replace(' ', 'T'));
                }
                // 기타 형식
                else {
                    date = new Date(dateString);
                }
            } else {
                date = new Date(dateString);
            }
            
            // Invalid Date 체크
            if (isNaN(date.getTime())) {
                console.warn('Invalid date string:', dateString);
                return '날짜 형식 오류';
            }
            
            const formatted = date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            console.log('날짜 파싱 성공:', dateString, '→', formatted);
            return formatted;
            
        } catch (error) {
            console.error('Date formatting error:', error, 'for dateString:', dateString);
            return '날짜 형식 오류';
        }
    };

    const handleQnaClick = (qnaIndex) => {
        navigate(`/sichan/qna/detail/${qnaIndex}`);
    };

    if (loading) {
        return (
            <div className="qna-list-container">
                <div className="loading">문의 내역을 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="qna-list-container">
                <div className="error">{error}</div>
                <button onClick={fetchQnaList} style={{ marginTop: '10px', padding: '10px 20px' }}>
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="qna-list-container">
            <div className="qna-list-header">
                <h1>문의 내역</h1>
                <button
                    onClick={() => navigate('/sichan/qna/inquiry')}
                    className="btn-primary"
                >
                    새 문의하기
                </button>
            </div>

            {qnaList.length === 0 ? (
                <div className="empty-state">
                    <p>등록된 문의가 없습니다.</p>
                    <button
                        onClick={() => navigate('/sichan/qna/inquiry')}
                        className="btn-primary"
                    >
                        첫 문의 작성하기
                    </button>
                </div>
            ) : (
                <div className="qna-list">
                    {qnaList.map((qna) => (
                        <div
                            key={qna.qnaIndex}
                            className={`qna-item ${qna.isAnswered ? 'answered' : 'waiting'}`}
                            onClick={() => handleQnaClick(qna.qnaIndex)}
                        >
                            <div className="qna-status">
                                {qna.isAnswered ? (
                                    <span className="status-answered">답변완료</span>
                                ) : (
                                    <span className="status-waiting">답변대기</span>
                                )}
                            </div>
                            <div className="qna-content">
                                <h3 className="qna-title">{qna.questionTitle}</h3>
                                <p className="qna-desc">
                                    {qna.questionDesc.length > 100
                                        ? qna.questionDesc.substring(0, 100) + '...'
                                        : qna.questionDesc}
                                </p>
                                <div className="qna-meta">
                                    <span className="qna-date">
                                        {formatDate(qna.qnaCreateTime)}
                                    </span>
                                    {qna.isAnswered && (
                                        <span className="answer-date">
                                            답변: {formatDate(qna.answerCreateTime)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QnaListPage; 