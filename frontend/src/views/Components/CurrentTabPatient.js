import React, { useState, } from "react";
import { Col, Container, Tab, Tabs, Modal, Row, Button } from 'react-bootstrap'
import InputDropDown from "./InputWithDropDown/InputDropDown";
import Calender from "react-calendar";
import { Avatar } from "@material-ui/core";
import moment from "moment";
import Tags from "./Tags/Tags";
import TagItem from "./Tags/TagItem";
import TestsList from "./TestsList/TestsList";

import {
  getPatientAppoinmtmentByStatusAPI,
  searchSymptomAPI,
  searchTestAPI,
  searchMedicinesAPI,
  addSymptomInAppointmentAPI,
  deleteSymptomAPI,
  addTestAPI,
  addPrescriptionAPI,
  addDiagnosisAPI,
  availableSlotsAPI,
  searchDiagnosisAPI,
  deleteDiagnosisAPI,
  addDoctorNotesAPI,
  locationsAPI,
  scheduleFollowupAPI,
  deleteTestAPI,
  deletePrescriptionAPI,
  GetDoctorAllInfoAPI
} from "../DB/API";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CurrentTabPatient = (props) => {
    const patientId = props.patientId;
    const doctorId = useLocation().state.userId;
    const [appointment_ID,setAppointment_ID]=useState(0);
    const [symptomsList,setSymptomsList] = useState([]);
    const [suggestList, setSuggestionList] =useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [diagnosisList,setDiagnosisList] = useState([]);
    const [suggestDiagnosisList, setSuggestionDiagnosisList] =useState([]);
    const [testsList,setTestsList] = useState([]);
    const [suggestTestList, setSuggestionTestList] =useState([]);
    const [prescriptionsList,setPrescriptionsList] = useState([]);
    const [suggestPrescriptionList, setSuggestionPrescriptionList] =useState([]);
    const [slots, setSlots] = useState([]);
    const [timeSlot, setTimeSlot] = useState();
    const [date, setDate] = useState(new Date());
    const [showRescheduleModal, setRescheduleModal] = useState(false);
    const [locationDays, setLocationDays] = useState([]);
    const [appointmentType,setAppointmentType] = useState({
      inperson : false,
      telehealth : false
    })
    const [docAppointmentType,setDocAppointmentType]=useState('');
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
    // const [currentTestData, setCurrentTestData] = useState([]);

    useEffect(()=> {
        // console.log("current Tab Data:", patientId, doctorId)
        getPatientAppoinmtmentByStatusAPI(doctorId,0,patientId,0,"inprogress","GET").then(result => {
            console.log("Data Back from API:", result);
            if(result[0])
            setCurrentData(result[0]);
            setAppointment_ID(result[0].appointment_id)
            !!result[0].appointment_data.symtoms && setSymptomsTagFromAPI(result[0].appointment_data.symtoms);
            !!result[0].appointment_data.tests && setTestsTagFromAPI(result[0].appointment_data.tests);
            !!result[0].appointment_data.prescription && setPrescriptionsTagFromAPI(result[0].appointment_data.prescription);
            !!result[0].appointment_data.diagnosis && setDiagnosisTagFromAPI(result[0].appointment_data.diagnosis);
            setSelectedValue(result[0].doctorinfo.appointment_location.appointment_location_of_doctor);
            setNoteVal(result[0].doctors_note);
        })

        GetDoctorAllInfoAPI(doctorId).then((result) => {
          console.log("doctor info in current tab", result);
          if(result[0])
          setDocAppointmentType(result[0].appointment_type);
        });

    },[])

    const handleAddSymptoms = (value) => {
            addSymptomInAppointmentAPI(0,0,0,appointment_ID,"POST",value).then(result => {
                console.log("Success", result);
            });     
        }

    
    const setSymptomsTagFromAPI = (sList) => {
        console.log("Back SymptomList: ", sList)
        setSymptomsList(sList)
    }

    const SymptomsInputCallback = (value) =>{
        console.log("values is ",suggestList[0].name);
        let regex = /^\s+$/;
        if(!value.match(regex) && value !== ""){
            let newList = symptomsList.slice(0);
            newList.push({name:value})
            setSymptomsList(newList);
            // console.log("Adding values is ",newList);
            handleAddSymptoms(suggestList[0].name)
        }
    }

    const SymptomsTagCallback = (list) => {
        setSymptomsList(list);
        console.log("Change Values is : ", list);
    }

    const SymptomsSearch = (value) => {
        console.log("parent search:", value)
        searchSymptomAPI(0,0,0,value).then(result => {
            console.log("Search result: ",result);
            setSuggestionList(result);
        })
    }

    const deleteSymptoms = (value) =>{
        // console.log("Change Values is : ", value,"  ",appointment_ID);
        deleteSymptomAPI(0,0,0,appointment_ID,"DELETE",value).then(result => {
            console.log("Delete result: ",result);
        })
    }

      //Diagnosis

    const handleAddDiagnosis = (value) => {
        addDiagnosisAPI(0,0,0,appointment_ID,"POST",value).then(result => {
            console.log("Success", result);
        });     
    }

    const setDiagnosisTagFromAPI = (sList) => {
        console.log("Back SymptomList: ", sList)
        setDiagnosisList(sList)
    }
    
    const diagnosisInputCallback = (value) =>{
        console.log("Change Values is : ", value);
        handleAddDiagnosis(value);
        let regex = /^\s+$/;
        if(!value.match(regex) && value !== ""){
            let newList = diagnosisList.slice(0);
            newList.push({name: value})
            setDiagnosisList(newList);
          }
    }

    const diagnosisTagCallback = (list) => {
        setDiagnosisList(list)
    }

    const DiagnosisSearch = (value) => {
        console.log("parent search:", value)
        searchDiagnosisAPI(0,0,0,value).then(result => {
            console.log("Search result: ",result);
            setSuggestionDiagnosisList(result);
        })
    }

    const deleteDiagnosis = (value) => {
        // console.log("Change Values is : ", value,"  ",appointment_ID);
        deleteDiagnosisAPI(0,0,0,appointment_ID,"DELETE",value).then(result => {
            console.log("Delete result: ",result);
        })
    }


    //Tests

    const setTestsTagFromAPI = (sList) => {
        console.log("Back TestList: ", sList)
        setTestsList(sList)
    }

  const handleAddTests = (value) => {
    // let regex = /^\s+$/;
    // if (!value.match(regex) && value !== "") {
    //   let newList = testsList.slice(0);
    //   newList.push({ name: value });
    //   setTestsList(newList);
      
    // }

    addTestAPI(doctorId, 0, patientId, appointment_ID, "POST", value).then((result) => {
      console.log("Success", result);
      let tempList = []
      result.map((item) => tempList.push(item));
      console.log("Back TestList temp", tempList)
      setTestsTagFromAPI(tempList)
    });
  };

  const deleteTests = (value) => {
    console.log("Change Values is : ", value,"  ",appointment_ID);
    deleteTestAPI(doctorId,0,patientId,appointment_ID,"DELETE",value).then(result => {
        console.log("Delete result: ",result);
    })
}

  const  TestsInputCallback = (value) => {
    console.log("values selected test is ", value);
    handleAddTests(value);
    // let regex = /^\s+$/;
    // if (!value.match(regex) && value !== "") {
    //   let newList = testsList.slice(0);
    //   newList.push({ name: value });
    //   setTestsList(newList);
    // }
  };

  const TestsTagCallback = (list) => {
    setTestsList(list);
    console.log("Change Values is : ", list);
  };

  const TestsSearch = (value) => {
    // console.log("parent search:", value)
    searchTestAPI(0, 0, 0, value).then((result) => {
      // console.log("Search test result: ",result);
      setSuggestionTestList(result);
    });
  };
  

  const PrescriptionsTagCallback = (list) => {
    setPrescriptionsList(list);
  };

    //Doctor Notes

    const [noteVal,setNoteVal] = useState ("");
    const [EditingElement, setEditingElement] = useState("");

    const handleAddNotes = (value) => {
        console.log("back handle note add", value, appointment_ID)
        addDoctorNotesAPI(0,0,0,appointment_ID,"PUT",value).then(result => {
            console.log("Success", result);
        });     
    } 


    //Prescriptions

    const setPrescriptionsTagFromAPI = (sList) => {
        console.log("Back TestList: ", sList)
        setPrescriptionsList(sList)
    }

    const [editPrescriptionVisible, setEditPrescriptionVisible] = useState(false)
    const [selectedPrescription, setSelectedPrescription] = useState('sample');
    const [presIntake,setPresIntake] = useState('');
    const [presDuration,setpresDuration] = useState('');
    const [mealRadio,setMealRadio] = useState('');
    const [presDosage,setPreDosage] = useState({
        morning: false,
        afternoon: false,
        evening: false,
        night: false
    })

    const formatDosage = () => {
      return `${presDosage.morning ? presIntake+' Morning ' : ''}  ${presDosage.afternoon ? presIntake+' Afternoon ': ''} ${presDosage.evening ? presIntake+' Evening ':''} ${presDosage.night ? presIntake+' Night ':''} 
      (${mealRadio})`
    }

    const handleAddPrescription = (value) => {
        let dosageString = formatDosage();
        console.log("Dosage String",dosageString," value ", value, "presDuraion-days", presDuration,"Intake ",presIntake);
        let x = parseInt(presDuration)*Number(presIntake)
        console.log("Methamaticle vlaue is ", parseInt(presDuration),"orignal vlaue is ", presDuration, "result is :", x);
        addPrescription(value,presDuration,x,dosageString);
        // let regex = /^\s+$/;
        // if(!value.match(regex) && value !== ""){
        //     let newList = prescriptionsList.slice(0);
        //     newList.push({name: value, frequency: dosageString, days: presDuration})
            
        // }
    }
  
    const renderEditNewPrescription = () => {
          return editPrescriptionVisible && (
              <div style={{display: "flex", flex: 1 , flexDirection: "column", paddingTop: 10, paddingBottom: 10,
              margin:10, borderColor: "#e0e0e0", borderStyle: "solid", borderTopWidth: 0.6, borderBottomWidth: 0.6, borderLeftWidth: 0, borderRightWidth: 0}}>
                  <Container fluid>
                      <Row style={{alignItems: "baseline"}}>
                          <Col lg={3}>
                              <div style={styles.edit_label}>Medicine:</div>
                          </Col>
                          <Col>
                              <div>{selectedPrescription}</div>
                          </Col>
                        </Row>
                        <Row style={{alignItems: "baseline", marginTop: 5}}>
                          <Col lg={3}>
                              <div style={styles.edit_label}>In-take:</div>
                          </Col>
                          <Col>
                              <input
                                  style={{width: 200, padding: 0, fontSize:8, ...styles.input}}
                                  placeholder={`Quantity per take...`}
                                  type="text"
                                  value={presIntake}
                                  noValidate
                                  onChange={e => {setPresIntake(e.target.value)}}
                                  />
                          </Col>
                      </Row>
                        
                      <Row>
                          <Col>
                            <div style={styles.edit_label}>Dosages:</div>
                          </Col>
                      </Row>
                      <Row>
                          <Col>
                          <div onChange={(e) => {
                              let sampleDos = {...presDosage};
                              sampleDos[e.target.value] = !presDosage[e.target.value];
                              setPreDosage(sampleDos); 
                              console.log("dosage object", presDosage, "sample", sampleDos)}}>
                            <input
                                    style={{ width: 20 }}
                                    type="checkbox"
                                    value="morning"
                                    name="Dosage"
                                    checked={presDosage.morning}/><span style={{paddingRight: 20}}>Morning</span>
                            <input
                                    style={{ width: 20 }}
                                    type="checkbox"
                                    value="afternoon"
                                    name="Dosage"
                                    checked={presDosage.afternoon}/><span style={{paddingRight: 20}}>Afternoon</span>
                            <input
                                    style={{ width: 20 }}
                                    type="checkbox"
                                    value="evening"
                                    name="Dosage"
                                    checked={presDosage.evening}/><span style={{paddingRight: 20}}>Evening</span>
                            <input
                                    style={{ width: 20 }}
                                    type="checkbox"
                                    value="night"
                                    name="Dosage"
                                    checked={presDosage.night}/><span style={{paddingRight: 20}}>Night</span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                          <Col>
                          <div onChange={(e) => setMealRadio(e.target.value)}>
                            <input
                                    style={{ width: 20 }}
                                    type="radio"
                                    value="Before Meal"
                                    name="Meal"
                                    checked={mealRadio === "Before Meal"}/><span style={{paddingRight: 50}}>Before Meal</span>
                            <input
                                    style={{ width: 20 }}
                                    type="radio"
                                    value="After Meal"
                                    name="Meal"
                                    checked={mealRadio === "After Meal"}/>After Meal
                          </div>
                        </Col>
                      </Row>
                      <Row style={{alignItems: "baseline", marginTop: 5}}>
                          <Col lg={3}>
                              <div style={styles.edit_label}>Duration (days):</div>
                          </Col>
                          <Col>
                              <input
                                  style={{width: 200, padding: 0, fontSize:8, ...styles.input}}
                                  placeholder={`No. of days...`}
                                  type="text"
                                  value={presDuration}
                                  noValidate
                                  onChange={e => {setpresDuration(e.target.value)}}
                                  />
                          </Col>
                      </Row>
                      <Row>
                          <Col lg={12} style={{textAlign: "center", marginTop: 20}}>
                              <Button
                                  onClick = {() => {setEditPrescriptionVisible(false);
                                          handleAddPrescription(selectedPrescription);
                                  }}
                                  size="sm"
                                  variant="primary"
                                  style={{
                                  marginRight: 5,
                                  width: 200,
                                  backgroundColor: "#e0004d",
                                  borderColor: "#e0004d",
                                  }}
                              >
                                  Add to Prescription List
                              </Button>
                          </Col>
                      </Row>
                  </Container>
              </div>
          )
    }
  
    
    const PrescriptionsInputCallback = (value) =>{
        console.log("values selected prescription is ", value);
        setSelectedPrescription(value)
        setEditPrescriptionVisible(true)
        // let regex = /^\s+$/;
        // if(!value.match(regex) && value !== ""){
        //     let newList = prescriptionsList.slice(0);
        //     newList.push({name: value})
        //     setPrescriptionsList(newList);
        // }
    }

    const PrescriptionsSearch = (value) => {
        console.log("parent search:", value)
        searchMedicinesAPI(0,0,0,value).then(result => {
            console.log("Search medicines results: ",result);
            setSuggestionPrescriptionList(result)
        })
    }

    const addPrescription = (medicine_name,days,quantityTab,frequencies) => {
      addPrescriptionAPI(0,0,0,appointment_ID,"POST",medicine_name,days,quantityTab,frequencies).then(result => {
        console.log("Add medicine results results: ",result);
        setPrescriptionsList(result);
      })
    }

    const handlePrescription = (val) => {
      console.log("tag call back val: ", val)
      deletePrescription(val);
      let newList = prescriptionsList.slice(0);
      console.log("OldList:", prescriptionsList, "Newlist: ", newList);
      newList.filter((c,i,a) => {
          if(c.name === val){
              newList.splice(i, 1);
          }
      });
      console.log("OldList:", prescriptionsList, "Newlist: prescriptionsList deleted ", newList);
      setPrescriptionsList(newList)
      
  }

  const deletePrescription = (val) =>{
    deletePrescriptionAPI(0,0,0,appointment_ID,"DELETE",val).then(result => {
      console.log("Add medicine results results: ",result);
      // setPrescriptionsList(result);
    })
  }

    const renderAddedPrescriptions = () => {
        return (
            prescriptionsList.map((item,i) => (
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: 5, paddingBottom: 5, alignItems: "baseline"}}>
                    <div style={{display: "flex", flex: 3, flexWrap: "wrap", color: "#e0004d", fontSize: 18}}> {item.name} </div>
                    <div style={{display: "flex", flex: 1, flexWrap: "wrap"}}> {item.frequency} </div>
                    <div style={{display: "flex", flex: 1, flexWrap: "wrap",marginLeft:15}}> {item.days} days </div>
                    <div style={{ width:100, backgroundColor: "goldenrod", color: "white", textAlign: "center", borderRadius:50, marginRight: 20, marginLeft: 20 }}> {item.quantity} tab </div>
                    <div style={{color: "#e0004d", fontWeight: "bold", padding: 6, margin: 2, cursor: "pointer"}}> Price {item.price} </div>
                    <div style={{color: "#e0004d", fontWeight: "bold", padding: 6, margin: 2, cursor: "pointer"}} onClick={() => handlePrescription(item.name)}> x </div>
                </div>
            ))
        )
    }

    //FollowUp Appointment

    const handleNewAppointmentModal = () => {
      setRescheduleModal(true);      
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
  
    const handleChange1 = (e) => {
      setSelectedValue(e.target.value);
      collectDisabledDays(getLocDays(e.target.value));
    };
  
    const availableSlots = (location_id, date) => {
      const mydate = moment(date);
      const newdate = mydate.format("YYYY-MM-DD");
      availableSlotsAPI(doctorId,location_id, "PUT", newdate).then((result) => {
        console.log("available", result);
        if(result[0])
        setSlots(result[0].time_slots);
      });
    };
  
    const onChange = (date) => {
      setDate(date);
      availableSlots(2, date);
      collectDisabledDays(currentData.doctorinfo.appointment_location.days,0);
    };

    const renderItem = () => {
      console.log("locationData is ", locationData);
      return locationData.map((item, i) => (
        <option value={item.location} days={item.days}>
          {item.location}
        </option>
      ));
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

    const handleConfirmReschedule = (appointment_ID) => {
      console.log(
        "appointment ID ",
        appointment_ID,
        "location id : ",
        locationID,
        "time ",
        timeSlot
      );
      const mydate = moment(date);
      const newdate = mydate.format("YYYY-MM-DD");
      scheduleFollowupAPI(0,locationID,0,appointment_ID,"POST",newdate,timeSlot,patAppointmentType
      ).then((result) => {
        console.log("followup ", result);
        // props.callback(status, data.appointment_id);
        handleModalClose();
        collectDisabledDays(currentData.doctorinfo.appointment_location.days, 0);
      });
      console.log("this is happening", timeSlot, " date ", newdate);
    };

    const [patAppointmentType,setPatAppointmentType]=useState(currentData.appointment_type);
    const AppointmentTypeRadioButton = ({ value }) => {
      return (
        <input
          style={{ width: 20 }}
          type="radio"
          value={value}
          name="gender"
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
    return(
      <div>{currentData.appointment_type}</div>)
    }
  
    const schduleFollowUpModal = () =>{
      return(
        <Modal
        show={showRescheduleModal}
        onHide={handleModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#e0004d" }}>Followup Appointment</Modal.Title>
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
                      {renderItem()}
                    </select>
                  </div>
                </Row>
              </Container>
            </Col>
          </Row>
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
                        // date.getFullYear() === disabledDate.getFullYear() &&
                        // date.getMonth() === disabledDate.getMonth() &&
                      date.getDay() === disabledDay
                  )
                }
                onChange={onChange}
                value={new Date()}
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
            onClick={() => handleConfirmReschedule(currentData.appointment_id)}
            style={{ marginLeft: "10px" }}
          >
            Schedule Followup
          </Button>
        </Modal.Footer>
      </Modal>
      )
    } 

    const handleModalClose = () => {
      setRescheduleModal(false);
  }

  const renderLocations= () => {
    locationsAPI(doctorId).then((result) => {
      console.log("location api results", result);
      setLocationData(result);
      // setSelectedValue(currentData.doctorinfo.appointment_location.hospital_id);
      collectDisabledDays(currentData.doctorinfo.appointment_location.days);
    });
  }


  return (
    <Container fluid style={{ marginTop: 10 }}>
      <Row>
        <Col style={{ textAlign: "right" }}>
          <Button
            onClick={()=>{handleNewAppointmentModal();availableSlots(1, date);renderLocations()}}
            size="md"
            variant="primary"
            style={{
              marginRight: 5,
              width: 200,
              backgroundColor: "#e0004d",
              borderColor: "#e0004d",
            }}
          >
            Schedule Followup
          </Button>
        </Col>
      </Row>
      <Row>
        {/* Left Column */}
        <Col lg={5}>
          <div style={{ textAlign: "left", padding: 5 }}>
            <div style={{ fontWeight: "bold", color: "#e0004d" }}>Symptoms</div>
            <InputDropDown
              onValueSelected={SymptomsInputCallback}
              title="Symptoms"
              suggestList={suggestList}
              onValueChange={SymptomsSearch}
            />
            {/* <div style={{ fontSize: 12 }}>Symptoms List:</div> */}
            {
                !!symptomsList &&
                <Tags
                tagsList={symptomsList}
                key={symptomsList.length}
                parentList={SymptomsTagCallback}
                delete={deleteSymptoms}
                />
            }
          </div>
          <div style={{ textAlign: "left", padding: 5 }}>
            <div style={{ fontWeight: "bold", color: "#e0004d" }}>
              Diagnosis
            </div>
            <InputDropDown
              onValueSelected={diagnosisInputCallback}
              title="Diagnosis"
              suggestList={suggestDiagnosisList}
              onValueChange={DiagnosisSearch}
            />
            <div style={{ fontSize: 12 }}>Diagnosis List:</div>
            {
                !!diagnosisList &&
                <Tags
                tagsList={diagnosisList}
                key={diagnosisList.length}
                parentList={diagnosisTagCallback}
                delete={deleteDiagnosis}
                />
            }
          </div>
          <div style={{ textAlign: "left", padding: 5 }}>
            <div style={{ fontWeight: "bold", color: "#e0004d" }}>
              Doctor's Note
            </div>
            <textarea
              style={styles.text_area}
              placeholder="Enter Doctor Note ..."
              type="text"
              value={noteVal}
              noValidate
              rows={3}
              onChange={(e) => {
                setNoteVal(e.target.value);
              }}
              onBlur={(e) => {
                handleAddNotes(noteVal);
                console.log("Triggered because this input lost focus", noteVal);
              }}
            />
          </div>
          <div style={{ textAlign: "left", padding: 5 }}>
            <div style={{ fontWeight: "bold", color: "#e0004d" }}>Tests</div>
            <InputDropDown
              onValueSelected={TestsInputCallback}
              title="Test"
              suggestList={suggestTestList}
              onValueChange={TestsSearch}
            />
            <div style={{ fontSize: 12 }}>Test List:</div>
            { !!testsList &&
            <TestsList
              testsList={testsList}
              key={testsList.length}
              parentList={TestsTagCallback}
              delete={deleteTests}
            />
            }
          </div>  
          </Col> 
          <Col>    
          <div style={{ textAlign: "left", padding: 5 }}>
            <div style={{ fontWeight: "bold", color: "#e0004d" }}>
              Prescrptions
            </div>
            <InputDropDown
              onValueSelected={PrescriptionsInputCallback}
              title="Prescription"
              suggestList={suggestPrescriptionList}
              onValueChange={PrescriptionsSearch}
            />
            {renderEditNewPrescription()}
            <div style={{ fontSize: 12 }}>Prescription List:</div>
            {!!prescriptionsList &&
            renderAddedPrescriptions()}
          </div>
        </Col>
        
    
        {schduleFollowUpModal()}
      </Row>
    </Container>
  );
}

export default CurrentTabPatient;

CurrentTabPatient.defaultProps = {
  appointmentData: [],
  patientId: 0,
};

const styles = {
  input: { fontSize: 14, padding: 8, borderRadius: "5px" },
  edit_label: {fontSize: 14, opacity: 0.6},
  text_area: {
    fontSize: 14,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: "5px",
    outline: "none",
    border: "1px solid #cfcfcf",
    // boxShadow: "0px 5px 25px whitesmoke",
    backgroundColor: "whitesmoke",
    width: "100%",
  },
};
