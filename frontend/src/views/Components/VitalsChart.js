import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import moment from 'moment'

 
const VitalsChart = (props) => {
    // const data = props.data[0];
    const [data, setData] = useState(-1);
    const [chartData, setChartData] = useState({});
    console.log("vitals chart Data is ",props.data);
    let observedRange = [];
    let normalRange= [];
    let datesArray=[];
    // const [observedRange,setObservedRange] = useState([]);
    // const [normalRange,setNormalRange] = useState([]);
    // const [datesArray,setDatesArray] = useState([]);
    const prepareChartData=(data)=>{
        let observed=[];
        let normal=[];
        let dates=[];
        for(var i=0; i<data[0].vital_data.length; i++)
        {
            dates.push(moment(data[0].vital_data[i].date_time).format('LL'))   
        }
        
        for(var i=0; i<data[0].vital_data.length; i++)
        {
            observed.push(!!data[0].vital_data[i].current_value?parseInt(data[0].vital_data[i].current_value):0)
        }
        
        for(var i=0; i<data[0].vital_data.length; i++)
        {
            normal.push(!!data[0].vital_info.normal_range?parseInt(data[0].vital_info.normal_range):0)
        }
        
        console.log("a ",observed," b ",dates," c ", normal);
        observedRange = observed.reverse();
        normalRange = normal.reverse();
        datesArray = dates.reverse();
      }

      
      
      useEffect(() => {
        console.log("Farid ",props.data);
        // setData();
        if(props.data.length>0){
            console.log("Farid 1 ",props.data[0].vital_id);
            console.log("Farid 2 ",data);
            if(props.data[0].vital_id!== data){
                console.log("i am here")
                prepareChartData(props.data);
                console.log("Arrays ",datesArray," ", observedRange," ",normalRange );
                chart();
                setData(props.data[0].vital_id);
            }
        }
    });

    const chart = () => {
        console.log("Kalim ",datesArray," ", observedRange," ",normalRange );
        let empSal = datesArray;
        let empAge1 = observedRange;
        let empAge2 = normalRange;
            setChartData({
            labels: empSal,
            datasets: [
                {
                label: "Observed",
                data: empAge1,
                borderColor:"rgba(255, 0, 0)",
                backgroundColor: ["rgba(255, 0, 0, 0.6)"],
                fill:false,
                borderWidth: 4
                },
                {
                    label: "Normal Range",
                    data: empAge2,
                    borderColor:"rgba(75, 182, 180)",
                    backgroundColor: ["rgba(75, 182, 180, 0.6)"],
                    fill:false,
                    borderWidth: 2
                }
            ]
            });
        }

    // useEffect(() => {
    //     chart();
    //     // props.values();
    // }, []);
    return (
        <div className="App">
            {props.data.length>0 && <div>
        <div>
            <Line
            data={chartData}
            options={{
                responsive: true,
                interaction: {
                    mode: 'index'
                },
                stacked: false,
					plugins: {
						title: {
							display: true,
							text: 'Chart.js Line Chart - Multi Axis'
						}
					},
                title: { text: "Vitals Observed Visualization", display: true },
                scales: {
                yAxes: [
                    {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        beginAtZero: true
                    },
                    gridLines: {
                        drawOnChartArea: false,
                    }
                    },
                ],
                yAxes2: [
                    {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 6,
                        beginAtZero: true
                    },
                    gridLines: {
                        drawOnChartArea: false,
                    }
                    },
                ],
                xAxes: [
                    {
                    gridLines: {
                        drawOnChartArea: false,
                    }
                    }
                ]
                }
            }}
            />
        </div>
        </div>}
        </div>
    );

}
export default VitalsChart