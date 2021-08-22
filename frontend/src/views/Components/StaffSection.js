import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import FacilityItem from "./FacilityItem";
import { getStaff , addStaff} from "../DB/API";
import InputDropDown from "./InputWithDropDown/InputDropDown";
import "../Styles/DoctorValuesSection.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { useLocation } from "react-router-dom";

const StaffSection = (props) => {
  const [data, setData] = useState(props.StaffData);
  const doctorId = useLocation().state.userId;
  const [editing, setEditing] = useState(false);
  const [staffList,setStaffList]=useState([]);
  const [staffName,setStaffName] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  //For enabling Number input only
  const [number,setNumber] = useState([]);
  const handleSaveBtn = () => {
    setEditing(false);
  };
  const handleStaffEdit = () => {
    setEditing(true);
  };

  const [suggestList, setSuggestionList] =useState([]);
  const [roleList,setRoleList] = useState([]);

  useEffect(() => {
    getStaff(doctorId).then(result => {
      console.log("Staff is ", result);
      if(result)
      setStaffList(result);
  });
  }, []);

  const displayStaff = ()=>{
    getStaff(doctorId).then(result => {
      console.log("Staff is ", result);
      if(result)
      setStaffList(result);
    });
  }


const [role,setRole] = useState('');

const handleAddStaff = (name,dob,staffRole,phn) =>{
  let mydate=moment(dob).format('YYYY-MM-DD')
  console.log("Name ",name, " phone Number ", phn, " Role ", staffRole," Date ",mydate)
  addStaff(doctorId,1,"POST",name,mydate,staffRole,phn).then(result => {console.log("Staff added result ", result);
    displayStaff();
  });
}

const renderStaff = () =>{
  return staffList.map((item,i)=><div style={{display:"flex",flexDirection:"row",flex:1,margin:15}}>
    <div style={{display:"flex",flexDirection:"row",flex:1,margin:15}}><p>{item.name}</p></div> 
    <div style={{display:"flex",flexDirection:"row",flex:1,margin:15}}><p>{item.dob}</p></div> 
    <div style={{display:"flex",flexDirection:"row",flex:1,margin:15}}><p>{item.role}</p></div> 
    <div style={{display:"flex",flexDirection:"row",flex:1,margin:15}}><p>{item.contact_no}</p></div>
    </div>)
}


  return (
    <div className={"separation"}>
      <Row className={"margin"}>
        <Col lg={{ offset: 1, span: 7 }} xs={4}>
          <h4>Staff</h4>
        </Col>
        {editing ? (
          <Col lg={3} xs={8} className={"edit-button"}>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveBtn}
              className={"done"}
            >
              Done
            </Button>
          </Col>
        ) : (
          <Col
            lg={3}
            xs={8}
            className={"edit-button"}
            onClick={handleStaffEdit}
          >
            <span className={"edit-label"}>Edit</span>
            <FaEdit className={"edit-symbol"}></FaEdit>
          </Col>
        )}
      </Row>
      {editing && (
        <Row className={"value"}>
          <Col lg={{ span: 10, offset: 1 }}>
            {/* <div className={"value__container"}> */}
            <div style={{display: "flex",flexDirection: "row",margin:10,color:"blue",transition:"0.3s all"}}>
              <input
                // style={{color:"blue",transition:"0.3s all"}}
                className={"value__input"}
                placeholder="Add Staff Name ..."
                type="text"
                value={staffName}
                noValidate
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            <div>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            </div>
            <div style={{display: "flex",flexDirection: "row",margin:10}}>
            <select value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="front desk">Front Desk</option>
              <option value="nurse">Nurse</option>
              <option value="personal assistant">Personal Assistant</option>
            </select>
            </div>
            <div style={{display: "flex",flexDirection: "row",margin:10}}>
            <input 
                className={"value__input"}
                placeholder="Add Staff Number ..."
                type="text"
                value={number} 
                onChange={(e)=>{
                    const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                         setNumber(e.target.value)
                      }
                  }} />
            </div>
            <div>
            <Button
                size="sm"
                variant="primary"
                className={"add"}
                onClick={()=>{handleAddStaff(staffName,startDate,role,number)}}
              >
                Add
            </Button>
            </div>
          </Col>
        </Row>
      )}
      {renderStaff()}
    </div>
  );
};

export default StaffSection;
StaffSection.defaultProps = {
    StaffData: [
        { "name":"Nurse"},
        { "name":"Front Desk"},
        { "name":"personal assistant"}
    ]
};

const styles = {
  filed: {display: "flex", flexDirection: "row", padding: 16, alignItems:"center", backgroundColor: "white"}
};
