import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Container,
  Tab,
  Tabs,
  Button,
  Modal,
  ModalBody,
} from "react-bootstrap";
import PatientList from "../Components/PatientList";
import PatientDash from "../Components/PatientDash";
import PatientProfileHeader from "../Components/PatientProfileHeader";
import { useLocation } from "react-router-dom";
import { getAllPatientsOfDoctorByName,getImage } from "../DB/API";
import PatientTabItem from "../Components/PatientTabItem";
import PatientTabDetail from "../Components/PatientTabDetail";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlusCircle } from "react-icons/fa";
import "../Styles/NewPatientModal.scss";

const DoctorPatientsTab = (props) => {
  const doc_ID = useLocation().state.userId;
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [input, setInput] = useState("");
  const [newPatient, setNewPatient] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
  });
  const [startDate, setStartDate] = useState();
  const [showAddPatientModal, setAddPatientModal] = useState(false);
  const [isaccess, setIsAccess] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Input: ", input);
      setInput("");
    }
  };

  const getPatientFromAPI = (input) => {
    getAllPatientsOfDoctorByName(doc_ID, 0, 0,input, "GET").then((result) => {
      let filteredList = filterPatientsList(input,result)
      setIsAccess(result[0].is_access)
      console.log("filtered list is : ",result[0].is_access)
      setPatientsList(filteredList);
      if(filteredList.length !== 0){
        setSelectedPatient(filteredList[0].patientinfo);
      }else{
        setSelectedPatient(0)
      }
    });
  }
  useEffect(() => {
    getPatientFromAPI(input);
  }, []);

  const filterPatientsList = (input,resultList) => {
    console.log("Recieved Data", resultList)
    let filteredList = [];
    let regex =  new RegExp(input,'i');
    if(resultList !== []){
      resultList.map((item)=> {
        if(!!item.patientinfo){
          console.log("Recieved Data patient", item);
          (!!item.patientinfo.name.match(regex) || !!item.patientinfo.contact_no.match(regex)) && filteredList.push(item)
        }
      })
    }
    
    console.log("Patient Tab search filtered", filteredList);
    return filteredList;
  }

  const handleSelectPatient = (info) => {
    console.log("clicked", info);
    setSelectedPatient(info);

  };

  const renderPatientsList = () => {
    // console.log("Clicked list is : ",patientsList)
    return patientsList.map((item, i) => (
      <PatientTabItem
        info={item.patientinfo}
        access={item.is_access}
        handleAccess={setIsAccess}
        handleItem={handleSelectPatient}
        selected={item.patientinfo.patient_id === selectedPatient.patient_id}
      />
    ));
  };

  const formatDate = (date) => {
    const formattedDate =
      date.getFullYear().toString() +
      "/" +
      (date.getMonth() + 1).toString() +
      "/" +
      date.getDate().toString();
    console.log("New date:", formattedDate);
    setNewPatient({ ...newPatient, dob: formattedDate });
  };

  const handleAddPatient = (newPatient) => {
    setAddPatientModal(true);
  };

  const handleModalClose = () => {
    setAddPatientModal(false);
  };

  const handleConfirmNewPatient = (newPatient) => {
    console.log("New Patient: ", newPatient);

    handleModalClose();
  };

  const renderModal = () => {
    return (
      <Modal
        show={showAddPatientModal}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#e0004d" }}>
            Add New Patient
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className={"modal-input"}>
            <Col lg={{ span: 2, offset: 1 }} className={"modal-label"}>
              Name:
            </Col>
            <Col lg={8} className={"modal-input__value"}>
              <input
                className={"modal-input__field"}
                placeholder="Enter Patient Name..."
                type="text"
                onChange={(e) => {
                  setNewPatient({ ...newPatient, name: e.target.value });
                  console.log("changes", newPatient, e.target.value);
                }}
                // Make sure  to validate
              />
            </Col>
          </Row>

          <Row className={"modal-input"}>
            <Col lg={{ span: 2, offset: 1 }} className={"modal-label"}>
              Date of Birth:
            </Col>
            <Col lg={8} className={"modal-input__value"}>
              <DatePicker
                className={"modal-input__field"}
                selected={startDate}
                placeholderText={"MM/DD/YYYY"}
                onChange={(date) => {
                  setStartDate(date);
                  formatDate(date);
                }}
              />
            </Col>
          </Row>

          <Row className={"modal-input"}>
            <Col lg={{ span: 2, offset: 1 }} className={"modal-label"}>
              Gender:
            </Col>
            <Col lg={8} className={"modal-input__value"}>
              <div
                onChange={(e) =>
                  setNewPatient({ ...newPatient, gender: e.target.value })
                }
                className={"modal-input__field"}
              >
                <input
                  style={{ width: 20 }}
                  type="radio"
                  value={"Male"}
                  name="gender"
                  checked={newPatient.gender === "Male"}
                />{" "}
                <span>Male</span>
                <input
                  style={{ width: 20 }}
                  type="radio"
                  value={"Female"}
                  name="gender"
                  checked={newPatient.gender === "Female"}
                />{" "}
                Female
                <input
                  style={{ width: 20 }}
                  type="radio"
                  value={"Other"}
                  name="gender"
                  checked={newPatient.gender === "Other"}
                />{" "}
                Other
              </div>
            </Col>
          </Row>

          <Row className={"modal-input"}>
            <Col lg={{ span: 2, offset: 1 }} className={"modal-label"}>
              Phone Number:
            </Col>
            <Col lg={8} className={"modal-input__value"}>
              <input
                className={"modal-input__field"}
                placeholder="03001234567"
                type="text"
                onChange={(e) => {
                  setNewPatient({ ...newPatient, phone: e.target.value });
                  console.log("changes", newPatient, e.target.value);
                }}
                // Make sure  to validate
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleConfirmNewPatient(newPatient)}
            style={{ marginLeft: "10px" }}
          >
            Add New Patient
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }; 

  

  const renderDetail = () =>{
    return(
    selectedPatient !== 0 ? (
      <PatientTabDetail
        patientInfo={selectedPatient}
        key={selectedPatient.patient_id}
      />
    ) : (
      <div style={{ color: "#e0e0e0", fontSize: 50, padding: 100 }}>
        Select Patient From The List For Details.
      </div>
    )
    )
  }

  return (
    <div style={{ width: "100%", paddingTop: 0 }}>
      <Container fluid style={{ minheight: "90vh", position: "relative" }}>
        <Row style={{ position: "relative", margin: 0, padding: 0 }}>
          <Col lg={2}
            style={{
              height: "90vh",
              overflowY: "auto",
              position: "sticky",
              top: 65,
              margin: 0,
              padding: 0,
              backgroundColor: "white",
              borderRadius: 10,
              borderStyle: "solid",
              borderColor: "#e0e0e0",
              borderWidth: 0.6,
            }}
          >
            {/* You need to display a list here */}
            <div
              style={{
                position: "sticky",
                zIndex: 10,
                backgroundColor: "white",
                top: 0,
                padding: 15,
                paddingTop: 10,
                paddingBottom: 10,
                borderBottomColor: "#e0e0e0",
                borderBottomWidth: 0.6,
                borderBottomStyle: "solid",
              }}
            >
              <div
                className={"add-new-patient"}
                onClick={() => handleAddPatient()}
              >
                <FaPlusCircle
                  size={15}
                  className={"add-new-patient__icon"}
                ></FaPlusCircle>
                <span className={"add-new-patient__label"}>
                  Add New Patient
                </span>
              </div>
              <input
                style={styles.input}
                placeholder={`Search by Name or Contact ...`}
                type="text"
                value={input}
                onKeyDown={handleKeyDown}
                noValidate
                onChange={(e) => {
                  setInput(e.target.value);
                  getPatientFromAPI(e.target.value);
                }}
              />
            </div>
            <div
              style={{
                borderBottomColor: "#e0e0e0",
                borderBottomWidth: 0.6,
                borderBottomStyle: "solid",
              }}
            >
              {renderPatientsList()}
              {/* {renderPatientsList()}
              {renderPatientsList()}
              {renderPatientsList()}
              {renderPatientsList()}
              {renderPatientsList()} */}
            </div>
            {/* <div style={{backgroundColor: "lightgrey", margin: 5, height: 100}}>item</div> */}
          </Col>
          <Col lg={10}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                borderStyle: "solid",
                borderColor: "#e0e0e0",
                borderWidth: 0.6,
                marginLeft: 10,
                minHeight: 300,
              }}
            >
            {/* / */}
            { isaccess!==false ? renderDetail() : (
              <div>
                <div style={{ color: "#e0e0e0", fontSize: 50, padding: 100 }}>
                  You dont have access to this Patient
                </div>
                <div style={{ backgroundColor: "#e0e0e0",padding: 10}}>
                  <Button style={{backgroundColor:"e0004d"}}>Request Access</Button>
                </div>
              </div>
            )}
            </div>
          </Col>
        </Row>
        {renderModal()}
      </Container>
    </div>
  );
};

export default DoctorPatientsTab;

const styles = {
  input: { fontSize: 14, padding: 8, borderRadius: "5px", boxShadow: "none" },
};
