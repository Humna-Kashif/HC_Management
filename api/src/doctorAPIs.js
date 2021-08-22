const pool = require('./db');
const ApiError = require('./error/ApiError');

//for files/images
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require('path');

// get available time slots
const availableSlots = async(req,res,next) =>{
	
     const { doctor_id, doctors_hospital_location_id } = req.params;
     const { date } = req.body;

     if (!date) {
        next(ApiError.notFound('Date field is missing (:date)'));
     return;
    }
		
    try {
      const availableTimeSlots = await pool.query(

	"select doctor_id, doctors_hospital_location_id, (select array_agg(row_to_json(p)) from (select generate_series(CURRENT_DATE + min(start_time)::time , CURRENT_DATE + max(end_time)::time - '15 minutes'::interval, '15 minutes'::interval)::time as available_time_slot from doctors_hospital_location where doctors_hospital_location_id = $1 and doctor_id = $6 EXCEPT ALL select date_time::time  from appointments where doctor_id = $3 and date_time::date = $4::date and appointment_status = $2 and doctors_hospital_location_id = $8 order by available_time_slot asc) p) as time_slots from doctors_hospital_location where doctors_hospital_location_id = $5 and doctor_id = $7 and hospital_location_status = $9", [doctors_hospital_location_id, 'upcoming', doctor_id, date, doctors_hospital_location_id, doctor_id, doctor_id, doctors_hospital_location_id, 'true']

      );

      res.json(availableTimeSlots.rows);
    } catch (err) {
      console.error(err.message);
    }
  }


// set favourite doctor by patient_id, doctor_id and doctors_hospital_location_id
  const setFavouriteDoctor = async (req, res, next) => {

    const {patient_id, doctor_id, doctors_hospital_location_id} = req.params;

    if (patient_id == 0 || doctor_id == 0 || doctors_hospital_location_id == 0) {
      next(ApiError.notFound('patient_id, doctor_id and location_id should be > 0'));
      return;
    }

    try {
        const setFavouriteDoctor = await pool.query(
            'INSERT INTO favourite_doctor VALUES ($1,$2,$3)', [patient_id, doctor_id, doctors_hospital_location_id]);  
            
            res.json("Successfully added to favourite list");
      } catch (err) {
        // console.error(err.message);
      }
  } 

// remove doctor from favourite list by patient_id, doctor_id and doctors_hospital_location_id
  const deleteFavouriteDoctor = async (req, res, next) => {

    const {patient_id, doctor_id, doctors_hospital_location_id} = req.params;

    if (patient_id == 0 || doctor_id == 0 || doctors_hospital_location_id == 0) {
      next(ApiError.notFound('patient_id, doctor_id and location_id should be > 0'));
      return;
    }

    try {
        
        const deleteFavouriteDoctor = await pool.query(
            'DELETE FROM favourite_doctor WHERE patient_id = $1 and doctor_id = $2 and doctors_hospital_location_id = $3', [patient_id, doctor_id, doctors_hospital_location_id]);  
            
            res.json("Successfully removed from favourite list");
      } catch (err) {
        console.error(err.message);
      }
  }

// get all favourite doctors
  const getFavouriteDoctor = async (req, res, next) => {

    const {patient_id, doctor_id} = req.params;

    if (patient_id == 0) {
      next(ApiError.notFound('patient_id should be > 0'));
      return;
    }

    try {
      console.log(req.params);
      if(req.params.doctor_id != 0){
        const getFavLocationsByPidAndDid = await pool.query(

          'select f.patient_id, f.doctor_id, f.doctors_hospital_location_id as favourite_dhl_id, (select row_to_json(dhlinfo) from(select dhl.hospital_id, hn.location as hospital_name, dhl.days, dhl.start_time, dhl.end_time, dhl.fees from doctors_hospital_location dhl join hospital_location hn on dhl.hospital_id = hn.hospital_id where dhl.doctors_hospital_location_id = f.doctors_hospital_location_id) dhlinfo) as favourite_dhl_info from favourite_doctor f where patient_id = $1 and doctor_id = $2', [patient_id, doctor_id]

        );

        res.json(getFavLocationsByPidAndDid.rows);
      }
      else{ 
        const getFavouriteDoctor = await pool.query( 

            'SELECT f.doctors_hospital_location_id, f.patient_id, f.doctor_id, (select row_to_json(d) from ( select name, specialization, gender, image from doctor where doctor.doctor_id = f.doctor_id ) d) as doctor_info, (select dhl.hospital_id from doctors_hospital_location dhl where f.doctors_hospital_location_id = dhl.doctors_hospital_location_id), (select row_to_json(hl) from(select h.location from hospital_location h where hospital_id = (select dhl.hospital_id from doctors_hospital_location dhl where f.doctors_hospital_location_id = dhl.doctors_hospital_location_id)) hl) as hospital_location_info FROM favourite_doctor f WHERE patient_id = $1', [patient_id]);  
            res.json(getFavouriteDoctor.rows);
        }
      } catch (err) {
        console.error(err.message);
      }
  }

