const pool = require('./db');
const ApiError = require('./error/ApiError');


//set New Appointment
const setAppointmentByPatientId = async (req, res, next) => {
    const {patient_id, doctor_id, doctors_hospital_location_id, appointment_id} = req.params;
    const {date, time, appointment_type} = req.body;

    if (patient_id == 0 || doctor_id == 0 || doctors_hospital_location_id == 0) {
        next(ApiError.notFound('patient_id, doctor_id and location_id can not be 0'));
        return;
    }
    if (!date || !time) {
        next(ApiError.notFound('Date and Time must not be null'));
        return;
    }
    if (!appointment_type) {
      next(ApiError.notFound("Appointment type can't be null"));
      return;
    }

    try {
      const setApp = await pool.query(
        "INSERT INTO appointments(patient_id,doctor_id,date_time, doctors_hospital_location_id, parent_appointment_id, appointment_type) VALUES($1,$2, $3::date+$4::time, $5, (select currval('appointments_appointment_id_seq'::regclass)), $6)",[patient_id,doctor_id,date,time,doctors_hospital_location_id, appointment_type]
        );
    
	 // adding patient and doctor into access table list
        await pool.query(
          "INSERT INTO access(patient_id, doctor_id) values($1, $2) on conflict (patient_id, doctor_id) do nothing", [patient_id, doctor_id]
        );

        res.json("New Appointment Inserted Successfully!");
    } catch (err) {
        console.error(err.message);
    }
  }

//cancel Appointment by appointment_id
const cancelAppointmentByAppointmentId = async(req, res, next) => {
    
    const appointment_id = parseInt(req.params.appointment_id);

    if (!appointment_id || appointment_id == 0){
        next(ApiError.notFound('appointment_id must not be null or 0'));
    }

    try {
      const cancelAppointmentByAppointmentId = await pool.query(
          'UPDATE appointments SET appointment_status = $1 WHERE appointment_id = $2', ['canceled',appointment_id]);  

          res.json("Appointment cancelled successfully");
    } catch (err) {
      console.error(err.message);
    }
  } 
  
//reschedule Appointment by appointment id
const rescheduleAppointment = async(req,res,next) => {

    const {appointment_id,doctors_hospital_location_id} = req.params;
    const {date, time, appointment_type} = req.body;

    if (appointment_id == 0 || !appointment_id || doctors_hospital_location_id == 0 || !doctors_hospital_location_id) {
        next(ApiError.notFound('appointment_id or location_id can not be 0'));
        return;
    }
    if (!date || !time || !appointment_type) {
        next(ApiError.notFound('Date, Time and appointmnet_type can not be null'));
        return;
    }

    try {
      const rescheduleAppointment = await pool.query(
        'UPDATE appointments SET date_time = $1::date + $2::time, doctors_hospital_location_id = $3, appointment_type = $5 where appointment_id = $4', [date, time, doctors_hospital_location_id, appointment_id, appointment_type]
      );
  
      res.json("Appointment Rescheduled Successfully");
    } catch (err) {
      console.error(err.message);
    }
  }

//get appointment detail || followUps( by status = followups) by appointment id
const getAppointmentDetail = async(req,res,next) => {

  const {appointment_id} = req.params;
  const {status} = req.query;

  if (appointment_id == 0 || !appointment_id) {
      next(ApiError.notFound('Please send correct value(s) in params'));
      return;
  }

  try {
    if( status && status === 'followups'){
      const getFollowUps = await pool.query(
	      "select array_to_json(coalesce(array_agg(row_to_json(t)) filter (where row_to_json(t) is not null), '{}')) from (select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment, a.doctors_note, a.appointment_status,a.appointment_type,  (select row_to_json(appdata) from (select (select array_to_json(array_agg(row_to_json(pres))) from (  select  name as medicine_name, price, prescription.frequency as dosages from medicines inner join prescription on prescription.medicine_id = medicines.medicine_id where prescription.appointment_id = a.appointment_id ) pres) as prescription, (select array_to_json(array_agg(row_to_json(sym))) from (select s.name from symtoms s inner join appointment_symtoms asym on asym.symtoms_id = s.symtoms_id where asym.appointment_id = a.appointment_id) sym) as symptoms,  (select array_to_json(array_agg(row_to_json(diag))) from (select d.name from diagnosis d inner join appointment_diagnosis ad on ad.diagnosis_id = d.diagnosis_id where ad.appointment_id = a.appointment_id) diag) as diagnosis,  (select array_to_json(array_agg(row_to_json(test))) from (  select amt.test_id, name as test_name, price_in_pkr as test_price, amt.test_result from medical_test inner join appointment_medical_test amt on medical_test.test_id = amt.test_id where amt.appointment_id = a.appointment_id ) test) as tests    ) appdata) as appointment_data , (select row_to_json(d) from ( select doctor_id, name, specialization, image,(select row_to_json(al) from ( select hospital_id, doctor_id, start_time, end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor,(select row_to_json(latlng) from(select latitude, longitude from hospital_location where hospital_id = doctors_hospital_location.hospital_id)latlng) as coordinates from doctors_hospital_location where         a.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id   ) al) as appointment_location from doctor where doctor.doctor_id = a.doctor_id) d) as doctorinfo,  (select row_to_json(p) from ( select patient_id, name from patient where patient.patient_id = a.patient_id) p) as patientinfo, (select row_to_json(noc) from (select count(*) from comments where appointment_id = a.appointment_id) noc) as no_of_comments  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where a.parent_appointment_id = (select distinct parent_appointment_id from appointments where appointment_id = $1) AND a.appointment_status = 'completed' ORDER BY a.date_time asc) t", [appointment_id]
      );
      
      res.json(getFollowUps.rows[0].array_to_json);
    }
    else{
      const appointmentDetail = await pool.query(
        'select * from appointments where appointment_id = $1', [appointment_id]
      );

      res.json(appointmentDetail.rows);
    }
    
  } catch (err) {
    console.error(err.message);
  }
}

