import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Camera from './pages/Camera';
import Login from './pages/Login';
import Register from './pages/Register';
import Page1 from './pages/Page1';
import Camres from './pages/Camres';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';    
import HasilFoto from './pages/HasilFoto';  
import SignUp from './pages/Register'; 
import Reset from './pages/ForgotPassword'; 
import './App.css'
import './index.css';
// function App() {
//   return <Home />;
     

// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Page1" element={<Page1 />} />
        <Route path="/Camera" element={<Camera />} />
        <Route path="/Camres" element={<Camres />} />
        <Route path="/Result" element={<Result />} />
        <Route path="/History" element={<History />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/HasilFoto" element={<HasilFoto />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/forgot-password" element={<Reset/>} />
      </Routes>
    </Router>
  );
}


export default App
