const pool = require('./db');
const ApiError = require('./error/ApiError');

//for files/images
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require('path');

////Appointment Screen APIs (web)////

//get name,gender,BG,DOB of patient by id
const patients_profile_info = async (request, response,next) => {
    var patient_id = parseInt(request.params.patient_id); 

     if(patient_id == 0){
      patient_id = null;
    }

    try {
      const patients_profile_info = await pool.query(
          'SELECT patient_id, name,gender, blood_group, dob, image FROM patient WHERE  ($1::int is null or patient_id = $1)', [patient_id]);  
          response.json(patients_profile_info.rows);
    } catch (err) {
      console.error(err.message);
    }
  } 
  
  //get history of patient by id
  const patients_profile_history = async (request, response,next) => {
    const { patient_id } = request.params;
    
    if (patient_id == 0 || !patient_id) {
        next(ApiError.notFound('patient_id can not be 0'));
        return;
    }
    try {
      const patients_profile_history = await pool.query(
          "select a.appointment_id, a.date_time::timestamptz as date_time_of_appointment, a.parent_appointment_id, p.date_time::timestamptz as date_time_of_parent_appointment, a.doctors_note, a.appointment_status,(select row_to_json(appdata) from (select (select array_to_json(array_agg(row_to_json(sym))) from (select symtoms.name as symtoms from symtoms inner join appointment_symtoms on appointment_symtoms.symtoms_id = symtoms.symtoms_id where appointment_symtoms.appointment_id = a.appointment_id ) sym) as symtoms, (select array_to_json(array_agg(row_to_json(test))) from ( select medical_test.name as test_name from medical_test inner join appointment_medical_test on medical_test.test_id = appointment_medical_test.test_id where appointment_medical_test.appointment_id = a.appointment_id ) test) as tests) appdata) as appointment_data , (select row_to_json(d) from ( select doctor_id, name, specialization,(select row_to_json(al) from (select hospital_id,start_time::time with time zone as start_time,end_time::time with time zone as end_time, days, (select location from hospital_location where hospital_id = doctors_hospital_location.hospital_id) as appointment_location_of_doctor from doctors_hospital_location where  a.doctors_hospital_location_id = doctors_hospital_location.doctors_hospital_location_id) al) as appointment_location from doctor where doctor.doctor_id = a.doctor_id) d) as doctorinfo,(select row_to_json(p) from ( select patient_id, name, dob,gender,image from patient where patient.patient_id = a.patient_id) p) as patientinfo  from appointments a inner join appointments p on p.appointment_id = a.parent_appointment_id where a.patient_id = $1 AND a.appointment_status = 'completed' ORDER BY a.date_time desc LIMIT 1", [patient_id]);  
          response.json(patients_profile_history.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

//get all patients of doctors
const getAllpatients = async (request, response,next) => {
  const { doctor_id } = request.params;

  if (doctor_id == 0 || !doctor_id) {
      next(ApiError.notFound('doctor_id can not be 0'));
      return;
  }
  try {
    const getAllpatients = await pool.query(
        "select acs.doctor_id, acs.is_access, (select row_to_json(pt) from (select p.patient_id,p.name, p.gender,p.image,p.contact_no,appointments.date_time from patient p inner join appointments on appointments.patient_id = p.patient_id and appointments.doctor_id = acs.doctor_id where p.patient_id = acs.patient_id ORDER BY appointments.date_time desc LIMIT 1) pt) as patientinfo from access acs WHERE doctor_id = $1", [doctor_id]);
        response.json(getAllpatients.rows);
  } catch (err) {
    console.error(err.message);
  }
}

const updatePatientProfile = async (req, res, next) => {

    const {patient_id} = req.params;
    const {name, blood_group, dob, gender} = req.body;

    if (patient_id == 0 || !name || !blood_group || !dob || !gender) {
      next(ApiError.notFound('patient_id can not be 0, all fields are required!'));
      return;
  }
    try {
      const updatePatientProfile = await pool.query(
       "update patient set name = $1, blood_group = $2, dob = $3, gender = $4 where patient_id = $5", [name, blood_group, dob, gender, patient_id]
      );

      res.json("Patient's profile updated successfully!");
    } catch (err) {
      console.error(err.message);
    }
  }



  ////End////
  

//insert a new patient
const newPatient = async (req, res, next) => {

  const {name,gender,dob,blood_group,location, contact_no} = req.body; 
  
  try { 
    const newPatient = await pool.query(
        "INSERT INTO patient(name,gender,dob,blood_group,location,contact_no, family_id)VALUES($1,$2,$3,$4,$5,$6,(select currval('patient_patient_id_seq'::regclass)))",[name,gender,dob,blood_group,location,contact_no]);  
        res.json("New patient inserted successfully");
  } catch (err) {
    console.error(err.message);
  }
} 

// add family member
const addFamilyMember = async (req, res, next) => {

  const {patient_id, family_id} = req.params; 
  const {name, relation, contact_no, gender, dob, blood_group} = req.body; 

  if(!name || !relation || !gender || !dob){
    next(ApiError.notFound("name, relation, gender, dob can't be null"));
    return;
  }

  var relation2 =  '';  // relation of current patient with newly created patient

  // patient_gender is the gender of current patient
  const p_gender = await pool.query("select gender from patient where patient_id = $1", [patient_id]);
  const patient_gender = p_gender.rows[0].gender.toString();

  if (relation === 'brother' || relation === 'sister'){
    if(patient_gender === 'male'){
      relation2 = "brother"; 
    }
    else{
      relation2 = 'sister';
    }
  }

  if (relation === 'mother' || relation === 'father'){
    if(patient_gender === 'male'){
      relation2 = "son"; 
    }
    else{
      relation2 = 'daughter';
    }
  }

  if (relation === 'son' || relation === 'daughter'){
    if(patient_gender === 'male'){
      relation2 = "father"; 
    }
    else{
      relation2 = 'mother';
    }
  }

  if (relation === 'wife' || relation === 'husband'){
    if(patient_gender === 'male'){
      relation2 = "husband"; 
    }
    else{
      relation2 = 'wife';
    }
  }

  try { 
    // adding new patient as recieved in body
    if(contact_no){
      const addNewPatient = await pool.query(
        "INSERT INTO patient(name, gender, dob, contact_no, family_id, blood_group) VALUES($1, $2, $3, $4, (select a.family_id from patient a where a.patient_id = $5), $6) on conflict (name, gender, family_id) do nothing", [name, gender, dob, contact_no, patient_id, blood_group]
      );
    }
    else{
      const addNewPatient = await pool.query(
        "INSERT INTO patient(name, gender, dob, contact_no, family_id, blood_group) VALUES($1, $2, $3, (select contact_no from patient where patient_id = $4), (select a.family_id from patient a where a.patient_id = $4), $5) on conflict (name, gender, family_id) do nothing", [name, gender, dob, patient_id, blood_group]
      );
    }

    // adding relation of newly created patient with current patient as received in body
    const addFamilyMember = await pool.query(
      "INSERT INTO family_member(family_id, name, relation, patient_id) values ((select a.family_id from patient a where a.patient_id = $1), cast($2 as varchar), $3, $1) on conflict (family_id, name, relation, patient_id) do nothing ", [patient_id, name, relation]  
      );  
  
    // adding relation of current patient with newly created patient (smartly)
    const addFamilyMember2 = await pool.query(
        "INSERT INTO family_member(family_id, name, relation, patient_id) values ((select a.family_id from patient a where a.patient_id = $1), (select name from patient where patient_id = $1), $2, (select patient_id from patient where name = $3 and family_id = (select a.family_id from patient a where a.patient_id = $1))) on conflict (family_id, name, relation, patient_id) do nothing", [patient_id, relation2, name]  
        ); 

        res.json("Family member added successfully!");
  } catch (err) {
    console.error(err.message);
  }
} 

// remove family member by family_member_id
const removeFamilyMember = async (req,res) => {
  const {family_member_id} = req.params;

  try {
    const removeFamilyMember = await pool.query(
      "delete from family_member where family_member_id = $1", [family_member_id]
    );
  
    res.json('Family member removed successfully');
    
  } catch (err) {
      console.error(err.message);
  }
  
}

// get patient information
const getPatientInfo = async (req, res) => {

  const {patient_id} = req.params;
  
  try { 
    if(req.params.patient_id == 0){
      const allPatients = await pool.query(
        "select patient_id, name, gender, blood_group, location, image, dob, family_id from patient order by patient_id asc"
      );
      res.json(allPatients.rows);
    }
    else{
    const getPatientInfo = await pool.query( 
"select p.patient_id, p.name, p.gender, p.blood_group, p.location, p.image, p.dob AT TIME ZONE 'UTC' as dob, p.family_id, (select row_to_json(a) from (select(select array_to_json(coalesce(array_agg(row_to_json(b)) filter (where row_to_json(b) is not null), '{}')) from (SELECT fm.family_member_id, fm.family_id, pfm.patient_id as family_member_patient_id, pfm.dob as family_member_dob, fm.name, fm.relation FROM family_member fm join patient pfm on fm.name = pfm.name and fm.family_id = pfm.family_id where fm.family_id = p.family_id EXCEPT SELECT fm1.family_member_id, fm1.family_id, pfm1.patient_id as family_member_patient_id, pfm1.dob as family_member_dob, fm1.name, fm1.relation from family_member fm1 inner join patient pfm1 on fm1.name = pfm1.name and fm1.family_id = pfm1.family_id where fm1.patient_id != $1 and fm1.family_id = p.family_id) b) as family_members, (select array_to_json(coalesce(array_agg(row_to_json(dinfo)) filter (where row_to_json(dinfo) is not null), '{}')) from (select ai.patient_id, ai.doctor_id, (select row_to_json(d) from(select di.doctor_id, di.name, di.image from doctor di where di.doctor_id = ai.doctor_id) d) as doctor_info from access ai where ai.patient_id = $1) dinfo) as allowed_doctors) a) as family_doc_tab, (select array_to_json(coalesce(array_agg(row_to_json(ti)) filter (where row_to_json(ti) is not null), '{}')) from(select amt.patient_id, amt.test_id,(select name from medical_test where test_id = amt.test_id) as test_name, amt.test_date_time, amt.appointment_id,(select date_time from appointments where appointment_id = amt.appointment_id) as appointment_date_time from appointment_medical_test amt where amt.patient_id =$1 ) ti) as test_info_tab from patient p where p.patient_id = $1", [patient_id]
        ); 
        res.json(getPatientInfo.rows);
  }
  } catch (err) {
    console.error(err.message);
  }
} 

// add or remove doctor's access from accessing patient profile
const doctorAccess = async (req,res) => {
  
  const {patient_id, doctor_id} = req.params;
  const {status} = req.query;

  try {
    if(req.query.status === 'true'){ // adding into access list
      await pool.query(
        "INSERT INTO access(patient_id, doctor_id) values($1, $2) on conflict (patient_id, doctor_id) do nothing", [patient_id, doctor_id]
      )
    }
    else{ // remove from access list
      await pool.query(
        "DELETE FROM access WHERE patient_id = $1 and doctor_id = $2", [patient_id, doctor_id]
      )
    }
    
  
    res.json("Successfull");
    
  } catch (err) {
      console.error(err.message);
  }
  
}
 

// get vitals by patient_id
const vitals = async (req, res, next)=>{
  var {patient_id, vital_id} = req.params;


  if(patient_id == 0){
    patient_id = null;
  }
  if(vital_id == 0){
    vital_id = null;
  }
try {
    if(vital_id === null){
      const vitals = await pool.query(
      "select v.vital_id, (select row_to_json(vi) from (select v.name, v.unit, v.normal_range)vi) as vital_info, (select row_to_json(vd) from(select vd.patient_id, vd.vital_id, vd.current_value, vd.date_time from patient_vitals vd where vd.patient_id = $1 and vd.vital_id =  v.vital_id order by vd.date_time desc limit 1) vd)::jsonb as vital_current from vitals v", [patient_id]
      );
      res.json(vitals.rows);
    }
    else{
      const vitals = await pool.query(
        "select distinct pv.patient_id, pv.vital_id,(select row_to_json(vinfo) from(select name,unit,normal_range from vitals where vital_id = pv.vital_id)vinfo)::jsonb as vital_info, (select array_to_json(array_agg(row_to_json(vd))) from(select vd.doctor_id, vd.current_value, vd.date_time from patient_vitals vd where vd.patient_id = $1 and vd.vital_id =  $2 order by vd.date_time desc)vd)::jsonb as vital_data from patient_vitals pv where ($1::int is null or pv.patient_id = $1) and ($2::int is null or pv.vital_id =  $2) ORDER BY pv.vital_id ASC", [patient_id, vital_id]
      );
      res.json(vitals.rows);
    }
  } catch (err) {
      console.error(err.message);
  }
}

// add vital by patient_id
const addVitals = async (req,res,next) => {
  const {patient_id, vital_id} = req.params;
  const {new_value} = req.body;

  try {
    const updateVitals = await pool.query(

 "insert into patient_vitals values($1, $2, $3, $4, $5)", [vital_id, patient_id, 0 , new_value, 'NOW()']
    );

    res.json("Vital added successfully");
  } catch (err) {
      console.error(err.message);
  }
}

// patient image
// connecting to s3 bucket
const s3 = new aws.S3({
	accessKeyId: 'AKIAWNWAADBIDKG3T7WL',
  secretAccessKey: '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',
  region: 'ap-south-1',
	Bucket: 'upload.aibers.health'
});

// image upload function
const patientProfileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'upload.aibers.health/uploads/patientImages',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null,  'patient' + '-' + req.params.patient_id  + path.extname(file.originalname)  )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('image');

// file upload function
const testReportUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'upload.aibers.health/uploads/testReports',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null,  'test_of_a' + req.params.appointment_id + '_p' + req.params.patient_id + '_t' + req.params.test_id + path.extname(file.originalname)  )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('file');

// checking file type
function checkFileType( file, cb ){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|pdf|doc/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: images/fies Only!' );
	}
}

