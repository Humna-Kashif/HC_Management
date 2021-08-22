const doc_BaseURL = "https://app.aibers.health/doctors/";
const pat_BaseURL = "https://app.aibers.health/patients/";
const BaseURL="https://app.aibers.health"
const headers = {Accept: 'application/json','Content-Type': 'application/json'};
// export function API ( url) {
//     return fetch(url).then(response => response.json())
// }

/////////////////////////////////////////////////// LogIn APIs ///////////////////////////////////////////////////////////////////

export function LogInAPI(phnNo){
    return fetch(doc_BaseURL+phnNo+"/login").then(response => response.json());
}

/////////////////////////////////////////////////// Profile Screen APIs ///////////////////////////////////////////////////////////////////

//Get Doctor all info
export function GetDoctorAllInfoAPI(doc_id) {
    return fetch(doc_BaseURL+doc_id+"/profile").then(response => response.json());
}

// For Edit doctor all info
export function editAboutInfoAPI(doc_id, APImethod,nameValue,genderValue,dobValue,specializationValue,aboutValue,appointmentType){
    return  fetch((doc_BaseURL+doc_id+"/profile/info"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            name: nameValue,
            gender: genderValue,
            dob: dobValue,
            specialization: specializationValue,
            about: aboutValue,
            appointment_type:appointmentType

        })
        }).then(response => response.json());
}

// Get all Doctor Qualifications
export function qualificationsAPI(doc_id){
    return fetch(doc_BaseURL+doc_id+"/profile/qualifications").then(response => response.json());
}

// For adding a new facility
export function addQualificationAPI(doc_id, APImethod,QualificationValue){
    return  fetch((doc_BaseURL+doc_id+"/profile/qualifications"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            qualification: QualificationValue
        })
        }).then(response => response.json());
}


// For Delete Qualification
export function deleteQualificationAPI(doc_id, APImethod,Qualificationid){
    return  fetch((doc_BaseURL+doc_id+"/profile/qualifications/"+Qualificationid), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

// For Edit Qualification
export function editQualificationAPI(doc_id, APImethod ,QualificationValue, Qualificationid){
    return  fetch((doc_BaseURL+doc_id+"/profile/qualifications/"+Qualificationid), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            qualification: QualificationValue
        })
        }).then(response => response.json());
}

// Get all Doctor Facilities
export function facilitiesAPI(doc_id){
    return fetch(doc_BaseURL+doc_id+"/profile/facilities").then(response => response.json());
}

// For adding a new facility
export function addFacilityAPI(doc_id, APImethod,FacilityValue){
    return  fetch((doc_BaseURL+doc_id+"/profile/facilities"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            facility: FacilityValue
        })
        }).then(response => response.json());
}


// For Delete Facility
export function deleteFacilityAPI(doc_id, APImethod,Facilityid){
    return  fetch((doc_BaseURL+doc_id+"/profile/facilities/"+Facilityid), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

// For Edit Facility
export function editFacilityAPI(doc_id, APImethod ,FacilityValue, Facilityid){
    return  fetch((doc_BaseURL+doc_id+"/profile/facilities/"+Facilityid), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            facility: FacilityValue
        })
        }).then(response => response.json());
}

// Get all Doctor Locations
export function locationsAPI(doc_id){
    return fetch(doc_BaseURL+doc_id+"/profile/locations").then(response => response.json());
}


// Get all and search all Doctor locations
export function searchLocationsAPI(doc_id,char_val){
    return fetch(doc_BaseURL+doc_id+"/profile/location?character="+char_val).then(response => response.json());
}

// Add a new location
export function addLocationAPI(doc_id, APImethod,locationValue,daysValue,feesValue,start_timeValue,end_timeValue){
    return  fetch((doc_BaseURL+doc_id+"/profile/locations"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            location: locationValue,
            days: daysValue,
            fees: feesValue,
            start_time: start_timeValue,
            end_time: end_timeValue,

        })
        }).then(response => response.json());
}

// Edit a Location
export function editLocationAPI(doc_id, APImethod,doctors_hospital_location_id,locationValue,daysValue,feesValue,start_timeValue,end_timeValue){
    return  fetch((doc_BaseURL+doc_id+"/profile/locations/"+doctors_hospital_location_id), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            location: locationValue,
            days: daysValue,
            fees: feesValue,
            start_time: start_timeValue,
            end_time: end_timeValue,
        })
        }).then(response => response.json());
}

// Delete a location

export function deleteLocationAPI(doc_id, APImethod,doctors_hospital_location_id){
    return  fetch((doc_BaseURL+doc_id+"/profile/location/"+doctors_hospital_location_id), {
        method: APImethod,
        headers: headers,
        }).then(response => response.json());
}


