import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import history from './services/history'
import DoctorProfile from './views/DoctorProfile/DoctorProfile';
import Login from './views/LogIn/Login'
import DoctorProfileTab from './views/Screens/DoctorProfileTab';
import DoctorAppointmentTab from './views/Screens/DoctorAppointmentsTab'
import PortalScreen from './views/Screens/PortalScreen';


// views
// import ListOfDoctors from "./views/listDoctors";

function App() {
  return (
    <BrowserRouter history={history}>
      <Switch>
        {/* <Route path="/Profile"  component={DoctorProfile}/> */}
        {/* <Route path="/Profile"  component={DoctorAppointmentTab}/> */}
        <Route path="/"         component={Login} exact={true}/>
        {/* <Route path={["/Profile", "/Appointments", "/widgets"]} component={props => <PortalScreen {...props} />} exact={true}/> */}
        <Route path="/Profile"  component={props => <PortalScreen selected={"profile"} {...props} />} exact={true}/>
        <Route path="/Appointments"  component={props => <PortalScreen selected={"appointment"} {...props} />} exact={true}/>
        <Route path="/Patients"  component={props => <PortalScreen selected={"patient"} {...props} />} exact={true}/>
        {/* <Route path="/Patients"  component={PortalScreen}/> */}
        {/* <Route path="/contact" component={Contact}/>
      <Route component={Error}/> */}
      </Switch>
    </BrowserRouter>
  )}

export default App;
