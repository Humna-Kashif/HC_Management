import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { Col, Container, Tab, Tabs, Modal, Row } from 'react-bootstrap'
import { getImage } from '../DB/API'
import { Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import {locationsAPI,GetDoctorAllInfoAPI,availableSlotsAPI,addAppointmentAPI} from "../DB/API";
import { useLocation } from "react-router-dom";
import Calender from "react-calendar";
import moment from "moment";
import '../Styles/Calender.css'
import 'react-calendar/dist/Calendar.css';

const PatientProfileHeader = (props) => {
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showCloseModal, setCloseModal] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [disabledDays, setDisabledDays] = useState([]);
    const [selectValue, setSelectedValue] = useState();
    const [docAppointmentType,setDocAppointmentType]=useState('');
    const [date, setDate] = useState(new Date());
    const doc_ID = useLocation().state.userId;
    const handleModalClose = () => {
        setCloseModal(false);
        setShowAppointmentModal(false);
    }
    function titleCase(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    const [image, setImage] = useState(null);
    useEffect(() => {
        GetDoctorAllInfoAPI(doc_ID).then((result) => {
            console.log("doctor info in Appointmentlist tab", result[0].appointment_type);
            if( result[0])
            setDocAppointmentType(result[0].appointment_type);
          });
        getImage('patients',props.info.patient_id)
        .then((json) => {setImage("data:image;charset=utf-8;base64,"+json.encodedData)})
        .catch((error) => console.error(error))
        .finally(() => {
        });
        locationsAPI(doc_ID).then((result) => {
            console.log("location api results", result);
            setLocationData(result);
            // setSelectedValue(data.appointment_location.appointment_location_of_doctor);
            // collectDisabledDays(data.appointment_location.days);
          });
    }, []);
    const [locationID, setLoactionID] = useState();
    const getLocDays = (value) => {
        for (var i = 0; i < locationData.length; i++) {
          if (locationData[i].location == value) {
            setLoactionID(locationData[i].doctors_hospital_location_id);
            return locationData[i].days;
          }
        }
        return [];
      };

    const showModal=()=>{
        setShowAppointmentModal(true);
    }

    const handleChange1 = (e) => {
        setSelectedValue(e.target.value);
        console.log("days are ", e.target.days);
        collectDisabledDays(getLocDays(e.target.value));
    };

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
    const renderItem = () => {
        console.log("locationData is ", locationData);
        return locationData.map((item, i) => (
          <option value={item.location}>
            {item.location}
          </option>
        ));
      };

    const [patAppointmentType,setPatAppointmentType]=useState();
    const AppointmentTypeRadioButton = ({ value }) => {
    return (
        <input
        style={{ width: 20 }}
        type="radio"
        value={value}
        name="appointment_type"
        checked={patAppointmentType}
        onChange={(e) =>setPatAppointmentType(e.target.value)}
        />
    );
    };

    const renderAppointmentType = (value) =>{
    if(value === "both")
    return(
    <div>
        <AppointmentTypeRadioButton value={"inperson"} /> <span>inperson</span>
        <AppointmentTypeRadioButton value={"telehealth"} /> telehealth
    </div>) 
    else
    return(<div>{docAppointmentType}</div>)
    }
    const [slots, setSlots] = useState([]);
    const [timeSlot, setTimeSlot] = useState();

    const availableSlots = (location_id, date) => {
        const mydate = moment(date);
        const newdate = mydate.format("YYYY-MM-DD");
        availableSlotsAPI(doc_ID, location_id, "PUT", newdate).then((result) => {
          console.log("available", result);
          if(result[0])
          setSlots(result[0].time_slots);
        });
      };
    const onChange = (date) => {
        setDate(date);
        availableSlots(locationID, date);
        console.log("my date ",date);
        // collectDisabledDays(data.appointment_location.days,0);
    };
    const renderAvailableSlots = () => {
    return (
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {slots.map((item) => (
            <input
            style={{
                backgroundColor: "white",
                color: "black",
                width: 80,
                borderRadius: 5,
                textAlign: "center",
                padding: 2,
                margin: 5,
            }}
            onClick={() =>
                setTimeSlot(
                moment(
                    moment(date).format("YYYY-MM-DD") +
                    "T" +
                    item.available_time_slot +
                    "+00"
                ).format("LT")
                )
            }
            class="btn btn-primary"
            type="button"
            value={moment(
                moment(date).format("YYYY-MM-DD") +
                "T" +
                item.available_time_slot +
                "+00"
            ).format("LT")}
            ></input>
        ))}
        </div>
    );
    };  
    const handleAddAppointment = () =>{
        const mydate = moment(date);
        const newdate = mydate.format("YYYY-MM-DD");
        console.log("location id : ",locationID, "time ", timeSlot, " patAppointmentType ", patAppointmentType," date",newdate);
        addAppointmentAPI(doc_ID,locationID,props.info.patient_id,0,"POST",newdate,timeSlot,patAppointmentType).then((result)=>{
            console.log(result);
        });
        setShowAppointmentModal(false);
    }
    const renderNewAppointmentModal = () =>{
        return(
            <Modal
            show={showAppointmentModal}
            onHide={handleModalClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
            <Modal.Title style={{ color: "#e0004d" }}>New Appointment</Modal.Title>
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
                <div style={styles.header_container}>
                    <Avatar src={image} style={styles.avatar}/>   
                    <div style={styles.title_container}>
                        <div style={styles.title__name}>{titleCase(props.info.name)}</div>
                        <div style={styles.title__label}>{props.status}</div>
                    </div>
                </div>
            </Row>
            <Row style={styles.header_container}>
                  <div style={{ marginRight: 10 }}>
                    {" "}
                    <label>Select Location : </label>{" "}
                  </div>
                  <div>
                    <select value={selectValue} onChange={handleChange1}>
                      {renderItem()}
                    </select>
                  </div>
            </Row>
            <Row style={styles.header_container}>
                  <div style={{ marginRight: 10 }}>
                    {" "}
                    <label>Appointment Type: </label>{" "}
                  </div>
                  <div>
                    {renderAppointmentType(docAppointmentType)}
                  </div>
            </Row>
            <Row>
            <Col>
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
                value={date}
              />
            </Col>
            <Col>
              <div style={{ color: "#e0004d" }}>Available Slots</div>
              {renderAvailableSlots()}
            </Col>
          </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button
                variant="primary"
                onClick={() => handleAddAppointment()}
                style={{ marginLeft: "10px" }}>
                    Add Appoinment
            </Button>
            </Modal.Footer>
          </Modal>
        )
    }
    return (
        <Row style={{display:"flex"}}>
         <Col lg={9}>
         <div style={styles.header_container}>
            <Avatar src={image} style={styles.avatar}/>   
            <div style={styles.title_container}>
                <div style={styles.title__name}>{titleCase(props.info.name)}</div>
                <div style={styles.title__label}>{props.status}</div>
            </div>
        </div>
         </Col>
         <Col lg={3}>
            <Button size="md" variant="primary" style={styles.AppointmentBtn} onClick={()=>{showModal()}} >
                New Appointment +
            </Button>
         </Col>
         {renderNewAppointmentModal()}
        </Row>
    )
}

export default PatientProfileHeader;

PatientProfileHeader.defaultProps = {
    imageURL: "",
    patientName : "Nameee",
    appointmentLabel : "this is awesome",
    info: {
        image: "",
        name: "Sample Patient"
    }
};

const styles = {
    header_container: {display: "flex", flexDirection: "row", padding: 10, alignItems:"center"},
    avatar: { height:"50px", width:"50px", borderWidth: 0.3, borderColor: "#e0004d", borderStyle: "solid"},
    title_container: {display: "flex", flexDirection: "column", textAlign: "left", marginLeft: 10},
    title__name: {color: "#e0004d", fontSize: 20, fontWeight: "bold"},
    title__label: {color: "#00000081", fontSize:16},
    AppointmentBtn : {marginRight: 5,width: 200,backgroundColor: "#e0004d",borderColor: "#e0004d",marginTop: "10px",float:"right"}
};