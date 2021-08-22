import React, { useEffect, useState} from 'react'
import { Col, Container, Tab, Tabs, Modal, Row, Button } from 'react-bootstrap'
import { useLocation } from "react-router-dom";
import CalenderSection from '../Components/CalenderSection'
import ActiveAppointment from './ActiveAppointment';
import {getPatientAppoinmtmentHistoryAPI} from "../DB/API"
import Calender from "react-calendar";
import { Avatar } from "@material-ui/core";
import {
  availableSlotsAPI
} from "../DB/API";
import moment from "moment";


const DoctorAppointmentsTab = (props) => {

    // const [tabKey, setTabKey] = useState('Appointment');
    const [tabKey, setTabKey] = useState(3);
    const doc_ID = useLocation().state.userId;
    console.log("my doctor id is : ",doc_ID);
    const [activePatients, setActivePatients] = useState([]);
    const [showCloseModal, setCloseModal] = useState(false);
    const [slots, setSlots] = useState([]);
    const [timeSlot, setTimeSlot] = useState();
    const [date, setDate] = useState(new Date());
    const [showRescheduleModal, setRescheduleModal] = useState(false);
    const [locationDays, setLocationDays] = useState([]);

    function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
    }

    //Patient appointment history

    
    useEffect(() => { 
    MaintainActivePatients();
    },[])

    const MaintainActivePatients = () => {
        return getPatientAppoinmtmentHistoryAPI(doc_ID,0,0,0,"GET")
        .then(result => {
            console.log("patient history api",result);
            setActivePatients(result);   
        });
    }

    // const [data,setData] = useState([]);
    // const doc_ID = useLocation();
    // // console.log("user id is ",doc_ID.state.userId)  
    // const [oneTime,setOneTime]=useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         oneTime && 
    //         GetDoctorAllInfoAPI(doc_ID.state.userId).then(result => {
    //             console.log("new api",result[0]);
    //             setData(result[0]);
    //         });
    //         setOneTime(false);
    //       }, 200);
    //     return () => clearTimeout(timer);
    // })
    
    // const refreshCallBack=()=>{
    //     // console.log("Call back");
    //     GetDoctorAllInfoAPI(doc_ID.state.userId).then(result => {
    //         console.log("new api",result[0]);
    //         setData(result[0]);
    //     });
    // }
    const callback = (status,appointment_id) => {
        console.log("callback parent: ", appointment_id);
        MaintainActivePatients().then( ()=>{
            if(status === "inprogress")
                setTabKey(appointment_id);
        });
    }

    const renderAppointmentDash = () => {
        return (
            // Add your code for calender and list here
            <div>
                <CalenderSection id={doc_ID} callback={callback} />
            </div>
        )
    }

    const renderPatientTab = () => {
        return (
            activePatients.map((item,i)=>(
                <Tab style={styles.tabContainer} eventKey={item.appointment_id} title={CustomTab(titleCase(item.patientinfo.name))} key={i}>
                    {renderPatientContent(item)}
                </Tab>
            ))
        )
    }

    const renderPatientContent = (item) => {
        return (
            <ActiveAppointment patientData={item} id={doc_ID} />
        )
    }

    const handleModalClose = () => {
        setCloseModal(false);
        setRescheduleModal(false);
    }
    
    const handleCompleteAppointment = (tabKey) => {
        console.log("Complete:", tabKey)
        setCloseModal(false)
    }

    const renderModal = (tabKey) => {
        return (
            <Modal
                show={showCloseModal} 
                onHide={handleModalClose}  
                size="lg"
                aria-labelledby="contained-modal-title"
                >
                <Modal.Header closeButton>
                <Modal.Title style={{color: "#e0004d"}}>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <div style={{flexDirection: "row", display: "flex", alignItems: "center",flex:"1", paddingLeft: 40, paddingBottom: 20, }}>
                            Do you want to complete {tabKey} tab?    
                        </div>
                    </Row>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleCompleteAppointment(tabKey)} style={{marginLeft:"10px"}}>
                        Complete Appointment
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const CustomTab = (title)=> { 
        return (
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <div>{title}</div>
            <div 
                style={{fontSize:14, width:24, paddingBottom:2, fontWeight: "bold"}} 
                onClick={(e) => {console.log("hi home close", title); setCloseModal(true)}}>x</div>
            </div>
        )
    }
    
    const [disabledDays, setDisabledDays] = useState([]);

  const collectDisabledDays = (docData, index) => {
    let a = [];
    let d1 = docData;
    console.log("d1,", d1);
    let d2 = d1.split("-");
    let days2 = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    for (var k = 0; k < 7; k++) {
      days = days.filter((item) => item !== d2[k]);
    }
    console.log("doc data is ", days);

    for (var j = 0; j < days.length; j++) {
      for (var i = 0; i < days2.length; i++) {
        if (days[j].toLowerCase() == days2[i].toLocaleLowerCase()) {
          console.log("i is ", i);

          a.push(i);
        }
      }
    }
    setDisabledDays(a);
  };

  const [locationData, setLocationData] = useState([]);
  const [selectValue, setSelectedValue] = useState();

  const handleChange1 = (e) => {
    setSelectedValue(e.target.value);
    console.log("days are ", e.target.days);
    // collectDisabledDays(getLocDays(e.target.value));
  };

  const availableSlots = (location_id, date) => {
    const mydate = moment(date);
    const newdate = mydate.format("YYYY-MM-DD");
    availableSlotsAPI(doc_ID, location_id, "PUT", newdate).then((result) => {
      console.log("available", result);
      setSlots(result[0].time_slots);
    });
  };

  const onChange = (date) => {
    setDate(date);
    availableSlots(1, 20-1-2021);
    //collectDisabledDays(data.appointment_location.days,0);
  };

  const schduleAppointmentModal = () =>{
    return(
      <Modal
      show={showRescheduleModal}
      onHide={handleModalClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#e0004d" }}>Schedule Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              flex: "1",
              paddingLeft: 40,
              paddingBottom: 20,
            }}
          ></div>
        </Row>
        <Row>
          <Col
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              flex: "1",
              paddingLeft: 40,
              paddingBottom: 20,
            }}
          >
            <Container>
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ marginRight: 10 }}>
                  {" "}
                  <label>Select Location : </label>{" "}
                </div>
                <div>
                  <select value={selectValue} onChange={handleChange1}>
                    {/* {renderItem()} */}
                  </select>
                </div>
              </Row>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* {console.log("privious date is ", data.date_time)} */}
            <Calender
              minDate={new Date()}
              maxDate={new Date(moment().add(3, "months"))}
              tileDisabled={({ date, view }) =>
                view === "month" && // Block day tiles only
                disabledDays.some(
                  (disabledDay) =>
                    //   date.getFullYear() === disabledDate.getFullYear() &&
                    //   date.getMonth() === disabledDate.getMonth() &&
                    date.getDay() === disabledDay
                )
              }
              onChange={onChange}
              value={new Date()}
            />
          </Col>
          <Col>
            <div style={{ color: "#e0004d" }}>Available Slots</div>
            {/* {renderAvailableSlots()} */}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          // onClick={() => handleConfirmReschedule(data.appointment_id)}
          style={{ marginLeft: "10px" }}
        >
          Schedule
        </Button>
      </Modal.Footer>
    </Modal>
    )
  } 


    const handleNewAppointmentModal = () => {
      setRescheduleModal(true);      
    }

    return(
        <div style={{width: "100%", paddingTop: 0}} {...props}>
            {renderModal(tabKey)}
            {/* <Col> */}
            <Tabs
                id="controlled-tab"
                activeKey={tabKey}
                onSelect={(k) => setTabKey(k)}
                >
                    <div style={{width:100, height:100, backgroundColor:"lightblue"}}>test</div>
                <Tab 
                style={styles.tabContainer}
                eventKey="Appointment" 
                title={"Home"}>
                    {renderAppointmentDash()}
                </Tab>
                {renderPatientTab()}
            </Tabs>
            {/* </Col> */}
            {/* <div onClick={()=>{handleNewAppointmentModal()}}
            style={{width:40, height:40, backgroundColor: "#e0004d", color: "white",
            zIndex:100, position:"fixed", bottom: 0, right: 0, margin: 50, borderRadius: 40, justifyContent: "center", alignItems: "baseline", display:"flex", flexDirection: "row",
            boxShadow: "0px 8px 16px #00000030", cursor: "pointer"
                }}>
                    <div style={{ fontWeight: "bolder", fontSize: 24, padddingTop: 0}}>+</div></div> */}
                    {schduleAppointmentModal()}
        </div>
    )
}

export default DoctorAppointmentsTab

const styles = {
    tabContainer : {borderWidth: 1, borderColor: "lightgray", borderStyle: "solid",background: "white", padding:0, paddingBottom: 30, borderTopWidth:0}
}