// uploading patient's image API function
const uploadPatientProfileImage = async (req, res) => {

  patientProfileImgUpload( req, res, ( error ) =>{
    const {patient_id} = req.params;
    
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No Image Selected!' );
				res.json( 'Error: No Image Selected' );
			} else {
				// If Success
				imageName = req.file.key;
        pool.query('UPDATE patient SET image = $1 WHERE patient_id = $2',[imageName, patient_id]);
        res.json("Image uploded successfully!");
			}
		}
  });
  } 

  // uploading test reports API function
  const uploadTestResult = async (req, res) => {

    testReportUpload( req, res, ( error ) =>{
      const {patient_id, appointment_id, test_id} = req.params;
      
      if( error ){
        console.log( 'errors', error );
        res.json( { error: error } );
      } else {
        // If File not found
        if( req.file === undefined ){
          console.log( 'Error: No File Selected!' );
          res.json( 'Error: No File Selected' );
        } else {
          // If Success
          imageName = req.file.key;
          pool.query('INSERT INTO appointment_medical_test values($1, $2, $3, $4, $5) on conflict(appointment_id, patient_id, test_id) do nothing',[appointment_id, patient_id, test_id, imageName , 'NOW()']);
          res.json("File uploded successfully!");
        }
      }
    });
    }


