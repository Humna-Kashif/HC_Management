require('dotenv').config();
const express = require("express");
const apiErrorHandler = require('./error/api-error-handler');
const app = express();
const cors = require("cors");
const doctorAPIs = require('./doctorAPIs');
const patientAPIs = require('./patientAPIs');
const appointmentAPIs = require('./appointmentAPIs');
const aibersInfo = require('./aibersAPIs');

// middle-wares
app.use(express.static('./public'));
app.use(cors());
app.use(express.json());


// time slot API
app.put('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/availableSlots/', doctorAPIs.availableSlots);

// set favourite doctor by patient_id, doctor_id and doctors_hospital_location_id
app.post('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/favourites', doctorAPIs.setFavouriteDoctor);

// remove doctor from favourite list by patient_id, doctor_id and doctors_hospital_location_id
app.delete('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/favourites', doctorAPIs.deleteFavouriteDoctor);

// get all favourite doctors by patient_id
app.get('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/favourites', doctorAPIs.getFavouriteDoctor);

//get doctors
app.get('/doctors', doctorAPIs.getDoctors);

//appointment APIs

//set a new appointment
app.post('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)', appointmentAPIs.setAppointmentByPatientId);

//delete appointment by appointment_id
app.delete('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)', appointmentAPIs.cancelAppointmentByAppointmentId);

//reschedule appointment by appointment_id
app.put('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)', appointmentAPIs.rescheduleAppointment);

//get appointment detail || followUps(filter status = followups) by appointment id
app.get('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)', appointmentAPIs.getAppointmentDetail);

//get appointments
app.get('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments', appointmentAPIs.getAppointments);


// patient APIs

//get patient_id by contact no
app.get('/patients/(:contact_no)/login', patientAPIs.patientLogin);

// insert a new patient
app.post('/patients/(:patient_id)', patientAPIs.newPatient);

// add family member
app.post('/patients/(:patient_id)/family/(:family_id)', patientAPIs.addFamilyMember);

// remove family member
app.delete('/patients/(:patient_id)/family/(:family_id)/familymember/(:family_member_id)', patientAPIs.removeFamilyMember);

// add or remove doctor's access from accessing patient's profile
app.post('/patients/(:patient_id)/doctors/(:doctor_id)/access', patientAPIs.doctorAccess);

// get patient information
app.get('/patients/(:patient_id)', patientAPIs.getPatientInfo);

//get all patients
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/allPatients', patientAPIs.getAllpatients);

// update patient's profile API
app.put('/patients/(:patient_id)/profile', patientAPIs.updatePatientProfile);

// images/files uploading/display APIs
//upload patient's profile image API
app.put('/patients/(:patient_id)/image' , patientAPIs.uploadPatientProfileImage);

// get patient_image
app.get('/patients/(:patient_id)/image', patientAPIs.getPatientProfileImage);

//upload doctor's profile image API
app.put('/doctors/(:doctor_id)/image' , doctorAPIs.uploadDoctorProfileImage);

// get patient_image
app.get('/doctors/(:doctor_id)/image', doctorAPIs.getDoctorProfileImage);

// upload test result API
app.post('/patients/(:patient_id)/appointments/(:appointment_id)/tests/(:test_id)', patientAPIs.uploadTestResult);

// get test result API
app.get('/patients/(:patient_id)/appointments/(:appointment_id)/tests/(:test_id)', patientAPIs.getTestResult);


// vitals APIs
// get all vitals by patient_id
app.get('/patients/(:patient_id)/vitals/(:vital_id)', patientAPIs.vitals);

// add vitals
app.post('/patients/(:patient_id)/vitals/(:vital_id)', patientAPIs.addVitals);

// comments APIs
// get all comments by appointment_id
app.get('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)/comments', appointmentAPIs.getComments);

// insert a new comment
app.post('/patients/(:patient_id)/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/appointments/(:appointment_id)/comments', appointmentAPIs.insertComment);

// add a new hospital
app.post('/doctors/addhospital', doctorAPIs.addHospital);


//HOME SCREEN APIs FOR WEB//

//get doctor id by contact no
app.get('/doctors/(:contact_no)/login', doctorAPIs.doctors_login)

//get doctor profile by id
app.get('/doctors/(:doctor_id)/profile', doctorAPIs.doctors_profile)

// update doctor info by doctor id
app.put('/doctors/(:doctor_id)/profile/info', doctorAPIs.doctors_profile_info)

//set Qualification of doctor
app.post('/doctors/(:doctor_id)/profile/qualifications', doctorAPIs.doctors_profile_setqualification)

// get Qualification of doctor by id
app.get('/doctors/(:doctor_id)/profile/qualifications', doctorAPIs.doctors_profile_getqualification)

// update Qualification of doctor by id
app.put('/doctors/(:doctor_id)/profile/qualifications/(:doctor_qualification_id)', doctorAPIs.doctors_profile_updatequalification)

//delete doctor qualification by doctor qualification id
app.delete('/doctors/(:doctor_id)/profile/qualifications/(:doctor_qualification_id)', doctorAPIs.doctors_profile_deletequalification)

//set hospital location
app.post('/doctors/(:doctor_id)/profile/locations', doctorAPIs.doctors_profile_setlocation)

