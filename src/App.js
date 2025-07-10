import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import StoreList from './pages/store/StoreList';

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <div className='main-container'>
          <Routes>
            <Route path='/' element={<StoreList />} />
            <Route path='/stores' element={<StoreList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
