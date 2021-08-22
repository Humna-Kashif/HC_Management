import React, { useEffect, useState } from "react"
import moment from 'moment'
import { Button, Col, Row , Card, Container, Modal} from "react-bootstrap"


const VitalsList = (props) =>{   
    const data=props.itemData;
    const normalRange = props.range;

    
    // console.log("Normal range ", normalRange);
    return (
        <Row style={{height: 50, margin: 10, borderRadius: 10, borderWidth: 1, borderStyle: "solid", borderColor: "#e0e0e0",display:"flex",flexDirection:"row",alignItems:"center"}}>
            <Col style={{margin:10,textAlign:"center"}}><b>{!!data.current_value ? data.current_value: "-"}</b></Col>
            <Col style={{margin:10,textAlign:"center"}}><b>{moment(data.date_time).format('YYYY-MM-DD')}</b></Col> 
            <Col style={{margin:10,textAlign:"center"}}><b>{!!normalRange ? normalRange : "-"}</b></Col>
        </Row>
    )
}
export default VitalsList