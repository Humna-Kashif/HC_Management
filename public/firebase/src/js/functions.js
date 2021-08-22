const phoneNumberField = document.getElementById('phoneNumber');
const codeField = document.getElementById('code');
const getCodeButton = document.getElementById('getCode');
const signInWithPhoneButton = document.getElementById('signInWithPhone');

const auth = firebase.auth();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "recaptcha-container",
  {
    size: "invisible"
  }
);

const sendVerificationCode = () => {
  var pNo = phoneNumberField.value;
  var countryCode = "+92";
  var phoneNumber = countryCode.concat(pNo);
  // const appVerifier = window.recaptchaVerifier;
  
  // Sends the 6 digit code to the user's phone
  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
  .then(confirmationResult => {
    const sentCodeId = confirmationResult.verificationId;
    
    // Sign in if the verification code is set correctly
    signInWithPhoneButton.addEventListener('click', () => signInWithPhone(sentCodeId));
  })
}

const signInWithPhone = sentCodeId => {
  const code = codeField.value;
  // A credential object (contains user's data) is created after a comparison between the 6 digit code sent to the user's phone
  // and the code typed by the user in the code field on the html form.
  const credential = firebase.auth.PhoneAuthProvider.credential(sentCodeId, code);
  auth.signInWithCredential(credential)
  .then(() => {
    window.location.assign('./successLogin');
    console.log('Signed in successfully !');
  })
  .catch(error => {
    window.location.assign('./errorLogin');
    console.error(error);
  })
}

getCodeButton.addEventListener('click', sendVerificationCode);