// getting image from private s3 
const getPatientProfileImage = async (req, res) => {
  const { patient_id } = req.params;

  try {
    const image = await pool.query(
        "select image from patient where patient_id = $1", [patient_id]);  
        var img = image.rows[0].image.toString();

async function getImage(){
    const data =  s3.getObject(
      {
          Bucket: 'upload.aibers.health/uploads/patientImages',
          Key: img
        } 
    ).promise();
    return data;
  }

getImage()
  .then((data)=>{
      let image="data:image;base64";
      let encoded = encode(data.Body);
    res.json({
      "fileType": "image",
      "fileHeader": image,
      "encodedData": encoded
    })
  }).catch((e)=>{
    res.send(e)
  })
function encode(data){
      let buf = Buffer.from(data);
      let base64 = buf.toString('base64');
      return base64
  }
} catch (err) {
  console.error(err.message);
}
}

// getting test report from s3 
const getTestResult = async (req, res) => {
  const { patient_id, appointment_id, test_id } = req.params;

  try {
    const image = await pool.query(
        "select test_result from appointment_medical_test where appointment_id = $1 and patient_id = $2 and test_id = $3", [appointment_id, patient_id, test_id]);  
        var result = image.rows[0].test_result.toString();

        var options = {
            Bucket    : 'upload.aibers.health/uploads/testReports',
            Key    : result
        };
    
        res.attachment(result);
        var fileStream = s3.getObject(options).createReadStream();
        fileStream.pipe(res);

} catch (err) {
  console.error(err.message);
}
}

//get patient id by contact no
const patientLogin = async (req, res) => {
  let contact_no = req.params.contact_no;
  try {
    const patientLogin = await pool.query(
      'SELECT patient_id FROM patient WHERE contact_no = $1', [contact_no]);
     res.json(patientLogin.rows);
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
    patients_profile_info,
    patients_profile_history,
    getAllpatients,
    updatePatientProfile,
    newPatient,
    addFamilyMember,
    removeFamilyMember,
    getPatientInfo,
    doctorAccess,
    vitals,
    addVitals,
    uploadPatientProfileImage,
    getPatientProfileImage,
    uploadTestResult,
    getTestResult,
    patientLogin,
}
