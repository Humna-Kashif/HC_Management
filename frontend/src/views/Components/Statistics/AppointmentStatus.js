import React,{useState , useEffect } from 'react';
import { Pie } from '@ant-design/charts' ;   
import {getAppointmentsStats} from "../../DB/API"
import {useLocation} from 'react-router-dom'  

const AppointmentStatus=()=> {
  const doc_ID = useLocation().state.userId;
  const [showedAppointments,setShowedAppointments] = useState(0);
  const [canceledAppointments,setCanceledAppointments]=useState(0);
  const [remainingAppointments,setRemainingAppointments]=useState(0);
  useEffect(()=>{
    getAppointmentsStats(doc_ID).then(result => {
      console.log("appointment stats is ",result[0]);
      if(result[0])
      {
        setShowedAppointments(result[0].appointment_stats.graph_two.canceled_appointments);
        setCanceledAppointments(result[0].appointment_stats.graph_two.showed_appointments);
        setRemainingAppointments(result[0].appointment_stats.graph_one.remaining_appointments);
      }
  });
  },[]);
  
    var data = [ 
      {
        appointment : 'cancelled' , 
        value : canceledAppointments, 
      } ,
      {
        appointment : 'showed', 
        value : showedAppointments , 
      } ,
      {
        appointment : 'remaining' , 
        value : remainingAppointments , 
      } ,
     
    ] ;
    var config = { 
      appendPadding : 10 , 
      data : data ,
      angleField : 'value' , 
      colorField : 'appointment' , 
      radius : 1 , 
      innerRadius : 0.5 , 
      legend:false,
     
      label : { 
        type : 'outer' ,
        labelHeight : 28 , 
        offset : '-50%' , 
        content : '{value} \n {name}',
        style : { textAlign : 'center' } ,   
        autoRotate : false ,  
      } ,
      interactions : [ 
        {  appointment : 'element-selected' } ,   
        {  appointment : 'element-active' } ,   
        {  appointment : 'pie-statistic-active' } ,   

       
    
      ] ,

      statistic : { 
        title : false , 
      content : { 
        style : { 
          whiteSpace : 'pre-wrap' , 
          overflow : 'hidden' , 
          textOverflow : 'ellipsis' , 
        } ,
        formatter : function formatter ( ) {   
          return '' ; 
        } ,
      } ,
    } ,
      pieStyle : function pieStyle ( _ref ) {   
        var  appointment = _ref .  appointment ;
        if (  appointment === 'cancelled' ) {   
          return { fill : '#26aadf' } ;   
        }
        else if(appointment === 'showed' ){
          return { fill : '#ee5c2c' } ; 
        }
        else
        return { fill : '#f7f9fb' } ;   
      } ,
    } ;
    return < Pie { ... config } /> ;   
  } ;

export default AppointmentStatus;