//get appointments
const getAppointments = async(req,res,next) => {

  var {patient_id, doctor_id, doctors_hospital_location_id} = req.params;
  const {status} = req.query;

    if(patient_id == 0){
      patient_id = null;
    }
    if(doctor_id == 0){
      doctor_id = null;
    }
    if(doctors_hospital_location_id == 0){
      doctors_hospital_location_id = null;
    }

    try {
      if(req.query.status === 'upcoming'){
        const getUpcomingAppointments = await pool.query(
		 "select array_to_json(coalesce(array_agg(row_to_json(t)) filter (where row_to_json(t) is not null), '{}')) from (select appointment_id, parent_appointment_id, date_time::timestamptz as date_time, appointment_status, appointment_type, (select row_to_json(d) from ( select doctor_id, name, specialization, appointment_type as doctor_appointment_type, image,(select row_to_json(al) from ( select hospital_id, doctor_id, start_time, end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where appointments.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id ) al) as appointment_location from doctor where doctor.doctor_id = appointments.doctor_id) d) as doctorinfo, (select row_to_json(p) from ( select patient_id, name from patient where patient.patient_id = appointments.patient_id) p) as patientinfo from appointments where ($1::int is null or patient_id = $1) and ($2::int is null or doctor_id = $2) and ($3::int is null or doctors_hospital_location_id = $3)  AND appointment_status = 'upcoming' ORDER BY date_time asc) t", [patient_id, doctor_id, doctors_hospital_location_id]
          );
          res.json(getUpcomingAppointments.rows[0].array_to_json);
       }
       else if(req.query.status === 'completed'){
        const getCompleteAppointments = await pool.query(
		 "select array_to_json(coalesce(array_agg(row_to_json(t)) filter (where row_to_json(t) is not null), '{}')) from (select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment, a.doctors_note, a.appointment_status,  (select row_to_json(appdata) from (select (select array_to_json(array_agg(row_to_json(pres))) from (  select medicines.name as medicine_name from medicines inner join prescription on prescription.medicine_id = medicines.medicine_id where prescription.appointment_id = a.appointment_id ) pres) as prescription,    (select array_to_json(array_agg(row_to_json(test))) from (  select medical_test.name as test_name from medical_test inner join appointment_medical_test on medical_test.test_id = appointment_medical_test.test_id where appointment_medical_test.appointment_id = a.appointment_id ) test) as tests    ) appdata) as appointment_data , (select row_to_json(d) from ( select doctor_id, name, specialization, image,(select row_to_json(al) from ( select hospital_id, doctor_id,  CAST(start_time::time with time zone as varchar(5)) as start_time, CAST(end_time::time with time zone as varchar(5)) as end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where         a.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id   ) al) as appointment_location from doctor where doctor.doctor_id = a.doctor_id) d) as doctorinfo,  (select row_to_json(p) from ( select patient_id, name from patient where patient.patient_id = a.patient_id) p) as patientinfo  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where ($1::int is null or a.patient_id = $1)  and ($2::int is null or a.doctor_id = $2) and ($3::int is null or a.doctors_hospital_location_id = $3)AND a.appointment_status = 'completed' ORDER BY a.date_time asc) t", [patient_id,doctor_id, doctors_hospital_location_id]
        );
        res.json(getCompleteAppointments.rows[0].array_to_json);
       }
      else{
        const getAppointments = await pool.query(
          'select * from appointments where ($1::int is null or patient_id = $1) and ($2::int is null or doctor_id = $2) and ($3::int is null or doctors_hospital_location_id = $3) and appointment_status != $4', [patient_id, doctor_id,doctors_hospital_location_id, 'canceled']
        );
        res.json(getAppointments.rows);
      }
    } catch (err) {
      console.error(err.message);
    }
}

