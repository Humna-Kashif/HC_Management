import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import {getAppointmentsStats} from "../DB/API"
import {useLocation} from 'react-router-dom'
import '../Styles/Stats.css';


const StatusChart=()=> {
  const doc_ID = useLocation().state.userId;
  const [completedAppointments,setCompletedAppointments] = useState(0);
  const [remainingAppointments,setRemainingAppointments]=useState(0);
  const [totalAppointments,TotalAppointments]=useState(0);
  useEffect(()=>{
    getAppointmentsStats(doc_ID).then(result => {
      console.log("appointment stats is ",result[0]);
      if(result[0])
      {
        setCompletedAppointments(result[0].appointment_stats.graph_one.completed_appointments);
        setRemainingAppointments(result[0].appointment_stats.graph_one.remaining_appointments);
      }
  });
  },[]);
 
  var data = [ 
    {
      appointment: 'completed' , 
      value : completedAppointments , 
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
    colorField :  'appointment' , 
    legend:false,
    radius : 1 , 
    innerRadius : 0.6 , 
    meta : { 
      value : { 
        formatter : function formatter ( v ) {   
          return '' . concat ( v , '' );  
        } ,
      } ,
    } ,
    label : { 
      type : 'outer' ,
      labelHeight : 28 , 
      offset : '-50%' , 
      autoRotate:false,
      content : '{value }\n{name} ' , 
      style : { 
        textAlign : 'center' , 
        fontSize : 12 , 
      } ,
    } ,
    interactions : [ {  appointment : 'element-selected' } , {  appointment : 'element-active' } ] ,        
    statistic : { 
      title : false , 
      content : { 
        style : { 
          textAlign : 'center' , 
        } ,

      } ,
    } ,
    pieStyle : function pieStyle ( _ref ) {   
      var appointment = _ref . appointment ;
      if ( appointment === 'completed' ) {   
        return { fill : '#f6941d' } ;   
      }
      return { fill : '#e5ab5b' } ;   
    } ,
  } ;


  return (
    <div className='StatsMain'>
        <h6 className='StatsTitle'>Today's Status</h6>
          <div className='AppointmentStats' >
             <Pie {...config} />  
          </div>
    </div>
  );
}

export default StatusChart;