import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

function StoreTransactionHistory() {
  const [form, setForm] = useState({ // 검색
    user_id: '',
    user_name: '',
    user_phone: '',
    store_name: '',
    temporary_store_master_charge_time_start: '',
    temporary_store_master_charge_time_end: '',
    store_category_index: '0',
    temporary_store_master_transaction_name: ''
  });

  const [categories, setCategories] = useState([]);
  const [authority, setAuthority] = useState({
    insert: false,
    delete: false,
    update: false
  });

  // 권한 처리 해야함



  // 2. 카테고리 리스트 가져오기
  useEffect(() => {
    axios.get('/api/store-categories')
      .then(res => setCategories(res.data))
      .catch(() => alert('카테고리를 가져올 수 없습니다.'));
  }, []);

  //  3. form 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  // 그리드 라이브러리로 가맹점,사업자 가져오는거
    const [storeRows, setStoreRows] = useState([]);
    const [bizRows, setBizRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const storeColumns = [
        { headerName: '아이디', field: 'user_id' },
        { headerName: '이름', field: 'user_name' },
        { headerName: '사업자 이름', field: 'user_name2' },
        { headerName: '핸드폰 번호', field: 'user_phone' },
        { headerName: '가맹점 명', field: 'store_name' },
        { headerName: '승인 여부', field: 'store_request_status_name' },
        { headerName: '거래 상태', field: 'store_transaction_status' },
        { headerName: '사업자등록번호', field: 'store_registration_num' },
        { headerName: '카테고리', field: 'store_category_name' },
        { headerName: '거래명', field: 'temporary_store_master_transaction_name' },
        { headerName: '충전 시간', field: 'temporary_store_master_charge_time' },
        { headerName: '가맹비', field: 'franchise_fee' },
        { headerName: '분배 여부', field: 'temporary_store_master_distribution_status' },
        { headerName: '충전CM', field: 'temporary_store_cm_value' },
        { headerName: '결제금액', field: 'temporary_store_cash_value' },
    ];

    const bizColumns = [
        { headerName: '아이디', field: 'user_id' },
        { headerName: '이름', field: 'user_name' },
        { headerName: '핸드폰 번호', field: 'user_phone' },
        { headerName: '직급', field: 'business_grade_name' },
        { headerName: '담당 구역', field: 'business_area_name' },
        { headerName: '중개수수료 CM', field: 'temporary_store_cm_value' },
        { headerName: '중개수수료 Cash', field: 'temporary_store_cash_value' },
        { headerName: '중개수수료 합계', field: 'temporary_store_total_value' },
    ];


    const fetchStoreRows = async () => {
    try {
      const formData = new FormData();
      for (const key in form) formData.append(key, form[key]);
      formData.append('type', 'search');

      const { data } = await axios.post('/store_charge_ajax.php', formData);
      setStoreRows(data.msg);
    } catch (err) {
      console.error('Store list fetch failed', err);
    }
  };

  const fetchBizRows = async (temporary_store_master_index) => {
    try {
      const formData = new FormData();
      formData.append('type', 'search2');
      formData.append('temporary_store_master_index', temporary_store_master_index);
      const { data } = await axios.post('/store_charge_ajax.php', formData);
      setBizRows(data.msg);
    } catch (err) {
      console.error('Biz list fetch failed', err);
    }
  };

  useEffect(() => {
    fetchStoreRows();
  }, []);


  return (
    <div className="wrap">
      <div className="content">
        <div className="content_inner">
          <div className="mb10 flex_between">
            <p className="font_20 bold">가맹점 충전 현황</p>
            <p className="font_20 bold">
              <button type="button" className="green small" id="excel_btn">엑셀</button>
              <button type="button" className="edit small" id="search_btn">조회</button>
            </p>
          </div>

          {/* 검색 영역 */}
          <div className="card">
            <div className="card_inner">
              <form id="search_form">
                <table>
                  <tbody>
                    <tr>
                      <td width="5%">ID</td>
                      <td width="20%">
                        <input type="text" name="user_id" value={form.user_id} onChange={handleChange} />
                      </td>
                      <td width="5%">이름</td>
                      <td width="20%">
                        <input type="text" name="user_name" value={form.user_name} onChange={handleChange} />
                      </td>
                      <td width="5%">핸드폰 번호</td>
                      <td width="20%">
                        <input type="text" name="user_phone" value={form.user_phone} onChange={handleChange} />
                      </td>
                      <td width="5%">가맹점 명</td>
                      <td width="20%">
                        <input type="text" name="store_name" value={form.store_name} onChange={handleChange} />
                      </td>
                    </tr>
                    <tr>
                      <td>충전일</td>
                      <td>
                        <input type="date" name="temporary_store_master_charge_time_start" value={form.temporary_store_master_charge_time_start} onChange={handleChange} />
                      </td>
                      <td>~</td>
                      <td>
                        <input type="date" name="temporary_store_master_charge_time_end" value={form.temporary_store_master_charge_time_end} onChange={handleChange} />
                      </td>
                      <td>카테고리</td>
                      <td>
                        <select name="store_category_index" value={form.store_category_index} onChange={handleChange}>
                          <option value="0">카테고리를 선택하세요</option>
                          {categories.map(cat => (
                            <option key={cat.store_category_index} value={cat.store_category_index}>
                              {cat.store_category_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>거래명</td>
                      <td>
                        <input type="text" name="temporary_store_master_transaction_name" value={form.temporary_store_master_transaction_name} onChange={handleChange} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>

          {/* 그리드 영역 */}
          <div className="flex gap-4">
            <div className="ag-theme-alpine" style={{ height: '600px', width: '50%' }}>
                <div className="mb-2">가맹점</div>
                <AgGridReact
                rowData={storeRows}
                columnDefs={storeColumns}
                rowSelection="single"
                onRowClicked={(e) => {
                    setSelectedRow(e.data);
                    fetchBizRows(e.data.temporary_store_master_index);
                }}
                />
            </div>
            <div className="ag-theme-alpine" style={{ height: '600px', width: '50%' }}>
                <div className="mb-2">사업자</div>
                <AgGridReact
                rowData={bizRows}
                columnDefs={bizColumns}
                rowSelection="single"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreTransactionHistory;