// get all comments by appointment_id
const getComments = async(req, res, next) => {

  const {appointment_id} = req.params;
  if (!appointment_id || appointment_id == 0){
      next(ApiError.notFound('appointment_id must not be null or 0'));
      return;
  }

  try {
    const comments = await pool.query(

        "select ac.appointment_id, (select date_time from appointments where appointment_id = $1) as date_time_of_appointment, (select row_to_json(noc) from(select count(*) from comments where appointment_id = $1) noc) as no_of_comments, (select array_to_json(array_agg(row_to_json(cinfo))) from(select c.comment_id, c.doctor_id, (select row_to_json(di) from( select name, image from doctor where doctor_id = c.doctor_id) di) as doctor_info, c.patient_id, (select row_to_json(pi) from( select name, image from patient where patient_id = c.patient_id) pi) as patient_info, c.date_time_of_comment, c.comment, age(now(), c.date_time_of_comment) as age_of_comment from comments c where c.appointment_id = $1) cinfo) as comments from comments ac where ac.appointment_id = $1 limit 1",[appointment_id]
    );

        res.json(comments.rows);
  } catch (err) {
    console.error(err.message);
  }
}

// insert a new comment
const insertComment = async(req, res, next) => {

  const {appointment_id, patient_id, doctor_id} = req.params;
  const {comment} = req.body;

  if (!appointment_id || appointment_id == 0 ){
    next(ApiError.notFound('appointment_id must not be null or 0'));
    return;
  }
  if (doctor_id == 0 && patient_id == 0){
    next(ApiError.notFound("doctor_id and patient_id can't be 0 at a time"));
    return;
  }
  if (patient_id > 0 && doctor_id > 0){
    next(ApiError.notFound("patient_id and doctor_id can't be greater then 0 at a time"));
    return;
  }
  if (!comment){
    next(ApiError.notFound("comment value can't be null"));
    return;
}

  try {
    const insertComment = await pool.query(

        "insert into comments(appointment_id, doctor_id, patient_id, date_time_of_comment, comment) values($1, $2, $3, $4, $5)", [appointment_id, doctor_id, patient_id, 'NOW()', comment]
    );

        res.json("Comment inserted successfully");
  } catch (err) {
    console.error(err.message);
  }
}



 ////Appointment Screen APIs (web)////

// List all appointments of a doctor by selected date
const doctors_getAppointments_byDate = async (req, res,next) => {
  var {patient_id,doctor_id,doctors_hospital_location_id} = req.params;
  const {selected_date} = req.query;

  if(patient_id == 0){
    patient_id = null;
  }
  if(doctor_id == 0){
    doctor_id = null;
  }
  if(doctors_hospital_location_id == 0){
    doctors_hospital_location_id = null;
  }

  try {
    const doctors_getAppointments_byDate = await pool.query(
      "SELECT appointment_id,parent_appointment_id,(select row_to_json(p) from (select patient_id,name,gender,dob,image from patient WHERE patient.patient_id = appointments.patient_id) p) as patient,doctor_id,date_time,doctors_note,appointment_status, appointment_type,doctors_hospital_location_id,(select row_to_json(al) from (select hospital_id,start_time::time with time zone as start_time,end_time::time with time zone as end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where appointments.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id) al) as appointment_location from appointments where ($1::int is null or patient_id = $1) and ($2::int is null or doctor_id = $2) and ($3::int is null or doctors_hospital_location_id = $3) and date_time::date = $4 ORDER BY date_time::time desc", [patient_id, doctor_id,doctors_hospital_location_id,selected_date]
    );
    res.json(doctors_getAppointments_byDate.rows);
  } catch (err) {
      console.error(err.message);
  }
}