// get doctors
  const getDoctors = async (req, res, next) => {
    const searchterm = req.query.searchterm; 

    try {
        if(req.query.searchterm != null){
          const searchDoctorByName = await pool.query(
            // "SELECT name FROM doctor WHERE lower(name) LIKE lower( '%' || $1 || '%')", [searchterm]
            
            "SELECT dl.doctors_hospital_location_id, dl.doctor_id, (select row_to_json(dinfo) from (select d.doctor_id, d.name,d.specialization,d.gender,d.image from doctor d where d.doctor_id = dl.doctor_id) dinfo) as doctor_info, dl.hospital_id, (select row_to_json(dhl) from(select location from hospital_location where hospital_id = dl.hospital_id) dhl) as hospital_location_info, dl.fees as doctor_fee from doctors_hospital_location dl join doctor d on dl.doctor_id = d.doctor_id where lower(d.name) LIKE lower( '%' || $1 || '%') and dl.hospital_location_status = $2",[searchterm, 'true']
            
            
            );
            res.json(searchDoctorByName.rows);
        }
        else{
          const getAllDoctors = await pool.query(
            'SELECT dl.doctors_hospital_location_id, dl.doctor_id, (select row_to_json(dinfo) from (select name,specialization,gender,image from doctor where doctor_id = dl.doctor_id) dinfo) as doctor_info, dl.hospital_id, (select row_to_json(dhl) from(select location from hospital_location where hospital_id = dl.hospital_id) dhl) as hospital_location_info, dl.fees as doctor_fee from doctors_hospital_location dl where dl.hospital_location_status = $1',['true']
            );  
            res.json(getAllDoctors.rows);
        }
      }catch (err) {
        console.error(err.message);
      }
  }

//HOME SCREEN APIs FOR WEB//

//get doctor id by contact no
const doctors_login = async (req, res) => {
  let contact_no = req.params.contact_no;
  try {
    const doctors_login = await pool.query(
      'SELECT doctor_id from doctor where contact_no = $1', [contact_no]);
     res.json(doctors_login.rows);
  } catch (err) {
    console.error(err.message);
  }
}

