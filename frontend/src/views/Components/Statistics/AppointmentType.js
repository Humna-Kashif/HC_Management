import React,{useState , useEffect } from 'react';
import { Pie } from '@ant-design/charts' ;   
import {getAppointmentsStats} from "../../DB/API"
import {useLocation} from 'react-router-dom'  

const AppointmentType=()=>{
  const doc_ID = useLocation().state.userId;
  const [followUpAppointments,setFollowUpAppointments] = useState(0);
  const [newAppointments,setNewAppointments]=useState(0);
  useEffect(()=>{
    getAppointmentsStats(doc_ID).then(result => {
      console.log("appointment stats is ",result[0]);
      if(result[0])
      {
      setFollowUpAppointments(result[0].appointment_stats.graph_three.followups);
      setNewAppointments(result[0].appointment_stats.graph_three.new_appointments);
      }
  });
  },[]);
  var data = [ 
    {
      
    appointment : 'new_appointments' , 
      value : newAppointments , 
    } ,
    {
      appointment : 'followups' , 
      value : followUpAppointments , 
    } ,
  ] ;
  var config = { 
    appendPadding : 10 , 
    data : data ,
    angleField : 'value' , 
    colorField : 'appointment' , 
    radius : 0.8 , 
    legend : false , 
    label : { 
      type : 'spider' , 
      content : '{value} \n{name}',
     
      style : { 
        textAlign : 'center' , 
      } ,
      interactions : [ 
        {  appointment : 'element-selected' } ,   
        {  appointment : 'element-active' } ,     
      ] ,
      
    } ,
    pieStyle : function pieStyle ( _ref ) {   
      var  appointment = _ref .  appointment ;
      if (  appointment === 'new_appointments' ) {   
        return { fill : '#dd1c4e' } ;   
      }
      return { fill : '#911a2d' } ;   
    } ,
  } ;
  return < Pie { ... config } /> ;   
} ;

export default AppointmentType