//get hospital location and timing  by doctors_hospital_location_id
app.get('/doctors/(:doctor_id)/profile/locations', doctorAPIs.doctors_profile_getHospitalLocation)

//get location by character
app.get('/doctors/(:doctor_id)/profile/location', doctorAPIs.doctors_profile_getlocation)

// update hospital location  by doctors_hospital_location_id
app.put('/doctors/(:doctor_id)/profile/locations/(:doctors_hospital_location_id)', doctorAPIs.doctors_profile_updatelocation)

//disable locations of doctors hospital location by id
app.put('/doctors/(:doctor_id)/profile/location/(:doctors_hospital_location_id)', doctorAPIs.doctors_profile_deletelocation)

//set facilities of doctor
app.post('/doctors/(:doctor_id)/profile/facilities', doctorAPIs.doctors_profile_setfacilities)

// get facilities of doctor by doctor facility id
app.get('/doctors/(:doctor_id)/profile/facilities', doctorAPIs.doctors_profile_getfacilities)

// update facilities of doctor by id
app.put('/doctors/(:doctor_id)/profile/facilities/(:doctor_facility_id)', doctorAPIs.doctors_profile_updatefacilities)

//delete doctor facility by doctor facility id
app.delete('/doctors/(:doctor_id)/profile/facilities/(:doctor_facility_id)', doctorAPIs.doctors_profile_deletefacilities)

//end//


////Appointment Screen APIs (web)////

//get name,gender,BG,DOB of patient by id
app.get('/patients/(:patient_id)/profile/info', patientAPIs.patients_profile_info)

//get history of patient by id
app.get('/patients/(:patient_id)/profile/history', patientAPIs.patients_profile_history)

// List all appointments of a doctor by selected date
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments', appointmentAPIs.doctors_getAppointments_byDate)

//change appointment status by appointment_id
app.put('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments/(:appointment_id)', appointmentAPIs.doctors_updateAppointments_status);

//set a new appointment
app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments/(:appointment_id)', appointmentAPIs.setAppointmentByPatientId);

//reschedule appointment by appointment_id
app.put('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_reschedule/(:appointment_id)', appointmentAPIs.rescheduleAppointment);

//get symtoms by character
 app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_symptoms', appointmentAPIs.getSymtoms)

//set appointment symtoms
 app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_symptoms/(:appointment_id)', appointmentAPIs.setAppointmentSymtoms)

//add symtoms
app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_symptoms', appointmentAPIs.addSymtoms) 

//delete symptoms from appointment_symtoms by appointment_symtoms_ID
app.delete('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_symptoms/(:appointment_id)', appointmentAPIs.deleteAppointmentSymptoms);

// set doctor note for paitent
app.put('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_doctornote/(:appointment_id)', appointmentAPIs.setDoctorNoteForPatient);

//get diagnosis list for drop down
 app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_diagnosis', appointmentAPIs.getDiagnosis);

// set appointment_diagnosis
app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_diagnosis/(:appointment_id)', appointmentAPIs.setAppointmentDiagnosis);

// unlist diagnosis from appointment_diagnosis by appointment ID
app.delete('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_diagnosis/(:appointment_id)', appointmentAPIs.unlistDiagnosisByAppointmentID);

//get test list for drop down
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_tests',appointmentAPIs.getTest)

//set appointment tests
app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_tests/(:appointment_id)', appointmentAPIs.setAppointmentTests)

//delete test from appointment
app.delete('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_tests/(:appointment_id)', appointmentAPIs.unlistTestByAppointmentID)

//get medicines by character
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_medicine', appointmentAPIs.getPrescription)

 //set prescription
 app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_prescription/(:appointment_id)', appointmentAPIs.setPrescription)

 //delete prescription
 app.delete('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_prescription/(:appointment_id)', appointmentAPIs.unlistPrescriptionFromAppointment)

// set followUp 
 app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_followup/(:appointment_id)', appointmentAPIs.setFollowUp)


//get all appointments list
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointment_list', appointmentAPIs.getAppointmentslist);

//get all appointments
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/appointments_status/(:appointment_id)', appointmentAPIs.getAppointmentsHistory);

//get all completed appointments
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_id)/patients/(:patient_id)/completed_appointments', appointmentAPIs.getCompletedAppointments);

// add vitals
app.post('/doctors/(:doctor_id)/patients/(:patient_id)/vitals/(:vital_id)', appointmentAPIs.addVitals);

// get current day's appointment stats of a doctor
app.get('/doctors/(:doctor_id)/appointments_stats', appointmentAPIs.appointmentsStats);

// get current day's appointment queue of a doctor
app.get('/doctors/(:doctor_id)/appointments_queue', appointmentAPIs.appointmentsQueue);

// add staff
app.post('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_ids)/staff', doctorAPIs.addStaff);

// display doctor staff by doctor_id
app.get('/doctors/(:doctor_id)/locations/(:doctors_hospital_location_ids)/staff',doctorAPIs.displayStaff);

// get app's info(name + version number)
app.get('/aibersInfo', aibersInfo.aibers_info);

app.use(apiErrorHandler); // don't remove this api error handler

// listening port
const port = 8090;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});