import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../../context/jungeun/ToastContext.jsx"
import { getBrokerageFee } from "../../../api/auth/JungeunAuth"
import "../../../styles/jungeun/brokerageFee.css"

const BrokerageFeeForm = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [feeData, setFeeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  // 백엔드에서 중개수수료 데이터 가져오기
  const fetchBrokerageFeeData = async () => {
    try {
      setIsLoading(true)
      
      // 사용자 정보 가져오기
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const userIndex = userInfo?.user_index;

      // API 호출
      const response = await getBrokerageFee(userIndex);
      if(response.data.resultCode === 200){
        const apiData = response.data.data;
        
        // 백엔드 응답 구조에 맞게 데이터 변환
        const formattedData = [
          {
            label: "TS 수수료 총합",
            amount: apiData.cmValueChargeSum?.toLocaleString() || "0",
            unit: "TS",
          },
          {
            label: "수수료 발생",
            amount: apiData.cmValueTotalSum?.toLocaleString() || "0",
            unit: "TS",
          },
          {
            label: "입금 대기",
            amount: apiData.cmValueWaitSum?.toLocaleString() || "0",
            unit: "TS",
          },
          {
            label: "입금 완료",
            amount: apiData.cmValueYesSum?.toLocaleString() || "0",
            unit: "TS",
          },
        ]

        setFeeData(formattedData)
      }else{
        showToast("error", "중개수수료율 조회 실패");
        
        // 에러 시 기본 데이터 표시
        setFeeData([
          {
            label: "TS 수수료 총합",
            amount: "0",
            unit: "TS",
          },
          {
            label: "수수료발생",
            amount: "0",
            unit: "TS",
          },
          {
            label: "입금 대기",
            amount: "0",
            unit: "TS",
          },
          {
            label: "입금 완료",
            amount: "0",
            unit: "TS",
          },
        ])
      }
    } catch (error) {
      console.error("중개수수료 데이터 로딩 실패:", error)
      showToast("error", "데이터를 불러오는데 실패했습니다")
      
      // 에러 시 기본 데이터 표시
      setFeeData([
        {
          label: "TS 수수료 총합",
          amount: "0",
          unit: "TS",
        },
        {
          label: "수수료발생",
          amount: "0",
          unit: "TS",
        },
        {
          label: "입금 대기",
          amount: "0",
          unit: "TS",
        },
        {
          label: "입금 완료",
          amount: "0",
          unit: "TS",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBrokerageFeeData()
  }, [])

  return (
    <div className="brokerageFee-container">
      <div className="brokerageFee-header">
        <button className="brokerageFee-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="brokerageFee-header-title">중개수수료 현황</h1>
      </div>

      <div className="brokerageFee-content">
        {isLoading ? (
          <div className="brokerageFee-loading">
            <div className="brokerageFee-loading-spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="brokerageFee-fee-cards">
            {feeData.map((item, index) => (
              <div key={index} className="brokerageFee-fee-card">
                <div className="brokerageFee-fee-label">{item.label}</div>
                <div className="brokerageFee-fee-amount">
                  {item.amount} <span className="brokerageFee-fee-unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrokerageFeeForm
