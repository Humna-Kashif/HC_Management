import React, {Fragment, useEffect, useState} from "react";


// NODE_ENV = 'development'
// NODE_ENV = 'production'

// if we are in production baseurl = /api/getDoctors
// else baseurl = http://localhost:8090/api/getDoctors

// const baseURL = "http://localhost:8090/api/getDoctors";

const baseURL = process.env.NODE_ENV === "production" ? "/api/getDoctors" : "https://app.aibers.health/api/getDoctorIdByContactNo/12345678900";

const ListAllDoctors = () => {

    const [lists, setNames] = useState([]);

    const getNamesOfDoctor = async () => {
        try {
            const response = await fetch(baseURL);
            const jsonData = await response.json();

            setNames(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        getNamesOfDoctor();
    }, [])

    console.log(lists);

    return(
        <Fragment>

        <h1>List of Doctors</h1>
            <table class="docTable">
                <tr>
                    <td><b>ID</b></td>
                    <td><b>Name</b></td>
                    <td><b>Gender</b></td>
                    <td><b>DOB</b></td>
                    <td><b>Qualification</b></td>
                    <td><b>Specialization</b></td>
                </tr>
                {lists.map( docList => (
                <tr>
                    <td>{docList.doctor_id}</td>
                    <td>{docList.name}</td>
                    <td>{docList.gender}</td>
                    <td>{docList.dob}</td>
                    <td>{docList.qualification}</td>
                    <td>{docList.specilization}</td>
                </tr>
                ))}
            </table>
        

        </Fragment>
    );
}

export default ListAllDoctors;