import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import { Route, Routes } from "react-router-dom"
import Actions from './pages/actions';
import Strategies from './pages/strategies';
import Investments from './pages/investments';


function App() {
  return (
    <div className=" bg-slate-100 w-screen">
      <Header/>
      <Routes> 
          <Route path="/" element={<Actions/> } /> 
          <Route path="/strategies" element={<Strategies/> } /> 
          {/* <Route path="/investments" element={<Investments/> } />  */}
      </Routes>
    </div>
  );
}

export default App;