//change Appointment status by appointment_id
const doctors_updateAppointments_status = async(req, res, next) => {
    
  const appointment_id = parseInt(req.params.appointment_id);
  const {appointment_status} = req.query;

  if (!appointment_id || appointment_id == 0){
      next(ApiError.notFound('appointment_id must not be null or 0'));
  }

  try {
    const doctors_updateAppointments_status = await pool.query(
        'UPDATE appointments SET appointment_status = $1 WHERE appointment_id = $2', [appointment_status,appointment_id]);  
        res.json("Appointment cancelled successfully");
  } catch (err) {
    console.error(err.message);
  }
} 

//get symtoms
const getSymtoms = async (request, response) => {
  const symtomsCharacter = request.query.character;

  try {
    if(symtomsCharacter != null){

    const getSymtoms = await pool.query(
      "SELECT symtoms_id as id ,name FROM symtoms WHERE lower(name) LIKE lower('%' || $1 || '%') AND verify = 't' ", [symtomsCharacter]);
        response.json(getSymtoms.rows);
    }
    else{
      const getSymtoms = await pool.query(
        "SELECT symtoms_id as id,name FROM symtoms");
          response.json(getSymtoms.rows);
      }
  } catch (err) {
    console.error(err.message);
  }
}

//set appointment symtoms
const setAppointmentSymtoms = async (request, response,next) => {
  const appointment_id = parseInt(request.params.appointment_id);
  const {symtoms_name} = request.body;

  if (!symtoms_name) {
    next(ApiError.notFound('Symtoms_name field is required and must not be Null'));
    return;
  }
  try {

    const setAppointmentSymtoms = await pool.query(
        'INSERT INTO appointment_symtoms(appointment_id,symtoms_id)VALUES($1,(SELECT symtoms.symtoms_id FROM symtoms WHERE symtoms.name = $2))',[appointment_id,symtoms_name]);

     const getAllSymtoms = await pool.query(
      'SELECT symtoms.symtoms_id as id,symtoms.name as name FROM symtoms INNER JOIN appointment_symtoms ON appointment_symtoms.symtoms_id = symtoms.symtoms_id WHERE appointment_id = $1', [appointment_id]);

      response.json(getAllSymtoms.rows);
  } catch (err) {
    console.error(err.message);
  }
}

//add symtom in symtom's table
const addSymtoms = async (request, response,next) => {
  const {symtoms_name,symtoms_type} = request.body;

  try {

    const addSymtoms = await pool.query(
        'INSERT INTO symtoms (name, symtom_type,verify)VALUES($1,$2,$3)',[symtoms_name,symtoms_type,'false']);

        response.json("Symptom successfully Added ");
  } catch (err) {
    console.error(err.message);
  }
}

//delete symptoms from appointment_symtoms by appointment_symtoms_ID
const deleteAppointmentSymptoms = async (request, response,next) => {
  const { appointment_id } = request.params;
  const { symtoms_name } = request.body;

  if (!symtoms_name) {
    next(ApiError.notFound('Symtoms_name field is required and must not be Null'));
    return;
  }
  try {

    const deleteAppointmentSymptoms = await pool.query(
      "DELETE FROM appointment_symtoms WHERE appointment_id = $1 AND symtoms_id = (SELECT symtoms_id FROM symtoms WHERE name = $2)", [appointment_id, symtoms_name]
    );

    response.json("Symptom removed from appointment_symptoms");
  } catch (err) {
    console.error(err.message);
  }
}


// set doctor's note by appointment id
const setDoctorNoteForPatient = async (request, response) => {
  const { appointment_id } = request.params;
  const { doctors_note } = request.body;

  if (!doctors_note) {
    next(ApiError.notFound('doctors_note field is required and must not be Null'));
    return;
  }
  try {

      const doctorNote = await pool.query(
        "UPDATE appointments SET doctors_note = $1 WHERE appointment_id = $2", [doctors_note, appointment_id]
      );

      response.json( "Doctor's Note Updated");
  } catch (err) {
    console.error(err.message);
  }
}

//get diagnosis
const getDiagnosis = async (request, response) => {
  const diagnosisCharacter = request.query.character;

	try {
    if(diagnosisCharacter != null){

      const getDiagnosis = await pool.query(
        "SELECT diagnosis_id, name FROM diagnosis WHERE lower(name) LIKE lower( '%' || $1 || '%')", [diagnosisCharacter]);
          response.json(getDiagnosis.rows);
      }
      else{
        const getDiagnosis = await pool.query(
          "SELECT diagnosis_id, name FROM diagnosis", [diagnosisCharacter]);
            response.json(getDiagnosis.rows);
        }
  } catch (err) {
    console.error(err.message);
  }
}

