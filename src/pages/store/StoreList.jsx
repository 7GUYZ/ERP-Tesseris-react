import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Grid, Box } from '@mui/material';
import { api } from '../../api/http';

const columns = [
  { field: 'storeName', headerName: '가맹점 이름', width: 160 },
  { field: 'userId', headerName: '회원 ID', width: 120 },
  { field: 'userName', headerName: '이름', width: 100 },
  { field: 'userPhone', headerName: '핸드폰 번호', width: 140 },
  { field: 'storeCorporateName', headerName: '대표자 이름', width: 120 },
  { field: 'storeRegistrationNum', headerName: '사업자 등록번호', width: 160 },
  { field: 'storeRequestStatusName', headerName: '승인 여부', width: 100 },
  { field: 'storeTransactionStatus', headerName: '거래 상태', width: 100 },
  { field: 'storePhone', headerName: '가맹 대표번호', width: 140 },
  { field: 'storeCategoryName', headerName: '가맹점 카테고리', width: 120 },
  { field: 'storeTypeTaxation', headerName: '가맹점 유형', width: 140 },
];

function StoreList() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({
    userId: '',
    userName: '',
    storeName: '',
  });

const fetchStores = async (params = {}) => {
  try {
    const cleanedParams = {};

    // 빈 문자열은 아예 안 보내도록 필터링
    if (params.userId) cleanedParams.userId = params.userId;
    if (params.userName) cleanedParams.userName = params.userName;
    if (params.storeName) cleanedParams.storeName = params.storeName;

    const response = await api.get('/store/list', {
      params: Object.keys(cleanedParams).length > 0 ? cleanedParams : undefined,
    });

    const data = response.data.map((item, index) => ({
      id: index + 1,
      ...item,
    }));
    setRows(data);
  } catch (error) {
    console.error('조회 실패:', error);
    alert('데이터를 불러오는 데 실패했습니다.');
  }
};

  // 1️⃣ 페이지 진입 시 → 빈 검색 조건으로 전체 데이터 자동 조회
  useEffect(() => {
    fetchStores(); 
  }, []);

  // 2️⃣ 조회 버튼 클릭 시 → 현재 검색 조건으로 조회
  const handleSearch = () => {
    fetchStores({
      userId: filter.userId || undefined,
      userName: filter.userName || undefined,
      storeName: filter.storeName || undefined,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>가맹점 회원 리스트</h2>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="회원 ID"
            value={filter.userId}
            onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="이름"
            value={filter.userName}
            onChange={(e) => setFilter({ ...filter, userName: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="가맹점 이름"
            value={filter.storeName}
            onChange={(e) => setFilter({ ...filter, storeName: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={handleSearch} sx={{ mt: 1 }}>
            조회
          </Button>
        </Grid>
      </Grid>

      <div style={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </div>
    </Box>
  );
}

export default StoreList;
