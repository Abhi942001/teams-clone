import './App.css';
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import Room from './Room';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {AuthProvider} from "./contexts/AuthContext"
import { RoomProvider } from './contexts/roomContext';
import RoomChat from './components/MeetingRoom/RoomChat/RoomChat';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

function App() {
  return (
    <Router>
    <AuthProvider>
      <RoomProvider>

      <div className="App ">
        <div className="Content">
          <Switch>
            {/* <PrivateRoute exact path="/Dashboard" component={Dashboard}/> */}
            <Route exact path="/DashBoard" component={Dashboard}/>
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
