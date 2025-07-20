import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resume from './pages/Resume';
import Internships from './pages/Internships';
import Applications from './pages/Applications';
import OrgProfile from './pages/OrgProfile';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/org-profile" element={<OrgProfile />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;