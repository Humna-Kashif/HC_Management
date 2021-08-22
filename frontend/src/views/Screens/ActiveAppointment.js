import React, { useEffect, useState } from "react"
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import CurrentTabPatient from "../Components/CurrentTabPatient";
import HistoryTabPatient from "../Components/HistoryTabPatient";
import PatientProfileHeader from "../Components/PatientProfileHeader";
import VitalTabPatient from "../Components/VitalTabPatient";
import PatientProfile from '../Components/PatientProfile';
import {getVitalsAPI} from '../DB/API';

const ActiveAppointment = (props) => {

    function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
    }
    const doc_ID = props.id;
    const patientinfo = props.patientData.patientinfo;
    console.log("patient info is ",props.patientData);
    const appointmentType=props.patientData.appointment_type;
   // const doctorinfo = props.patientData.patientinfo;
    const patientName = titleCase(props.patientData.patientinfo.name);
    const patientStatus = props.appointment_status;
    const [tabKey, setTabKey] = useState("Current");
    const [vitalsData,setVitalsData] = useState([]);

    useEffect(() => {
        getVitalsAPI(props.patientData.patientinfo.patient_id,0,"GET").then(result => {
            console.log("vitals api results",result);
            setVitalsData(result);
        });
    },[]);

    const callBack = () => {
        getVitalsAPI(props.patientData.patientinfo.patient_id,0,"GET").then(result => {
            console.log("Back call results",result);
            setVitalsData(result);
        });
    }
    


    return (
        <div>
            <Container fluid style={{padding: 20}}>
                {/* Header */}
                
                        {/* <PatientProfileHeader info={patientinfo} status={patientStatus} /> */}
                   
                {/* Tabs */}
                <Row>
                    <Col>
                        <Tabs 
                            id="controlled-tab" 
                            activeKey={tabKey} 
                            onSelect={(k) => setTabKey(k)} 
                            style={{paddingLeft: 30, marginTop: 20, fontSize: 14}}
                            >
                            <Tab
                                eventKey="Current" 
                                title="Current">
                                    <CurrentTabPatient patientId={patientinfo.patient_id} appointment_type={appointmentType}/>
                            </Tab>
                            <Tab
                                eventKey="Vitals" 
                                title="Vitals">
                                    <VitalTabPatient id={props.patientData.appointment_id} info={patientinfo} vitals={vitalsData} backCall={callBack} />
                            </Tab>
                            <Tab
                                eventKey="History" 
                                title="History">
                                    {/* {`this is ${tabKey} of ${patientName}`} */}
                                    <HistoryTabPatient Data={props.patientData.patientinfo} id={doc_ID} />
                            </Tab>
                            <Tab
                                eventKey="Profile" 
                                title="Profile">
                                    {/* {`this is ${tabKey} of ${patientName}`} */}
                                    <PatientProfile itemData={props.patientData} />
                                    {console.log("THIS IS PROFILE DATA", props.patientData)}
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ActiveAppointment;

ActiveAppointment.defaultProps = {
    patientData: {
        patient_name : "default",
        image: ""
    }
};
 
const styles = {
};


// <Container fluid style={{backgroundColor: "lightblue"}}>
//     <Row style={{backgroundColor: "lightgoldenrodyellow"}}>
//         <Col style={{backgroundColor: "lightseagreen"}}>
//             col 1
//         </Col>
//         <Col style={{backgroundColor: "lightskyblue"}}>
//             col 2
//         </Col>
//     </Row>
// </Container>