// set appointment_diagnosis
const setAppointmentDiagnosis = async (request, response) => {
  const {appointment_id} = request.params;
  const {diagnosis_name} = request.body;

  if (!diagnosis_name) {
    next(ApiError.notFound('diagnosis_name field is required and must not be Null'));
    return;
  }
  try {

    const setAppointmentDiagnosis = await pool.query(
      "INSERT INTO appointment_diagnosis(appointment_id, diagnosis_id) VALUES($1, (SELECT diagnosis_id FROM diagnosis WHERE name = $2))", [appointment_id, diagnosis_name]
    );
    const getDiagnosisByAID = await pool.query(
      "SELECT diagnosis.diagnosis_id as id, diagnosis.name as name FROM diagnosis INNER JOIN appointment_diagnosis ON appointment_diagnosis.diagnosis_id = diagnosis.diagnosis_id WHERE appointment_id = $1", [appointment_id]
    );

    response.json(getDiagnosisByAID.rows);
  } catch (err) {
    console.error(err.message);
  }
}

// unlist diagnosis from appointment_diagnosis by appointment ID
const unlistDiagnosisByAppointmentID = async (request, response) => {
  const { appointment_id } = request.params;
  const { diagnosis_name } = request.body;
  if (!diagnosis_name) {
    next(ApiError.notFound('diagnosis_name field is required and must not be Null'));
    return;
  }
  try {

    const unlistDiagnosisByAID = await pool.query(
      "DELETE FROM appointment_diagnosis WHERE appointment_id = $1 AND diagnosis_id = (SELECT diagnosis_id FROM diagnosis WHERE name = $2)", [appointment_id, diagnosis_name]
    );

    response.json("Diagnosis removed from appointment_diagnosis");
  } catch (err) {
    console.error(err.message);
  }
}

//get test
const getTest = async (request, response) => {
  const testCharacter = request.query.character;

	try {
    if(testCharacter != null){

      const getTest = await pool.query(
        "SELECT test_id as id, name,price_in_pkr as price FROM medical_test WHERE lower(name) LIKE lower( '%' || $1 || '%')", [testCharacter]);
          response.json(getTest.rows);
      }
      else{
        const getTest = await pool.query(
          "SELECT test_id as id, name FROM medical_test", [testCharacter]);
            response.json(getTest.rows);
        }
        response.json(getTest.rows);
  } catch (err) {
    console.error(err.message);
  }
}

//set appointment test
const setAppointmentTests = async (request, response) => {
   const { appointment_id,patient_id } = request.params;
  const {test_name} = request.body;

  if (!test_name) {
    next(ApiError.notFound('test_name field is required and must not be Null'));
    return;
  }
  try {

    const setAppointmentTests = await pool.query(
        'INSERT INTO appointment_medical_test(appointment_id,patient_id,test_id) VALUES ($1,$2,(SELECT medical_test.test_id FROM medical_test WHERE medical_test.name = $3))',[appointment_id,patient_id,test_name]);

    const getAllTestByAppointmentId = await pool.query(
          'SELECT medical_test.test_id,medical_test.name, medical_test.price_in_pkr, mt.test_result FROM medical_test INNER JOIN appointment_medical_test mt ON mt.test_id = medical_test.test_id WHERE appointment_id = $1', [appointment_id]);
        response.json(getAllTestByAppointmentId.rows);
  } catch (err) {
    console.error(err.message);
  }
}

// unlist test from appointment_medical_test by appointment ID
const unlistTestByAppointmentID = async (request, response) => {
  const { appointment_id } = request.params;
  const { test_name } = request.body;
  if (!test_name) {
    next(ApiError.notFound('test_name field is required and must not be Null'));
    return;
  }
  try {

    const unlistTestByAppointmentID = await pool.query(
      "DELETE FROM appointment_medical_test WHERE appointment_id = $1 AND test_id = (SELECT test_id FROM medical_test WHERE name = $2)", [appointment_id, test_name]
    );

    response.json("Test removed from appointment_medical_test");
  } catch (err) {
    console.error(err.message);
  }
}

//get medicines by character
const getPrescription = async (request, response) => {
  const PrescriptionCharacter = request.query.character;
  try {
    if(PrescriptionCharacter != null){

      const getPrescription = await pool.query(
        "SELECT medicine_id as id,name,price FROM medicines WHERE lower(name) LIKE lower( '%' || $1 || '%')", [PrescriptionCharacter]);
          response.json(getPrescription.rows);
      }
      else{
        const getPrescription = await pool.query(
          "SELECT medicine_id as id,name FROM medicines", [PrescriptionCharacter]);
            response.json(getPrescription.rows);
        }
        response.json(getPrescription.rows);
  } catch (err) {
    console.error(err.message);
  }
}

