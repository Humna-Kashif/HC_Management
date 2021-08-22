import React, { useState } from "react"
import { Button, Col, Row,ButtonGroup } from "react-bootstrap";
import TimePicker from 'react-time-picker';
import AsyncSelect from 'react-select/async';
import {editLocationAPI,deleteLocationAPI} from "../DB/API"
import DeleteIcon from '@material-ui/icons/Delete';

const LocationItem = (props) => {
    const doc_Id = props.id;
    const itemData = props.itemData;
    const Enabled = props.isEnableEdit;
    const [data, setData] = useState(itemData);
    const [enableEdit, setEnableEdit] =  useState(true);      
    const [editCtrl, setEditCtrl] = useState(false);
    const [deleteCtrl, setDeleteCtrl] = useState(false);
    const [selectedValue, setSelectedValue] = useState(itemData.location);
    const [searchLocList, setSearchLocList]=useState([]);
    const [inputValue, setValue] = useState('null');
    const [startTimePick, setstartTimePick] = useState(itemData.start_time);
    const [endTimePick, setendTimePick] = useState(itemData.end_time);
    const [feeValue,setFeeValue] = useState(itemData.fees);
    const [daysData, setDaysData] = useState(itemData.days);

    const handleEditBtn = () => {
        setEnableEdit(false);
        setEditCtrl(true);
    }
    const handleDeleteBtn = () => {
        setEnableEdit(false);
        setDeleteCtrl(true);
    }
    const handleConfirmEdit = (id) => {
        // console.log("location :",selectedValue);
        // console.log("start time :",startTimePick);
        // console.log("end time :",endTimePick);
        // console.log("days :",daysData);
        // console.log("fee :",feeValue);
        // if(selectedValue != -1){
        //     console.log("done1 :", selectedValue.label);
        // }
        // else
        // {
        // console.log("done2 :", selectedValue);
        // }
        editLocationAPI(doc_Id,"PUT",id,selectedValue.label,daysData,feeValue,startTimePick,endTimePick).then(result => {
            console.log("new location api",result);
            setData(result);
            props.callback();
        });
        setEnableEdit(true);
        setEditCtrl(false);
    }
    const handleCancelEdit = () => {
        setData(itemData);
        setEnableEdit(true);
        setEditCtrl(false);
    }
    const handleConfirmDel = (id) => {
        console.log("new id api",id);
        deleteLocationAPI(doc_Id,'PUT',id).then(result => {
            console.log("new location api",result);
            setData(result);
            props.callback();
        });
        setEnableEdit(true);
        setDeleteCtrl(false);
    }
    const handleCancelDel = () => {

        setEnableEdit(true);
        setDeleteCtrl(false);
    }

    if(!Enabled && (editCtrl || deleteCtrl)){
        handleCancelEdit()
        handleCancelDel();
    }

      const [daysArray, setDaysArray] = useState( [
        {day: "mon", selected: false},
        {day: "tue", selected: false},
        {day: "wed", selected: false},
        {day: "thu", selected: false},
        {day: "fri", selected: false},
        {day: "sat", selected: false},
        {day: "sun", selected: false}
    ]);

    const dayBtnClicked = (item,i) => {
        let temp = daysArray;
        temp[i].selected = !item.selected;
        console.log("Temp: " , temp, "days: ", daysArray);
        setDaysArray(temp);
        formatDaysString();
    }

    const selectAllDays = () => {
        let tempArray = [];
        daysArray.map((item)=>{
            let tempItem = item;
            tempItem.selected = true;
            return tempArray.push(tempItem);
        });
        setDaysArray(tempArray);
        formatDaysString();
    }

    const formatDaysString = () =>{
        let stringTemp = [];
        daysArray.map((item) => {
            if(item.selected)
                stringTemp.push(item)
                return true;
        });
        setDaysData(stringTemp.map((item)=>(
            item.selected && item.day
            )).join("-"));
    }

    const renderDaysBtns = () => {
        return( 
        <ButtonGroup toggle={true} style={{display: "flex", flex: 1}}>
            {console.log("rendered with : ", daysArray )}
            {daysArray.map((item,i)=>(
            <Button key={i}
                variant={item.selected ? "primary" : "outline-primary"} 
                onClick={() => dayBtnClicked(item,i)}>
                    {item.day.toUpperCase()}
                </Button>
            ))  
            }
            <Button
                variant="outline-primary"
                onClick={() => selectAllDays()}
            >
                All
            </Button>
        </ButtonGroup> )
    }

    const [startISO,setStartISO] = useState();
    const [EndISO,setEndISO] = useState();

    const settingTimeISO = () => {
        let datetest = new Date();
        let timmee = datetest.getTime();
        let dateFromUI = "12-10-2020";
        let myTimeStart = startTimePick;
        let myTimeEnd = endTimePick;
        let dateParts = dateFromUI.split("-");
        let timeParts = myTimeStart.split(":");
        let timePartsEnd = myTimeEnd.split(":");

        let dateStart = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timeParts[0], timeParts[1]);
        let dateEnd = new Date(dateParts[2], dateParts[0]-1, dateParts[1], timePartsEnd[0], timePartsEnd[1]);

        let dateISOStart = dateStart.toISOString();
        let dateISOEnd = dateEnd.toISOString();
        console.log("Time checking: ", timmee.toString(),"StartValue", startTimePick, "StartISO: ", dateISOStart,"EndISO: ", dateISOEnd);
        
        setStartISO(dateISOStart);
        setEndISO(dateISOEnd);
        console.log("ISO: ", startISO, EndISO);
    }

    const formattedSearchList = () => {
        let formattedList = [];
        !!(searchLocList) && (
            searchLocList.map((item)=>{
                console.log("Loop");
                return formattedList.push({
                    value: item.hospital_id, label: item.location
                });
            })
        );
        console.log("Formatted list: ", formattedList);
        return formattedList;
    }

    const loadOptions = (inputValue, callback) => {
        setTimeout(() => {
          callback(formattedSearchList());
        }, 1000);
      };

    const handleInputChange = value => {
        const inValue = value;
        console.log(inputValue);
        if(inValue !== ''){
            fetch("https://app.aibers.health/doctors/"+doc_Id+"/profile/location?character="+inValue)
            .then((response) => response.json())
            .then((data) => {
                    console.log('This is search location data:', data);
                    setSearchLocList(data);
                }) 
            .catch((error) => console.error(error))
            .finally(() =>loadOptions); 
        }
      setValue(inValue);
    };
    const handleChange = value => {     
      setSelectedValue(value);
    }

  

 

    return (
        <Row style={{margin: 0 , marginBottom:8}}>
            {console.log("item rendered", itemData.location, "editing", props.isEnableEdit, "value", enableEdit, Enabled)}
            <Col lg={1}></Col>
            <Col style={{textAlign: "left", minHeight: 30}}>
                { editCtrl ? 
                (<div style={{display:"flex", flex:"1", flexDirection:"column"}}>
        <Row>
            <Col>
                <div className="modal_label">Edit Location</div>
                    <div>
                        <AsyncSelect
                            placeholder={itemData.location}
                            // cacheOptions
                            defaultOptions
                            value={selectedValue}
                            loadOptions={loadOptions}
                            onInputChange={handleInputChange}
                            onChange={handleChange}
                        />
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
            <label>Fee :</label>
                <div style={{display:"flex", flexDirection:"row",width:"100px"}}> 
                        <input
                        style={styles.input}
                        placeholder="Fee"
                        type="text"
                        value={feeValue}
                        noValidate
                        onChange={e => setFeeValue(e.target.value)}
                        /> 
                </div>
            </Col>
        </Row>
        <Row style={{marginTop:"10px"}}>
            <Col>
                <label>Start time :</label>
                <TimePicker
                onChange={(value) => {
                    setstartTimePick(value);
                }}
                value={itemData.start_time}
                clockIcon={null}
                clearIcon={null}
                />
            </Col>
            <Col>
                <label>End time :</label><TimePicker
                onChange={(value) => setendTimePick(value)}
                value={itemData.end_time}
                clockIcon={null}
                clearIcon={null}
                />
            </Col>
        </Row>
        <Row>
            <Col style={{display:"flex", flex:"1", flexDirection:"column"}}>
                <div><label>Previous Selected Days :</label>
                {itemData.days}</div>
                <label>Select Days :</label>
                {renderDaysBtns()}
                {daysData}
            </Col>
        </Row>
    </div>)
        :(  
            <div>
                <dl>
                    <dd>Location: {itemData.location}</dd>
                    <dd>Fess: {itemData.fees}</dd>
                    <dd>Timings: {itemData.start_time} to {itemData.end_time} ({itemData.days})</dd>
                </dl>
            </div>  
        )
    }
            </Col>
            {Enabled && enableEdit &&(
                <Col lg={3} xs={8} style={{alignItems:"center", display: "flex", justifyContent: "flex-end"}}>
                    <Button size="sm" variant="primary" onClick={handleEditBtn} style={{marginRight:5, width: 80}}>
                        Edit
                    </Button>
                    <Button size="sm" variant="outline-primary" onClick={handleDeleteBtn} style={{width: 80}}>
                        Delete
                    </Button>
                </Col>
            )}
            {editCtrl &&(
                <Col lg={3} xs={8} style={{alignItems:"center", display: "flex", justifyContent: "flex-end"}}>
                    <Button size="sm" variant="primary" onClick={()=>handleConfirmEdit(itemData.doctors_hospital_location_id)} style={{marginRight:5, width: 80}}>
                        Confirm
                    </Button>
                    <Button size="sm" variant="outline-primary" onClick={handleCancelEdit} style={{width: 80}}>
                        Cancel
                    </Button>
                </Col>
            )}
            {deleteCtrl && (
                <Col lg={3} xs={8} style={{alignItems:"center", display: "flex", justifyContent: "flex-end"}}>
                    <Button size="sm" variant="primary" onClick={()=>handleConfirmDel(itemData.doctors_hospital_location_id)} style={{marginRight:5, width: 80}}>
                        Delete
                    </Button>
                    <Button size="sm" variant="outline-primary" onClick={handleCancelDel} style={{width: 80}}>
                        Cancel
                    </Button>
                </Col>
            )}

            <Col lg={1}></Col>
        </Row>
    )
}

export default LocationItem

LocationItem.defaultProps = {
    itemDate: {
        doctors_hospital_location_id: 45,
        hospital_location_status: true,
        location: "cmh",
        days: "mon-fri",
        fees: "500",
        start_time: "13:00",
        end_time: "19:00",

    }
}


const styles = {
    input: {fontSize:14, padding: 8,borderRadius: "5px"}
}