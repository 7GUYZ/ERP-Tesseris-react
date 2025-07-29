import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/Http';
import '../../styles/sichan/QnaDetailPage.css';

const QnaDetailPage = () => {
    const { qnaIndex } = useParams();
    const navigate = useNavigate();
    const [qnaDetail, setQnaDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQnaDetail();
    }, [qnaIndex]);

    const fetchQnaDetail = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get(`/sichan/qna/inquiry/${qnaIndex}`);

            if (response.data) {
                console.log('=== QnA 상세 API 응답 데이터 ===');
                console.log('전체 응답:', response.data);
                console.log('날짜 데이터:', {
                    qnaCreateTime: response.data.qnaCreateTime,
                    qnaCreateTimeType: typeof response.data.qnaCreateTime,
                    answerCreateTime: response.data.answerCreateTime,
                    answerCreateTimeType: typeof response.data.answerCreateTime
                });
                
                setQnaDetail(response.data);
            } else {
                setError('문의 상세 정보를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 상세 조회 오류:', error);
            
            if (error.response?.status === 401) {
                setError('인증이 만료되었습니다. 다시 로그인해주세요.');
            } else if (error.response?.status === 404) {
                setError('해당 문의를 찾을 수 없습니다.');
            } else if (error.response?.status === 500) {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                setError('문의 상세 정보를 불러오는 중 오류가 발생했습니다.');
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

    if (loading) {
        return (
            <div className="qna-detail-container">
                <div className="loading">문의 상세 정보를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="qna-detail-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    if (!qnaDetail) {
        return (
            <div className="qna-detail-container">
                <div className="error">문의를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="qna-detail-container">
            <div className="qna-detail-header">
                <button
                    onClick={() => navigate('/sichan/qna/list')}
                    className="btn-back"
                >
                    ← 목록으로
                </button>
                <h1>문의 상세</h1>
            </div>

            <div className="qna-detail-content">
                <div className="qna-question">
                    <div className="question-header">
                        <h2>{qnaDetail.questionTitle}</h2>
                        <div className="question-meta">
                            <span className="question-date">
                                {formatDate(qnaDetail.qnaCreateTime)}
                            </span>
                            <span className="question-status">
                                {qnaDetail.isAnswered ? '답변완료' : '답변대기'}
                            </span>
                        </div>
                    </div>
                    <div className="question-content">
                        <p>{qnaDetail.questionDesc}</p>
                    </div>
                </div>

                {qnaDetail.isAnswered && (
                    <div className="qna-answer">
                        <div className="answer-header">
                            <h3>답변</h3>
                            <div className="answer-meta">
                                <span className="answer-date">
                                    {formatDate(qnaDetail.answerCreateTime)}
                                </span>
                                {qnaDetail.answerUserName && (
                                    <span className="answer-user">
                                        답변자: {qnaDetail.answerUserName}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="answer-content">
                            {qnaDetail.answerTitle && (
                                <h4>{qnaDetail.answerTitle}</h4>
                            )}
                            <p>{qnaDetail.answerDesc}</p>
                        </div>
                    </div>
                )}

                {!qnaDetail.isAnswered && (
                    <div className="qna-waiting">
                        <p>답변을 기다리고 있습니다. 조금만 기다려주세요.</p>
                    </div>
                )}
            </div>

            <div className="qna-detail-actions">
                <button
                    onClick={() => navigate('/sichan/qna/list')}
                    className="btn-secondary"
                >
                    목록으로
                </button>
                {!qnaDetail.isAnswered && (
                    <button
                        onClick={() => navigate('/sichan/qna/inquiry')}
                        className="btn-primary"
                    >
                        새 문의하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default QnaDetailPage; 