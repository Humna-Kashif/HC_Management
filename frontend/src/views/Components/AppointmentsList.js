import React, { useEffect, useState } from "react";
import { Button, Col, Row, Card, Container, Modal } from "react-bootstrap";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Avatar } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import CalenderSection from "../Components/CalenderSection";
import Dropdown from "../Components/Dropdown";
import {
  appointmentStatusAPI,
  appointmentDetailAPI,
  availableSlotsAPI,
  rescheduleAppointmentAPI,
  locationsAPI,
  getImage,
  GetDoctorAllInfoAPI
} from "../DB/API";
import Calender from "react-calendar";

const AppointmentsList = (props) => {
  const data = props.itemData;
  console.log("reschdule data is ",data);
  const loc_ID = props.loc_ID;
  const doc_ID = props.id;
  const pat_ID = props.pat_ID;
  const appointment_Time = data.date_time;
  const mytime = moment(appointment_Time);
  const Appointment_Time = mytime.format("hh:mm A");
  var years = moment().diff(data.patient.dob, "years");
  const [slots, setSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState(appointment_Time);
  const [date, setDate] = useState(new Date());
  const [showRescheduleModal, setRescheduleModal] = useState(false);
  const [locationDays, setLocationDays] = useState([]);
  const [Selected, setSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [docAppointmentType,setDocAppointmentType]=useState('');

  const [appointmentType,setAppointmentType] = useState({
    inperson : false,
    telehealth : false
  })
  const setAppointmentChecks = (val) =>{
    return {
      inperson : (val==='inperson' || val==='both'),
      telehealth : (val==='telehealth' || val==='both')
    }
  }
  const getAppointmentChecks = (val) =>{
    return {
      inperson : (val==='inperson')? !appointmentType.inperson:appointmentType.inperson,
      telehealth : (val==='telehealth')? !appointmentType.telehealth:appointmentType.telehealth
    }
  }
  
        
    
  console.log(
    "formate date is ",
    moment().format("ddd MMM YY yyyy ") +
      "12:34:29 GMT+0500 (Pakistan Standard Time)"
  );
  console.log("formate date is ", date);

  const onValueChange = (statusVal) => {
    if (statusVal == "upcoming") {
      return "Checked In";
    } else if (statusVal == "waiting") {
      return "Start";
    } else {
      return "Done";
    }
  };
  const [profileData, setProfileData] = useState(props.Data);
  const [status, setStatus] = useState(data.appointment_status);
  const [value, setValue] = useState(onValueChange(data.appointment_status));

  const onStatusChange = () => {
    if (value == "Checked In") {
      changeAppointmentStatusApi(data.appointment_id, "waiting");
      // console.log("Status API",result);
    } else if (value == "Start") {
      changeAppointmentStatusApi(data.appointment_id, "inprogress");
      // setStatus("inprogress");
    } else {
      changeAppointmentStatusApi(data.appointment_id, "upcoming");
      // setStatus("upcoming");
    }
  };

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const onChange = (date) => {
    setDate(date);
    availableSlots(data.doctors_hospital_location_id, date);
    console.log("my date ",date);
    //collectDisabledDays(data.appointment_location.days,0);
  };

  const handleModalClose = () => {
    setRescheduleModal(false);
  };

  const changeAppointmentStatusApi = (app_id, status) => {
    appointmentStatusAPI(doc_ID, loc_ID, pat_ID, app_id, "PUT", status).then(
      (result) => {
        setStatus(status);
        setValue(onValueChange(status));
        props.callback(status, data.appointment_id);
        console.log(
          "StatusAPI : ",
          result,
          "Status: ",
          status,
          "Value: ",
          value
        );
      }
    );
  };

  const [locationID, setLoactionID] = useState(
    data.doctors_hospital_location_id
  );

  const getLocDays = (value) => {
    for (var i = 0; i < locationData.length; i++) {
      if (locationData[i].location == value) {
        setLoactionID(locationData[i].doctors_hospital_location_id);
        return locationData[i].days;
      }
    }
    return [];
  };

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

  // const renderPatientProfile = () =>{
  //     return(
  //         profileData.map((item)=>( <PatientProfile pat_ID={pat_ID} loc_ID={loc_ID} id={doc_ID} itemData={item} />))
  //     )
  // }

  const handleReschedule = () => {
    setSelectedValue(data.appointment_location.appointment_location_of_doctor);
    setRescheduleModal(true);
    console.log("this is happening");
  };

  const handleConfirmReschedule = (appointment_id) => {
    console.log("location id : ",locationID,"appointment_id ",appointment_id, "time ", timeSlot, " patAppointmentType ",
    patAppointmentType);
    const mydate = moment(date);
    const newdate = mydate.format("YYYY-MM-DD");
    rescheduleAppointmentAPI(
      0,locationID,0,
      appointment_id,
      "PUT",
      newdate,
      timeSlot,
      patAppointmentType
    ).then((result) => {
      console.log("reschdule ", result);
      handleModalClose();
      props.callback(status, data.appointment_id);
      collectDisabledDays(data.appointment_location.days, 0);
    });
    console.log("this is happening", timeSlot, " date ", newdate);
  };

  const availableSlots = (location_id, date) => {
    const mydate = moment(date);
    const newdate = mydate.format("YYYY-MM-DD");
    availableSlotsAPI(doc_ID, location_id, "PUT", newdate).then((result) => {
      console.log("available", result);
      if(result[0])
      setSlots(result[0].time_slots);
    });
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

  const [locationData, setLocationData] = useState([]);
  const [selectValue, setSelectedValue] = useState();

  const handleChange1 = (e) => {
    setSelectedValue(e.target.value);
    console.log("days are ", e.target.days);
    collectDisabledDays(getLocDays(e.target.value));
  };

  useEffect(() => {
    GetDoctorAllInfoAPI(doc_ID).then((result) => {
      console.log("doctor info in Appointmentlist tab", result[0].appointment_type);
      if( result[0])
      setDocAppointmentType(result[0].appointment_type);
    });
    locationsAPI(doc_ID).then((result) => {
      console.log("location api results", result);
      setLocationData(result);
      setSelectedValue(
        data.appointment_location.appointment_location_of_doctor
      );
      collectDisabledDays(data.appointment_location.days);
    });
    getImage('patients',data.patient.patient_id)
        .then((json) => {setImage("data:image;charset=utf-8;base64,"+json.encodedData); console.log("my json is ", json);})
        .catch((error) => console.error(error))
        .finally(() => {
        });
  }, []);

  const renderItem = () => {
    console.log("locationData is ", locationData);
    return locationData.map((item, i) => (
      <option value={item.location} days={item.days}>
        {item.location}
      </option>
    ));
  };

  //     const Item1 = ({ item, onPress, style }) => (
  //     <TouchableOpacity onPress={onPress} style={[styles.item1, style]}>

  //       <Text style={{fontWeight:'bold'}}>{moment(moment(date).format('YYYY-MM-DD')+'T'+item.available_time_slot+'+00').format('LT')}</Text>

  //     </TouchableOpacity>
  //   );

  // const renderItem1 = ({ item }) => {
  //     const backgroundColor = (item) === timeSlot ? "#626567" : "#BDC3C7";
  //     return (
  //       <Item1
  //         item={item}
  //         onClick={() => setTimeSlot((item))}
  //         style={{ backgroundColor }}
  //       />
  //     );
  //   };

  const [patAppointmentType,setPatAppointmentType]=useState(data.appointment_type);
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
  return(<div>{patAppointmentType}</div>)
  }

  const renderModal = () => {
    return (
      <Modal
        show={showRescheduleModal}
        onHide={handleModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#e0004d" }}>Reschedule</Modal.Title>
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
            >
              <Avatar src={image} style={styles.avatar} />
              <span
                style={{
                  paddingLeft: 10,
                  flex: 1,
                  display: "flex",
                  fontWeight: "bold",
                  color: "#e0004d",
                  fontSize: 18,
                }}
              >
                {titleCase(data.patient.name)}
              </span>
              <span
                style={{
                  paddingLeft: 10,
                  flex: 1,
                  display: "flex",
                  fontWeight: "bold",
                  color: "#e0004d",
                  fontSize: 18,
                }}
              >
                Current Time: {Appointment_Time}
              </span>
            </div>
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
                      {renderItem()}
                    </select>
                  </div>
                </Row>
              </Container>
            </Col>
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
                    <label>Appointment Type: </label>{" "}
                  </div>
                  <div>
                    {renderAppointmentType(docAppointmentType)}
                  </div>
                </Row>
              </Container>
            </Col>
          </Row>
          <Row>
            <Col>
              {console.log("privious date is ", data.date_time)}
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
                value={new Date(data.date_time)}
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
            onClick={() => handleConfirmReschedule(data.appointment_id)}
            style={{ marginLeft: "10px" }}
          >
            Reschedule
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container fluid>
       <Timeline align="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary"  />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
        <Row style={styles.label}>
        <Card style={styles.cards}>
          <Card.Text
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              margin: 10,
            }}
            onClick={() => props.onClick()}
          >
            <Avatar src={image} style={styles.avatar} />
            <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
              <span
                style={{
                  paddingLeft: 10,
                  fontWeight: "bold",
                  color: "#e0004d",
                }}
              >
                {titleCase(data.patient.name)}
              </span>
              <span style={{ paddingLeft: 10, color: "black" }}>
                {" "}
                Age: {years} &nbsp; Gender: {titleCase(data.patient.gender)}
              </span>
              <span style={{ paddingLeft: 10 }}>
                Appointment Time: {Appointment_Time}
              </span>
            </div>
            <div>
              <span
                style={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#e0004d",
                  padding: "2px",
                  color: "#e0004d",
                }}
              >
                {data.appointment_status}
              </span>
            </div>
          </Card.Text>
          <footer style={{ display: "flex", flex: 1, flexDirection: "row" }}>
            <input
              style={styles.reschedule_btn}
              onClick={(e) => {
                handleReschedule();
                e.stopPropagation();
                availableSlots(data.doctors_hospital_location_id, date);
              }}
              class="btn btn-primary"
              type="button"
              value="Reschedule"
            ></input>
            {
              <input
                style={styles.checkIn_btn}
                onClick={(e) => {
                  onStatusChange();
                  e.stopPropagation();
                }}
                class="btn btn-primary"
                type="button"
                value={value}
              ></input>
            }
          </footer>
        </Card>
      </Row>
      </TimelineContent>
      </TimelineItem>
      </Timeline>
      {renderModal()}
    </Container>
  );
};

export default AppointmentsList;

const styles = {
  label: {
    fontSize: 13,
    color: "grey",
    textAlign: "Left",
    marginLeft: "10px",
    marginTop: "10px",
  },
  input: { fontSize: 14, padding: 8, borderRadius: "5px" },
  avatar: {
    height: "45px",
    width: "45px",
    borderWidth: 0.3,
    borderColor: "#e0004d",
    borderStyle: "solid",
    marginTop: 2,
  },
  reschedule_btn: {
    background: "#A1EBA2",
    color: "#096A0B ",
    height: "35px",
    borderRadius: "6px",
    border: "#91DB92",
    margin: "10px",
    marginLeft: "20px",
    width: "130px",
    textAlign: "center",
    fontSize:'14px'
  },
  checkIn_btn: {
    background: "#9EEAE8 ",
    color: "#096967",
    height: "35px",
    borderRadius: "6px",
    border: "#8EDAD8",
    marginLeft: "20px",
    margin: "10px",
    width: "130px",
    fontSize:'14px'
  },
  cards: {
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
};

AppointmentsList.defaultProps = {
  Data: [],
};
