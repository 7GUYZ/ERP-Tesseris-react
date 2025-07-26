import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreMyInfo } from "../../api/auth/DabinAuth";
import "../../styles/dabin/MyPageStoreInfo.css";

const MyPageStoreInfo = () => {
  const [info, setInfo] = useState({
    storeName: "",
    storeCategoryName: "",
    storeAddress: "",
    storePhone: "",
    storeSite: "",
    busineeUserId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getStoreMyInfo()
      .then((res) => setInfo(res.data))
      .catch(() => setInfo({
        storeName: "",
        storeCategoryName: "",
        storeAddress: "",
        storePhone: "",
        storeSite: "",
        busineeUserId: "",
      }));
  }, []);

  const handleChangeInfo = () => {
    navigate('/store');
  };

  return (
    <div className="mypage-storeinfo-container">
      {/* 헤더 */}
      <div className="mypage-storeinfo-header">
        <button
          onClick={() => navigate("/my")}
          className="mypage-storeinfo-back-button"
          aria-label="뒤로가기"
        >
          {"<"}
        </button>
        <span className="mypage-storeinfo-title">
          가맹점 정보
        </span>
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">매장명</div>
        <input value={info.storeName} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">매장 카테고리</div>
        <input value={info.storeCategoryName} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">주소</div>
        <input value={info.storeAddress} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">연락처</div>
        <input value={info.storePhone} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">대표사이트</div>
        <input value={info.storeSite} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <div className="mypage-storeinfo-field-container">
        <div className="mypage-storeinfo-field-label">담당자 아이디</div>
        <input value={info.busineeUserId} readOnly className="mypage-storeinfo-field-input" />
      </div>
      <button
        className="mypage-storeinfo-change-button"
        onClick={handleChangeInfo}
      >
        정보변경
      </button>
    </div>
  );
};

export default MyPageStoreInfo;