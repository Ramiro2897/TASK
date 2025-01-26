import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