//get doctor profile by id
const doctors_profile = async (request, response) => {
  const doctor_id = parseInt(request.params.doctor_id);
    try {
      const doctors_profile = await pool.query(
          " select name,dob,gender,specialization,about,image, appointment_type,(select array_to_json(array_agg(row_to_json(l))) from (select doctors_hospital_location_id, hospital_location_status, start_time,end_time,days,location,fees from doctors_hospital_location, hospital_location where doctors_hospital_location.hospital_id= hospital_location.hospital_id AND doctor_id = doctor.doctor_id) l )as location, (select array_to_json(array_agg(row_to_json(f))) from (select doctor_facility_id, facility from doctor_facilities WHERE doctor.doctor_id = doctor_facilities.doctor_id) f) as facilities,(select array_to_json(array_agg(row_to_json(q))) from (select doctor_qualification_id,qualification from doctor_qualification WHERE doctor.doctor_id = doctor_qualification.doctor_id) q) as qualification from doctor where doctor_id = $1 ", [doctor_id]);
	    
          response.json(doctors_profile.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

// update doctor info by doctor id
const doctors_profile_info = async (request, response,next) => {
  const doctor_id = parseInt(request.params.doctor_id);
  const {name, specialization, about,gender,dob, appointment_type} = request.body;
  if (!name,!specialization,!about,!gender,!dob, !appointment_type) {
    next(ApiError.notFound('All fields are required and must be non blank'));
    return;
  }
  try {
        const doctors_profile_info = await pool.query(
            'UPDATE doctor SET name = $2 , specialization = $3, about = $4,gender = $5,dob = $6, appointment_type = $7 WHERE doctor_id = $1',[doctor_id,name,specialization,about,gender,dob, appointment_type]);
            response.json("Doctor's Info Updated!");
      } catch (err) {
        console.error(err.message);
      }
    }

//set qualification
const doctors_profile_setqualification = async (request, response,next) => {
  const doctor_id = parseInt(request.params.doctor_id);
  const {qualification} = request.body;
    if (!qualification ) {
    next(ApiError.notFound('Qualification field is required and must be non blank'));
    return;
  }
  try {
      const doctors_profile_setqualification = await pool.query(
          'INSERT INTO doctor_qualification (doctor_id, qualification)VALUES($1, $2)',[doctor_id,qualification]);
          response.json("Doctor's Qualification Added!");
    } catch (err) {
      console.error(err.message);
    }
  }

//get qualification
const doctors_profile_getqualification = async (request, response) => {
  const doctor_id = parseInt(request.params.doctor_id);
  try {
      const doctors_profile_getqualification = await pool.query(
          'select doctor_qualification_id, qualification from doctor_qualification INNER JOIN doctor ON doctor.doctor_id = doctor_qualification.doctor_id WHERE doctor.doctor_id = $1',[doctor_id]);
          response.json(doctors_profile_getqualification.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

// update Qualification of doctor by id
const doctors_profile_updatequalification = async (request, response,next) => {
  const { doctor_id, doctor_qualification_id } = request.params;
  const {qualification} = request.body;
   if (!qualification ) {
    next(ApiError.notFound('Qualification field is required and must be non blank'));
    return;
  }
    try {
        const doctors_profile_updatequalification = await pool.query(
            'UPDATE doctor_qualification SET qualification = $2 WHERE doctor_qualification_id = $1 AND doctor_id = $3',[doctor_qualification_id,qualification,doctor_id]);
            response.json("Doctor's Qualification Updated!");
      } catch (err) {
        console.error(err.message);
      }
    }

//delete doctor qualification by doctor qualification id
const doctors_profile_deletequalification = async (request, response) => {
  const { doctor_id, doctor_qualification_id } = request.params;
  try {
         const doctors_profile_deletequalification = await pool.query(
          'DELETE FROM doctor_qualification WHERE doctor_qualification_id = $1 AND doctor_id = $2', [doctor_qualification_id,doctor_id]);
          response.json("Doctor's Qualification Deleted!");
    } catch (err) {
      console.error(err.message);
    }
  }

 //set hospital location
const doctors_profile_setlocation = async (request, response,next) => {
  const {location,start_time,end_time,days,fees} = request.body;
  const doctor_id = parseInt(request.params.doctor_id);
  if (!location,!start_time,!end_time,!days,!fees) {
    next(ApiError.notFound('All fields are required and must be non blank'));
    return;
  }
	try {
        const doctors_profile_setlocation = await pool.query(
            "INSERT INTO doctors_hospital_location (hospital_id,doctor_id, start_time,end_time, days,fees) VALUES((SELECT hospital_location.hospital_id FROM hospital_location WHERE hospital_location.location= $5 ),$1, $2::time,$3::time, $4,$6)",[doctor_id,start_time,end_time, days, location,fees]);
            response.json("Doctor's Location Added!");
      } catch (err) {
        console.error(err.message);
      }
    }

//get hospital location and timing  by doctors_hospital_location_id
const doctors_profile_getHospitalLocation = async (request, response) => {
  const { doctor_id } = request.params;
  try {
      const doctors_profile_getHospitalLocation = await pool.query(
          "select doctors_hospital_location_id,hospital_location_status, start_time::time as start_time, end_time::time as end_time, days, fees, hospital_location.location, doctor_id from doctors_hospital_location inner join hospital_location on hospital_location.hospital_id = doctors_hospital_location.hospital_id where doctor_id = $1 AND  doctors_hospital_location.hospital_location_status = true ", [doctor_id]);
          response.json(doctors_profile_getHospitalLocation.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

 //get location by character
 const doctors_profile_getlocation = async (request, response) => {
  const locationCharacter = request.query.character;
  
  try {
    if(locationCharacter != null){

      const doctors_profile_getlocation = await pool.query(
        "SELECT * FROM hospital_location WHERE lower(location) LIKE lower( '%' || $1 || '%') ",[locationCharacter]);  
          response.json(doctors_profile_getlocation.rows);
      }
      else{
        const doctors_profile_getlocation = await pool.query(
          "SELECT * FROM hospital_location" );  
            response.json(doctors_profile_getlocation.rows);
        }
    } catch (err) {
      console.error(err.message);
    }
  }

// update hospital location  by doctors_hospital_location_id
const doctors_profile_updatelocation = async (request, response) => {
  const { doctor_id, doctors_hospital_location_id } = request.params;
  const {location,start_time,end_time, days,fees} = request.body;
   if (!location,!start_time,!end_time, !days,!fees ) {
    next(ApiError.notFound('location field is required and must be non blank'));
    return;
  }
   try {
        const doctors_profile_updatelocation = await pool.query(
            'UPDATE doctors_hospital_location SET hospital_id = (SELECT hospital_location.hospital_id FROM hospital_location WHERE hospital_location.location= $5), start_time = $2, end_time = $3, days = $4, fees = $7 WHERE doctors_hospital_location_id = $1 AND doctor_id = $6',[doctors_hospital_location_id,start_time,end_time, days,location,doctor_id,fees]);
            response.json("Doctor's Location Updated!");
      } catch (err) {
        console.error(err.message);
      }
    }

//disable location of doctor by id
const doctors_profile_deletelocation = async (request, response) => {
  const { doctor_id, doctors_hospital_location_id } = request.params;	
  try {
      const doctors_profile_deletelocation = await pool.query(
          'UPDATE doctors_hospital_location SET hospital_location_status = $1 WHERE doctors_hospital_location_id = $2 AND doctor_id = $3', ['F',doctors_hospital_location_id,doctor_id]);
          response.json("Doctor's Location Deleted!");
    } catch (err) {
      console.error(err.message);
    }
  }

//set facilities
const doctors_profile_setfacilities = async (request, response,next) => {
  const doctor_id = parseInt(request.params.doctor_id);
  const {facility} = request.body;
  if (!facility ) {
    next(ApiError.notFound('Facility field is required and must be non blank'));
    return;
  }
  try {
      const doctors_profile_setfacilities = await pool.query(
          'INSERT INTO doctor_facilities (doctor_id, facility)VALUES($1, $2)',[doctor_id,facility]);
          response.json("Doctor's Facility Added!");
    } catch (err) {
      console.error(err.message);
    }
  }

 //get facilities
 const doctors_profile_getfacilities = async (request, response) => {
  const doctor_id = parseInt(request.params.doctor_id);
   try {
      const doctors_profile_getfacilities = await pool.query(
          'select doctor_facility_id,facility from doctor_facilities INNER JOIN doctor ON doctor.doctor_id = doctor_facilities.doctor_id WHERE doctor.doctor_id = $1',[doctor_id]);
          response.json(doctors_profile_getfacilities.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

// update facilities of doctor by id
const doctors_profile_updatefacilities = async (request, response,next) => {
  const { doctor_id, doctor_facility_id } = request.params;
  const {facility} = request.body;
  if (!facility ) {
    next(ApiError.notFound('Facility field is required and must be non blank'));
    return;
  } 
  try {
        const doctors_profile_updatefacilities = await pool.query(
            'UPDATE doctor_facilities SET facility = $2 WHERE doctor_facility_id = $1 AND doctor_id = $3',[doctor_facility_id,facility,doctor_id]);
            response.json("Doctor's Facility Updated!");
      } catch (err) {
        console.error(err.message);
      }
    }

//delete doctor facility by doctor facility id
const doctors_profile_deletefacilities = async (request, response) => {
   const { doctor_id, doctor_facility_id } = request.params;
  try {
      const doctors_profile_deletefacilities = await pool.query(
          'DELETE FROM doctor_facilities WHERE doctor_facility_id = $1 AND doctor_id = $2', [doctor_facility_id,doctor_id]);
          response.json("Doctor's Facility Deleted!");
    } catch (err) {
      console.error(err.message);
    }
  }

//END//

// doctor image
// connecting to s3 bucket
const s3 = new aws.S3({
	accessKeyId: 'AKIAWNWAADBIDKG3T7WL',
  secretAccessKey: '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',
  region: 'ap-south-1',
	Bucket: 'upload.aibers.health'
});

// image upload function
const doctorProfileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'upload.aibers.health/uploads/doctorImages',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null,  'doctor' + '-' + req.params.doctor_id  + path.extname(file.originalname)  )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('image');

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
		cb( 'Error: Images Only!' );
	}
}

const uploadDoctorProfileImage = async (req, res) => {

  doctorProfileImgUpload( req, res, ( error ) =>{
    const {doctor_id} = req.params;
    
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
        pool.query('UPDATE doctor SET image = $1 WHERE doctor_id = $2',[imageName, doctor_id]);
        res.json("Image uploded successfully!");
			}
		}
  });
  } 


// getting image from private s3 
const getDoctorProfileImage = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const image = await pool.query(
        "select image from doctor where doctor_id = $1", [doctor_id]);  
        var img = image.rows[0].image.toString();

async function getImage(){
    const data =  s3.getObject(
      {
          Bucket: 'upload.aibers.health/uploads/doctorImages',
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

// add a new hospital
const addHospital = async (req, res, next) => {
  const {location, latitude, longitude } = req.body;

  if (!location || !latitude || !longitude ) {
    next(ApiError.notFound('All fields (location, latitude and longitude) are required'));
    return;
  }

  try {
    await pool.query(
      "insert into hospital_location(location, latitude, longitude) values ($1, $2, $3) on conflict (location, latitude, longitude) do nothing", [location, latitude, longitude]
    );

    res.json("Hospital added successfully");
  } catch (err) {
    console.error(err.message);
  }
}

// add staff
const addStaff = async(req,res,next) => {
  try {
    const {doctor_id, doctors_hospital_location_ids} = req.params;
    const {name, dob, role, contact_no} = req.body;
    
    const addStaff = await pool.query(
      "INSERT INTO doctor_staff(doctor_id, doctors_hospital_location_ids, name, dob, role, contact_no) VALUES($1,ARRAY[$2::int], $3, $4, $5, $6) ON CONFLICT(doctor_id, name, contact_no) DO UPDATE SET doctors_hospital_location_ids = doctor_staff.doctors_hospital_location_ids || ARRAY[$2::int] where doctor_staff.contact_no = $6 AND NOT ARRAY[$2::int] <@ doctor_staff.doctors_hospital_location_ids", [doctor_id, doctors_hospital_location_ids, name, dob, role, contact_no]
    );

    res.json("Staff added successfully");
  } catch (err) {
    console.error(err.message);
  }
}

// display doctor staff by doctor_id
const displayStaff = async(req,res,next) => {
  var {doctor_id, staff_id} = req.params;

  if (doctor_id == 0) {
    next(ApiError.notFound('doctor_id can not be 0'));
    return;
}

  try {
    const displayStaff = await pool.query(
      "select ds.* from doctor_staff ds where ($1::int is null or ds.doctor_id = $1)", [doctor_id]
    );

    res.json(displayStaff.rows);
  } catch (err) {
    console.error(err.message);
  }
}

  module.exports = {
  availableSlots,
  setFavouriteDoctor,
  deleteFavouriteDoctor,
  getFavouriteDoctor,
  getDoctors,
  //HOME SCREEN APIs FOR WEB//
  doctors_login,
  doctors_profile,
  doctors_profile_info,
  doctors_profile_setqualification,
  doctors_profile_getqualification,
  doctors_profile_updatequalification,
  doctors_profile_deletequalification,
  doctors_profile_setfacilities,
  doctors_profile_getfacilities,
  doctors_profile_updatefacilities,
  doctors_profile_deletefacilities,
  doctors_profile_setlocation,
  doctors_profile_getlocation,
  doctors_profile_getHospitalLocation,
  doctors_profile_updatelocation,
  doctors_profile_deletelocation,
  //END//
  uploadDoctorProfileImage,
  getDoctorProfileImage,
  addHospital,
  addStaff,
  displayStaff,
  }
