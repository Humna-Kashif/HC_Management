import React, { useEffect, useState } from "react"
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import CurrentTabPatient from "../Components/CurrentTabPatient";
import HistoryTabPatient from "../Components/HistoryTabPatient";
import PatientProfileHeader from "../Components/PatientProfileHeader";
import VitalTabPatient from "../Components/VitalTabPatient";
import PatientProfile from '../Components/PatientProfile';
import {getVitalsAPI} from '../DB/API';
import { useLocation } from "react-router-dom";

const PatientTabDetail = (props) => {

    function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
    }

    const doc_ID = useLocation().state.userId;
    const patientInfo = props.patientInfo;
    const patientStatus = props.appointment_status;
    const [tabKey, setTabKey] = useState("History");
    const [vitalsData,setVitalsData] = useState([]);

    useEffect(() => {
        getVitalsAPI(patientInfo.patient_id,0,"GET").then(result => {
            console.log("vitals api results",result);
            setVitalsData(result);
        });
    },[]);

    const callBack = () => {
        getVitalsAPI(patientInfo.patient_id,0,"GET").then(result => {
            console.log("Back call results",result);
            setVitalsData(result);
        });
    }


    return (
        <div>
            <Container fluid style={{padding: 20}}>
                {/* Header */}
                 <PatientProfileHeader info={patientInfo}/>
                    
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
                                eventKey="History" 
                                title="History">
                                    <HistoryTabPatient Data={patientInfo} id={doc_ID} />
                            </Tab>
                            <Tab
                                eventKey="Vitals" 
                                title="Vitals">
                                    <VitalTabPatient info={patientInfo} vitals={vitalsData} backCall={callBack} />
                            </Tab>
                            {/* <Tab
                                eventKey="Profile" 
                                title="Profile">
                                    <PatientProfile itemData={patientInfo} />
                            </Tab> */}
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default PatientTabDetail;

PatientTabDetail.defaultProps = {
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