//set prescription
const setPrescription = async (request, response) => {
  const appointment_id = parseInt(request.params.appointment_id) ;
  const {medicine_name,days,quantity,frequency} = request.body;

  if (!medicine_name,!days,!quantity,!frequency) {
    next(ApiError.notFound('All field are required and must not be Null'));
    return;
  }
	try {

    const setPrescription = await pool.query(
        'INSERT INTO prescription (appointment_id,medicine_id,days,quantity,frequency) VALUES ($1,(SELECT medicine_id FROM medicines WHERE name = $2),$3,$4,$5)',[appointment_id,medicine_name,days,quantity,frequency]);

    const getAllPrescriptionByAppointmentId = await pool.query(
          'SELECT m.medicine_id,m.name,m.medicine_type,m.price,m.amountingrams, p.days,p.quantity,p.frequency from medicines m INNER JOIN prescription p ON p.medicine_id = m.medicine_id WHERE appointment_id = $1', [appointment_id]);
          response.json(getAllPrescriptionByAppointmentId.rows);

  } catch (err) {
    console.error(err.message);
  }
}

//delete prescription
const unlistPrescriptionFromAppointment = async (request, response) => {
  const { appointment_id } = request.params;
  const { medicine_name } = request.body;
  if (!medicine_name) {
    next(ApiError.notFound('medicine_name field is required and must not be Null'));
    return;
  }
  try {
    const unlistPrescriptionFromAppointment = await pool.query(
        'DELETE FROM prescription WHERE appointment_id = $1 AND medicine_id = (SELECT medicine_id FROM medicines WHERE name = $2)', [appointment_id, medicine_name]
        );

        response.json("Medicine removed from Prescription");
  } catch (err) {
    console.error(err.message);
  }
}


// set followUp
const setFollowUp = async (req, res) => {
  const {appointment_id,doctors_hospital_location_id} = req.params;
  const {date_by_doc, time_by_doc, appointment_type} = req.body;

  if (appointment_id == 0 || doctors_hospital_location_id == 0) {
    next(ApiError.notFound('appointment_id and location_id can not be null'));
    return;
  }
  if (!date_by_doc || !time_by_doc || !appointment_type) {
    next(ApiError.notFound('date, time and appointment_type can not be Null'));
    return;
  }

  try {
   
    const followUp = await pool.query(
      "INSERT INTO appointments(parent_appointment_id,patient_id, doctor_id,date_time, doctors_note, appointment_status,doctors_hospital_location_id, appointment_type) VALUES((SELECT DISTINCT parent_appointment_id from appointments where appointment_id = $1),(SELECT DISTINCT patient_id from appointments where appointment_id = $1),(SELECT DISTINCT doctor_id from appointments where appointment_id = $1),$2::date + $3::time,(SELECT  doctors_note from appointments where appointment_id = $1),(SELECT  appointment_status from appointments where appointment_id = $1),$4, $5)", [ appointment_id,date_by_doc, time_by_doc,doctors_hospital_location_id, appointment_type]
      );
      
      res.json("Follow Up inserted Successfully!");
  } catch (err) {
      console.error(err.message);
  }
}

// doctor's appointment list
const getAppointmentslist = async(req,res,next) => {

  var {patient_id, doctor_id, doctors_hospital_location_id} = req.params;

    if(patient_id == 0){
      patient_id = null;
    }
    if(doctor_id == 0){
      doctor_id = null;
    }
    if(doctors_hospital_location_id == 0){
      doctors_hospital_location_id = null;
    }

    try {
        const getAppointmentslist = await pool.query(
         "select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment,a.appointment_status, (select row_to_json(p) from ( select patient_id, name, dob,gender,image from patient where patient.patient_id = a.patient_id) p) as patientinfo  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where ($1::int is null or a.patient_id = $1)  and ($2::int is null or a.doctor_id = $2) and ($3::int is null or a.doctors_hospital_location_id = $3) AND a.appointment_status = 'completed'", [patient_id,doctor_id,doctors_hospital_location_id]);
        res.json(getAppointmentslist.rows);
    } catch (err) {
      console.error(err.message);
    }
}


