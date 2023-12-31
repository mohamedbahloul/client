import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil";
import CreateForum from "./pages/CreateForum";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Carte from "./pages/Carte";
import Register from "./pages/Register";
import Agenda from "./pages/Agenda";
import Page404 from "./pages/Page404";
import Projet from "./pages/Projet"
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import UpdateBd from "./pages/UpdateBd";
import ClearBd from "./pages/ClearBd";
import UpdateEvent from "./pages/UpdateEvent";
import Chercheur from "./pages/Chercheur";
import EventDetails from "./pages/EventDetails"; 
import Footer from "./components/Footer";
import Annuaire from "./pages/Annuaire";
import VerifyUrl from "./pages/VerfiyUrl";
import ChercheurDetails from "./pages/ChercheurDetails";
import Ressources from "./pages/Ressources";
import StageEtEmploi from "./pages/StageEtEmploi";
import Admin from "./pages/Admin";
import Apropos from "./pages/Apropos";
import Universite from "./pages/Universite";
import Laboratoire from "./pages/Laboratoire";
import AutreEtab from "./pages/AutreEtab";
import Partenaire from "./pages/Partenaire";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Upload from "./pages/Upload";
import PropagateLoader from "react-spinners/PropagateLoader"
import Profile from "./pages/Profile";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    role: "",
  });
  const [loading, setLoading] = useState(true); // Ajoutez cet état
  const [openLinks, setOpenLinks] = useState(false);
  useEffect(() => {
    axios
      .get("https://back.r3mob.fr/auth/verify", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.error) {
          setAuthState({
            username: "",
            id: 0,
            status: false,
            role: "",
          });
        } else {
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            status: true,
            role: res.data.pilote,
          });
        }
        setLoading(false); 
      });
  }, []);

  if (loading) {
    return <PropagateLoader cssOverride={{
      "display": "flex",
      "justifyContent": "center", "alignItems": "center", "height": "100vh"
    }}
      color="#36d7b7" />
  }

  return (
    <div className="App">

      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar authState={authState} />
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/login" exact Component={Login} />
            <Route path="/carte" exact Component={Carte} />
            <Route path="/agenda" exact Component={Agenda} />
            <Route path="/projet" exact Component={Projet} />
            <Route path="/updateBd" exact Component={UpdateBd}/>
            <Route path="/clearBd" exact Component={ClearBd}/>
            <Route path="/updateEvent" exact Component={UpdateEvent}/>
            <Route path="/chercheur" exact Component={Chercheur}/>
            <Route path="/event/:eventId" element={<EventDetails />} />  
            <Route path="/annuaires" exact Component={Annuaire}/>
            <Route path="/verifyUrl" exact Component={VerifyUrl}/>
            <Route path="/chercheur/:chercheurId" element={<ChercheurDetails />} />
            <Route path="/ressources" exact Component={Ressources}/>
            <Route path="/stage&emploi" exact Component={StageEtEmploi}/>
            <Route path="/admin" exact Component={Admin}/>
            <Route path="/apropos" exact Component={Apropos} />
            <Route path="/login/:id" element={<Login />} />
            <Route path="/universite" exact Component={Universite} />
            <Route path="/laboratoire" exact Component={Laboratoire} />
            <Route path="/autreEtab" exact Component={AutreEtab} />
            <Route path="/partenaire" exact Component={Partenaire} />
            <Route path="/reset-password/:token" exact Component={ResetPassword} />
            <Route path="/changePassword" exact Component={ChangePassword} />
            <Route path="/uploadBase" exact Component={Upload} />
            <Route path="/profile" exact Component={Profile} />

            
            
            <Route path="/404" exact Component={Page404} />


            <Route path="*" exact Component={Page404} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
