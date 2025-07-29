import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/Http';
import '../../styles/sichan/QnaInquiryPage.css';

const QnaInquiryPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        questionTitle: '',
        questionDesc: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.questionTitle.trim() || !formData.questionDesc.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await api.post('/sichan/qna/inquiry', formData);

            if (response.data) {
                alert('문의가 성공적으로 등록되었습니다.');
                navigate('/sichan/qna/list');
            } else {
                alert('문의 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 등록 오류:', error);
            
            if (error.response?.status === 401) {
                alert('인증이 만료되었습니다. 다시 로그인해주세요.');
            } else if (error.response?.status === 400) {
                alert('입력 정보를 확인해주세요.');
            } else if (error.response?.status === 500) {
                alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                alert('문의 등록 중 오류가 발생했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="qna-inquiry-container">
            <div className="qna-inquiry-header">
                <h1>문의하기</h1>
                <p>궁금한 점이나 문의사항이 있으시면 언제든지 문의해주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="qna-inquiry-form">
                <div className="form-group">
                    <label htmlFor="questionTitle">제목</label>
                    <input
                        type="text"
                        id="questionTitle"
                        name="questionTitle"
                        value={formData.questionTitle}
                        onChange={handleInputChange}
                        placeholder="문의 제목을 입력해주세요"
                        maxLength={150}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="questionDesc">내용</label>
                    <textarea
                        id="questionDesc"
                        name="questionDesc"
                        value={formData.questionDesc}
                        onChange={handleInputChange}
                        placeholder="문의 내용을 자세히 입력해주세요"
                        rows="10"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/sichan/qna/list')}
                        className="btn-secondary"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                    >
                        {isSubmitting ? '등록 중...' : '문의 등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QnaInquiryPage; 