//get appointments history
const getAppointmentsHistory = async(req,res,next) => {

  var {patient_id, doctor_id, doctors_hospital_location_id,appointment_id} = req.params;
  const {status} = req.query;

    if(patient_id == 0){
      patient_id = null;
    }
    if(doctor_id == 0){
      doctor_id = null;
    }
    if(doctors_hospital_location_id == 0){
      doctors_hospital_location_id = null;
    }
    if(appointment_id == 0){
      appointment_id = null;
    }
    try {
        const getCompleteAppointments = await pool.query(
         "select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment, a.doctors_note, a.appointment_status, a.appointment_type,(select row_to_json(appdata) from (select (select array_to_json(array_agg(row_to_json(sym))) from (select symtoms.symtoms_id as id,symtoms.name as name from symtoms inner join appointment_symtoms on appointment_symtoms.symtoms_id = symtoms.symtoms_id where appointment_symtoms.appointment_id = a.appointment_id ) sym) as symtoms,(select array_to_json(array_agg(row_to_json(pres))) from (select medicines.medicine_id as id,medicines.name,price,amountingrams,prescription.days,prescription.quantity,prescription.frequency from medicines inner join prescription on prescription.medicine_id = medicines.medicine_id where prescription.appointment_id = a.appointment_id )pres) as prescription,(select array_to_json(array_agg(row_to_json(diag))) from (select diagnosis.diagnosis_id as id,diagnosis.name as name from diagnosis inner join appointment_diagnosis on appointment_diagnosis.diagnosis_id = diagnosis.diagnosis_id where appointment_diagnosis.appointment_id = a.appointment_id )diag) as diagnosis, (select array_to_json(array_agg(row_to_json(test))) from ( select medical_test.test_id as id,medical_test.name ,price_in_pkr, appointment_medical_test.test_result from medical_test inner join appointment_medical_test on medical_test.test_id = appointment_medical_test.test_id where appointment_medical_test.appointment_id = a.appointment_id ) test) as tests) appdata) as appointment_data , (select row_to_json(d) from ( select doctor_id, name, specialization,(select row_to_json(al) from (select hospital_id,start_time::time with time zone as start_time, end_time::time with time zone as end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where  a.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id   ) al) as appointment_location from doctor where doctor.doctor_id = a.doctor_id) d) as doctorinfo,  (select row_to_json(p) from ( select patient_id, name, dob,gender,image from patient where patient.patient_id = a.patient_id) p) as patientinfo  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where ($1::int is null or a.patient_id = $1)  and ($2::int is null or a.doctor_id = $2) and ($3::int is null or a.doctors_hospital_location_id = $3) and ($5::int is null or a.appointment_id = $5) AND a.appointment_status = $4 ", [patient_id,doctor_id,doctors_hospital_location_id,status,appointment_id]);
        res.json(getCompleteAppointments.rows);
    } catch (err) {
      console.error(err.message);
    }
}

//get completed appointments
const getCompletedAppointments = async(req,res,next) => {

  var {patient_id, doctor_id, doctors_hospital_location_id} = req.params;

    if(patient_id == 0){
      patient_id = null;
    }
    if(doctor_id == 0){
      doctor_id = null;
    }
    if(doctors_hospital_location_id == 0){
      doctors_hospital_location_id = null;
    }

    try {
        const getCompletedAppointments = await pool.query(
         "select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment, a.doctors_note, a.appointment_status,  (select row_to_json(appdata) from (select (select array_to_json(array_agg(row_to_json(pres))) from (  select medicines.medicine_id as id, medicines.name as medicine_name from medicines inner join prescription on prescription.medicine_id = medicines.medicine_id where prescription.appointment_id = a.appointment_id ) pres) as prescription,(select array_to_json(array_agg(row_to_json(test))) from (select medical_test.test_id as id,medical_test.name as test_name from medical_test inner join appointment_medical_test on medical_test.test_id = appointment_medical_test.test_id where appointment_medical_test.appointment_id = a.appointment_id ) test) as tests) appdata) as appointment_data , (select row_to_json(d) from ( select doctor_id, name, specialization, image,(select row_to_json(al) from ( select hospital_id, doctor_id,  CAST(start_time::time with time zone as varchar(5)) as start_time, CAST(end_time::time with time zone as varchar(5)) as end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where a.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id) al) as appointment_location from doctor where doctor.doctor_id = a.doctor_id) d) as doctorinfo,  (select row_to_json(p) from ( select patient_id, name from patient where patient.patient_id = a.patient_id) p) as patientinfo  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where ($1::int is null or a.patient_id = $1)  and ($2::int is null or a.doctor_id = $2) and ($3::int is null or a.doctors_hospital_location_id = $3)AND a.appointment_status = 'completed'", [patient_id,doctor_id, doctors_hospital_location_id]
        );
        res.json(getCompletedAppointments.rows);
    } catch (err) {
      console.error(err.message);
    }
}

