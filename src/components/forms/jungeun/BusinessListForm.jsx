import { useEffect, useState } from "react"
import "../../../styles/jungeun/businessList.css";
import { businessGradeFilter, businessList } from "../../../api/auth/JungeunAuth";

const MAIN_COLOR = "#170F58";
const POINT_COLOR = "#FDCD00";

const BusinessListForm = () => {
  const [selectedGrade, setSelectedGrade] = useState(""); // 등급 id(gradeIndex)로 저장
  const [partners, setPartners] = useState([]);
  const [grades, setGrades] = useState([]);

  // 등급 목록 받아오기 (컴포넌트 마운트 시 1회)
  useEffect(() => {
    const user_index = Number(JSON.parse(localStorage.getItem("user-info"))?.user_index);
    const fetchGrades = async () => {
      try {
        const res = await businessGradeFilter(user_index);
        console.log(res);
        setGrades(res.data.data); // 등급 배열만 저장
      } catch (e) {
        setGrades([]);
      }
    };
    fetchGrades();
  }, []);

  // 등급이 바뀔 때마다 백엔드에서 데이터 받아오기
  useEffect(() => {
    const user_index = Number(JSON.parse(localStorage.getItem("user-info"))?.user_index);
    const fetchPartners = async () => {
      if (!selectedGrade) {
        setPartners([]);
        return;
      }
      try {
        const res = await businessList(user_index, selectedGrade); // selectedGrade는 gradeIndex(숫자)
        setPartners(res.data.data);
      } catch (e) {
        setPartners([]);
      }
    };
    fetchPartners();
  }, [selectedGrade]);

  const BusinessPartnerCard = ({ partner }) => {
    return (
      <div className="business-partner-card">
        <div className="card-header">
          <div className="company-info">
            <h3 className="company-name">{partner.userName}</h3>
            <div
              className="position-badge"
              style={{
                backgroundColor: POINT_COLOR,
                color: MAIN_COLOR,
                borderColor: POINT_COLOR,
              }}
            >
              {partner.gradeName}
            </div>
          </div>
        </div>

        <div className="card-content">
          <div className="info-row">
            <span className="info-label">이메일</span>
            <span className="info-value">{partner.userEmail}</span>
          </div>
          <div className="info-row">
            <span className="info-label">이름</span>
            <span className="info-value">{partner.userName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">직급</span>
            <span className="info-value">{partner.gradeName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">수수료</span>
            <span className="info-value">{partner.totalCm}</span>
          </div>
          <div className="info-row">
            <span className="info-label">상급자</span>
            <span className="info-value">{partner.bossEmail || "-"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">가맹점 수</span>
            <span className="info-value">{partner.storeCount}개</span>
          </div>
        </div>

        <div className="card-actions">
          <button className="action-button primary" style={{ backgroundColor: MAIN_COLOR, color: '#fff' }}>
            산하 가맹점 확인
          </button>
        </div>
      </div>
    )
  }

  const BusinessPartnerList = ({ partners, grade }) => {
    return (
      <div className="business-partner-list">
        <div className="list-header">
          <div className="list-title-section">
            <h2 className="list-title" style={{ color: MAIN_COLOR }}>
              <span style={{ fontWeight: "bold", fontSize: "1.2em", color: MAIN_COLOR }}>
                {grade?.gradeName}
              </span>
              <span style={{ marginLeft: 14, color: "#888", fontSize: "1em" }}>
                산하 사업자
              </span>
            </h2>
          </div>
          <div className="total-count" style={{ background: MAIN_COLOR, color: '#fff' }}>
            총 인원 : {partners.length}
          </div>
        </div>

        {partners.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>해당 등급의 사업자가 없습니다.</p>
          </div>
        ) : (
          <div className="partner-grid">
            {partners.map((partner) => (
              <BusinessPartnerCard key={partner.userEmail} partner={partner} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const GradeSelector = ({ grades, selectedGrade, onGradeSelect }) => {
    return (
      <div className="grade-selector">
        <h2 className="selector-title" style={{ color: MAIN_COLOR }}>조회 가능한 사업자 등급</h2>
        <div className="grade-buttons">
          {grades.map((grade) => (
            <button
              key={grade.gradeIndex}
              className={`grade-button ${selectedGrade === grade.gradeIndex ? "active" : ""}`}
              onClick={() => onGradeSelect(grade.gradeIndex)}
              style={{
                borderColor: MAIN_COLOR,
                background: selectedGrade === grade.gradeIndex ? MAIN_COLOR : "transparent",
                color: selectedGrade === grade.gradeIndex ? "#fff" : MAIN_COLOR,
              }}
            >
              <span className="grade-name">{grade.gradeName}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="business-partner-page">
      <div className="page-header">
        <h1 className="page-title">산하 사업자</h1>
        <p className="page-subtitle">선택한 등급의 산하 사업자 정보를 조회할 수 있습니다</p>
      </div>

      <GradeSelector grades={grades} selectedGrade={selectedGrade} onGradeSelect={setSelectedGrade} />
      {selectedGrade && (
        <BusinessPartnerList
          partners={partners}
          grade={grades.find((g) => g.gradeIndex === selectedGrade)}
        />
      )}
    </div>
  )
}

export default BusinessListForm; 