/////////////////////////////////////////////////// Appointment Screen APIs ///////////////////////////////////////////////////////////////////


// Get Appointments by selected date
export function appointmentsByDateAPI(doc_ID,hospital_ID,patient_ID,date) {
    return fetch(doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments?selected_date="+date).then(response => response.json());
}

//Get patient info
export function patientInfoAPI(patient_ID) {
    return fetch(pat_BaseURL+patient_ID+"/profile/info").then(response => response.json());
}


//Get  patient’s appointments detail
export function appointmentDetailAPI(patient_ID) {
    return fetch(pat_BaseURL+patient_ID+"/profile/history").then(response => response.json());
}

//New Appointment
export function addAppointmentAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,date,time,appointmentType){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            date: date,
            time: time,
            appointment_type:appointmentType
        })
        }).then(response => response.json());
}


//(pat_BaseURL+patient_ID+"/doctors/"+doc_ID+"/locations/"+hospital_ID+"/appointments/"+appointment_ID)
//Reschedule appointment
// export function rescheduleAppointmentAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,date,time){
//     return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_reschedule/"+appointment_ID), {
//         method: APImethod,
//         headers: headers,
//         body: JSON.stringify({
//             date_by_doc: date,
//             time_by_doc: time        

//         })
//         }).then(response => response.json());
// }

export function rescheduleAppointmentAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,date,time,appointmentType){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_reschedule/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            date: date,
            time: time,
            appointment_type:appointmentType
        })
        }).then(response => response.json());
}

// /api/rescheduleAppointment/'+appointment_id, {​​​​​
//     method: 'PUT',
//     headers: headers,
//     body: JSON.stringify({​​​​​
    
//       date_by_doc: date,
//       time_by_doc : time,
//       doctors_hospital_location_id: location_id,
//     }​​​​​)
//   }​​​​​);

//Change Appointment Status
export function appointmentStatusAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,status){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments/"+appointment_ID+"(:appointment_id)?appointment_status="+status), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

// Search all Symptoms by character
export function searchSymptomAPI(doc_id,hospital_ID,patient_ID,char_val){
    return fetch(doc_BaseURL+doc_id+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_symptoms/?character="+char_val).then(response => response.json());
}


//Add symptoms in an appointment
export function addSymptomInAppointmentAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,symptomValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_symptoms/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            symtoms_name: symptomValue
        })
        }).then(response => response.json());
}



//Add symptoms in symptoms
export function addNewSymptomAPI(doc_ID,hospital_ID,patient_ID,APImethod,symptomValue,symptomType){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_symptoms"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            symtoms_name: symptomValue,
            symtoms_name: symptomType
        })
        }).then(response => response.json());
}


// Delete a symptom
export function deleteSymptomAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,symptomValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_symptoms/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            symtoms_name: symptomValue
        })
        }).then(response => response.json());
}


// Add Doctor Notes
export function addDoctorNotesAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,doctorNotes){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_doctornote/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            doctors_note: doctorNotes
        })
        }).then(response => response.json());
}

//https://app.aibers.health/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_diagnosis?character=r

//Search diagnosis

export function searchDiagnosisAPI(doc_id,hospital_ID,patient_ID,char_val){
    return fetch(doc_BaseURL+doc_id+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_diagnosis?character="+char_val).then(response => response.json());
}

//Add Diagnosis
export function addDiagnosisAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,diagnosisValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_diagnosis/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            diagnosis_name: diagnosisValue
        })
        }).then(response => response.json());
}


// Delete Diagnosis
export function deleteDiagnosisAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,diagnosisValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_diagnosis/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            diagnosis_name: diagnosisValue
        })
        }).then(response => response.json());
}

// Search all Tests by character
export function searchTestAPI(doc_id,hospital_ID,patient_ID,char_val){
    return fetch(doc_BaseURL+doc_id+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_tests?character="+char_val).then(response => response.json());
}

// https://app.aibers.health/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_tests/(:appointment_id)

//Add Test
export function addTestAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,testValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_tests/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            test_name: testValue
        })
        }).then(response => response.json());
}

// Delete Test
export function deleteTestAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,testValue){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_tests/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            test_name: testValue
        })
        }).then(response => response.json());
}


// Search all Medicines by character
export function searchMedicinesAPI(doc_id,hospital_ID,patient_ID,char_val){
    return fetch(doc_BaseURL+doc_id+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_medicine?character="+char_val).then(response => response.json());
}

//Add Prescription
export function addPrescriptionAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,medicine_name,days,quantity,frequency){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_prescription/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            medicine_name: medicine_name,
            days: days,
            quantity : quantity,
            frequency :frequency
        })
        }).then(response => response.json());
}