// add a new vital by patient_id
const addVitals = async (req,res,next) => {
  const {patient_id, vital_id,doctor_id} = req.params;
  const {new_value} = req.body;

  try {
    const updateVitals = await pool.query(

     "insert into patient_vitals values($1, $2, $3, $4, $5)", [vital_id, patient_id, doctor_id , new_value, 'NOW()']

    );

    res.json("Vital added successfully");
  } catch (err) {
      console.error(err.message);
  }
}

// get current day's appointment stats of a doctor
const appointmentsStats = async (req,res,next) => {
  const {doctor_id} = req.params;
  if(doctor_id == 0){
    next(ApiError.notFound('doctor_id can not be 0'));
    return;
  }
  try {
    const appointmentStats = await pool.query(
      "select a.doctor_id, a.date_time::date as today,(select row_to_json(astats) from(select(select row_to_json(g1) from(select (select count(*) as total_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1),(select count(*) as completed_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_status IN ('completed', 'canceled')),(select count(*) as remaining_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_status IN ('upcoming', 'inprogress')))g1)as graph_one, (select row_to_json(g2) from(select (select count(*) as canceled_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_status = 'canceled'),(select count(*) as showed_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_status = 'completed'))g2)as graph_two, (select row_to_json(g3) from(select (select count(*) as new_appointments from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_id = parent_appointment_id), (select count(*) as followups from appointments where date_time::date = NOW()::date and doctor_id = $1 and appointment_id != parent_appointment_id))g3)as graph_three) astats) as appointment_stats, (select row_to_json(cp) from(select ca.appointment_id, ca.doctor_id, ca.date_time,ca.patient_id, (select row_to_json(cap) from(select p.patient_id, p.name, p.dob, p.gender, p.image from patient p where p.patient_id = ca.patient_id) cap)as patient_info from appointments ca where ca.appointment_status='inprogress' and ca.date_time::date = NOW()::date and ca.doctor_id = $1 ) cp)as current_patient, (select row_to_json(np) from(select na.appointment_id, na.doctor_id, na.date_time, na.patient_id, (select row_to_json(nap) from(select p1.patient_id, p1.name, p1.dob, p1.gender, p1.image from patient p1 where p1.patient_id = na.patient_id) nap)as patient_info from appointments na where na.appointment_status='upcoming' and na.date_time::date = NOW()::date and na.doctor_id = $1 order by date_time asc limit 1) np)as next_patient from appointments a where a.date_time::date = NOW()::date and a.doctor_id = $1 limit 1", [doctor_id]
      );
    
      res.json(appointmentStats.rows);
  } catch (err) {
      console.error(err.message);
  }
}

// get current day's appointment queue of a doctor
const appointmentsQueue = async (req,res,next) => {
  const {doctor_id} = req.params;
  if(doctor_id == 0){
    next(ApiError.notFound('doctor_id can not be 0'));
    return;
  }
  try {
    const appointmentsQueue = await pool.query(
      "select a.doctor_id, (select array_to_json(array_agg(row_to_json(queue))) from(select a.appointment_id, a.doctor_id, a.date_time as appointment_date_time, a.patient_id, (select row_to_json(pi) from(select p.patient_id, p.name, p.dob, p.gender, p.image from patient p where p.patient_id = a.patient_id) pi)as patient_info from appointments a where a.appointment_status='upcoming' and a.date_time::date = NOW()::date and a.doctor_id = $1 order by date_time asc ) queue)as patients_appointments_queue from appointments a where a.date_time::date = NOW()::date and a.doctor_id = $1 limit 1", [doctor_id]
      );
      res.json(appointmentsQueue.rows);
  } catch (err) {
      console.error(err.message);
  }
}


module.exports = {
    setAppointmentByPatientId,
    cancelAppointmentByAppointmentId,
    rescheduleAppointment,
    getAppointmentDetail,
    getAppointments,
    getComments,
    insertComment,
    doctors_getAppointments_byDate,
    doctors_updateAppointments_status,
    getSymtoms,
    setAppointmentSymtoms,
    addSymtoms,
    deleteAppointmentSymptoms,
    setDoctorNoteForPatient,
    getDiagnosis,
    setAppointmentDiagnosis,
    unlistDiagnosisByAppointmentID,
    getTest,
    setAppointmentTests,
    unlistTestByAppointmentID,
    getPrescription,
    setPrescription,
    unlistPrescriptionFromAppointment,
    setFollowUp,
    getAppointmentsHistory,
    getCompletedAppointments,
    getAppointmentslist,
    addVitals,
    appointmentsStats,
    appointmentsQueue,
}
