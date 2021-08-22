import React from 'react'

const Location = (props) =>{
    const location_time = props.locData;
    
    return (
        <div>
            <dl>
                <dd>Location: {location_time.location}</dd>
                <dd>Timings: {location_time.start_time} to {location_time.end_time} ({location_time.days})</dd>
            </dl>
        </div>
    )
}

export default Location