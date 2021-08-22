import { Avatar } from '@material-ui/core'
import React, { useEffect, useState} from 'react'
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
import '../Styles/Patient.css'

const PatientDash = () =>{
    return(
        <Container>
        <div className="mainbody">
            <Row className="detail_head">   
                <div className="detail_head__topsection">
                    <div className="detail_head__name" >
                        <Avatar className="patient_image"/>  
                        <h5 className="patient_name">Jack Mark</h5>
                        {/* <Button className="appointment_btn">Schedule Appoitment</Button> */}
                        <div className="appointment_b">
                        <button className="appointment_btn">Schedule Appoitment</button>
                        </div>
                    </div>
                </div>
                <div className="detail_head__whitesection">
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                        <Tab eventKey="Profile" title="Profile">
                            <div>
                                <h1>Profile</h1>
                            </div>
                        </Tab>
                        <Tab eventKey="History" title="History">
                            <h1>History</h1>
                        </Tab>
                        <Tab eventKey="Vitals" title="Vitals">
                        <h1>Vitals</h1>
                        </Tab>
                        <Tab eventKey="Documents" title="Documents">
                        <h1>Vitals</h1>
                        </Tab>
                    </Tabs>
                </div>  
            </Row>
            {/* <div>
                 {renderlocItem()}
            </div> */}
            {/* <History/> */}
            {/* <HistoryProfile/> */}
            
        </div>
        </Container>
    )

}
export default PatientDash