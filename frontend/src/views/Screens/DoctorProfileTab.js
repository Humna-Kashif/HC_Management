import React, { useEffect, useState} from 'react'
import { Col, Container } from 'react-bootstrap'
import AboutSection from '../Components/AboutSection'
import DoctorProfileHeader from '../Components/DoctorProfileHeader'
import FacilitiesSection from '../Components/FacilitiesSection'
import StaffSection from '../Components/StaffSection'
import QualificationSection from '../Components/QualificationSection'
import { API, testing } from '../DB/API'
import LocationSection from '../Components/LocationSection'
import { useLocation } from "react-router-dom";
import { GetDoctorAllInfoAPI } from '../DB/API'

const DoctorProfileTab = (props) => {
    const [data,setData] = useState([]);
    const doc_ID = useLocation();
    // console.log("user id is ",doc_ID.state.userId)  
    const [oneTime,setOneTime]=useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            oneTime && 
            GetDoctorAllInfoAPI(doc_ID.state.userId).then(result => {
                console.log("new api",result[0]);
                setData(result[0]);
            });
            setOneTime(false);
          }, 200);
        return () => clearTimeout(timer);
    })
    
    const refreshCallBack=()=>{
        // console.log("Call back");
        GetDoctorAllInfoAPI(doc_ID.state.userId).then(result => {
            console.log("new api",result[0]);
            setData(result[0]);
        });
    }

    return(
        <div style={{width: "100%", paddingTop: 0}}>
            {console.log("API response: ", data)}
            <Col style={{borderWidth: 1, borderColor: "lightgray", borderStyle: "solid", backgroundColor: "white", padding:0, paddingBottom: 50, borderRadius: 20, overflow: 'hidden'}}>
                <DoctorProfileHeader data={data}/>
                <AboutSection data={data} id={doc_ID.state.userId} callback={refreshCallBack}/>
                <QualificationSection id={doc_ID.state.userId} />
                <FacilitiesSection id={doc_ID.state.userId}/>
                <LocationSection id={doc_ID.state.userId}/>
                <StaffSection/>
            </Col>
        </div>
    )
}

export default DoctorProfileTab