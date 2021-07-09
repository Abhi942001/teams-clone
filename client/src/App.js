import './App.css';
import SignIn from "./components/SignIn/SignIn"
import Dashboard from './views/Dashboard';
import Room from './views/Room';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {AuthProvider} from "./contexts/AuthContext"
import { RoomProvider } from './contexts/roomContext';
import RoomChat from './components/MeetingRoom/RoomChat/RoomChat';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import PrivateRoute from "./PrivateRoute"
initializeIcons();

function App() {
  return (
    <Router>
    <AuthProvider>
      <RoomProvider>

      <div className="App ">
        <div className="Content">
          <Switch>
            <PrivateRoute exact path="/Dashboard" component={Dashboard}/>
            {/* <Route exact path="/DashBoard" component={Dashboard}/> */}
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/chats" component={RoomChat}/>
            <Route exact path="/room/:roomID" component={Room}/>
          </Switch>
        </div>
      </div>
      </RoomProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