// Delete Prescription
export function deletePrescriptionAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,medicine_name){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_prescription/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            medicine_name: medicine_name,
        })
        }).then(response => response.json());
}


//Schedule Followup
export function scheduleFollowupAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod,doc_Date,doc_Time,appointmentType){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_followup/"+appointment_ID), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            date_by_doc:doc_Date,
            time_by_doc:doc_Time,
            appointment_type:appointmentType

        })
        }).then(response => response.json());
}

//https://app.aibers.health/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_status/(:appointment_id)?status=inprogress

// Get Patient’s Appointment history
export function getPatientAppoinmtmentHistoryAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_status/"+appointment_ID+"?status=inprogress"), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

//https://app.aibers.health/doctors/[:doctor_id]/locations/[:doctors_hospital_location_id]/availableslots/

//Available slots
export function availableSlotsAPI(doc_ID,hospital_ID,APImethod,date){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/availableslots/"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            date:date
        })
        }).then(response => response.json());
}

//https://app.aibers.health/doctors/2/locations/0/patients/1/completed_appointments
// Get Patient’s completed Appointments history
export function getPatientCompletedAppoinmtmentHistoryAPI(doc_ID,hospital_ID,patient_ID,APImethod){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/completed_appointments"), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

//https://app.aibers.health/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_status/(:appointment_id)?status=completed
// Get Patient’s completed Appointment history profile
export function getPatientCompletedAppoinmtmentProfileAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,APImethod){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_status/"+appointment_ID+"?status=completed"), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

//https://app.aibers.health/patients/2/vitals/0
//Get all vitals data
export function getVitalsAPI(patient_ID,vital_ID,APImethod){
    return  fetch((pat_BaseURL+patient_ID+"/vitals/"+vital_ID), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

// /patients/'+patient_id+'/vitals/'+vital_id, {
//     method: method,
//     headers: headers,
//     body: JSON.stringify({
//       new_value:vital_value,
//     })
//   });

//Add Vitals
export function addVitalAPI(patient_ID,vital_id,APImethod,vital_value){
    return  fetch((pat_BaseURL+patient_ID+"/vitals/"+vital_id), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
        new_value:vital_value,
    })
        }).then(response => response.json());
}

export function getAllPatientsOfDoctorByName (doc_ID, hospital_ID, patient_ID,searchKey, APImethod) {
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/allPatients/"), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}

export function getPatientAppoinmtmentByStatusAPI(doc_ID,hospital_ID,patient_ID,appointment_ID,status,APImethod){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/patients/"+patient_ID+"/appointments_status/"+appointment_ID+"?status="+status), {
        method: APImethod,
        headers: headers
        }).then(response => response.json());
}
 // get image
export function getImage(person,id){
    return fetch(BaseURL+'/'+person+'/'+id+'/image').then((response) => response.json());
  }
// set image


//Get Comments
export function getComments(patient_ID,doc_ID,hospital_ID,appointment_ID){
    return fetch(pat_BaseURL+patient_ID+"/doctors/"+doc_ID+"/locations/"+hospital_ID+"/appointments/"+appointment_ID+"/comments").then((response) => response.json());
  }

//Add Comment
export function addComment(patient_ID,doc_ID,hospital_ID,appointment_ID,APImethod,comment_Value){
    return  fetch((pat_BaseURL+patient_ID+"/doctors/"+doc_ID+"/locations/"+hospital_ID+"/appointments/"+appointment_ID+"/comments"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
            comment:comment_Value
    })
        }).then(response => response.json());
}

//Get Stats
export function getAppointmentsStats(doc_ID){
    return fetch(doc_BaseURL+doc_ID+"/appointments_stats").then((response) => response.json());
}

//Get Queue
export function getAppointmentsQueue(doc_ID){
    return fetch(doc_BaseURL+doc_ID+"/appointments_queue").then((response) => response.json());
}

//getStaffdetail
export function getStaff(doc_ID){
    return fetch(doc_BaseURL+doc_ID+"/locations/0/staff").then((response) => response.json());
}

//addStaff
export function addStaff(doc_ID,hospital_ID,APImethod,name,dob,role,phnNo){
    return  fetch((doc_BaseURL+doc_ID+"/locations/"+hospital_ID+"/staff"), {
        method: APImethod,
        headers: headers,
        body: JSON.stringify({
                name: name,
                dob: dob,
                role: role,
                contact_no: phnNo       
    })
        }).then(response => response.json());
}



