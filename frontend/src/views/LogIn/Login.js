import React, { Component } from 'react'
import { Image } from 'react-bootstrap';
import './Login.css'
// import history from '../../services/history'


class Login extends Component{
    constructor(props){
        super(props)

        this.state={
            phonenumber:''
        }

        this.state = { data: [] };
    }

    handleChange = (event) => {
        this.setState({
            phonenumber:event.target.value
        })
    }

    // mySubmitHandler(event) { 
    //     const contact_no = 12345678900;
    //     const response = fetch("https://app.aibers.health/api/getDoctorIdByContactNo/"+contact_no);
    //     console.log(response);
    //     const json = response.json();
    //     console.log(json);
    //     // alert("You are submitting " + this.state.phonenumber);
    //     event.preventDefault();
    //   }

        isData=(event)=> {
        event.preventDefault();
        const contact_no = this.state.phonenumber;
        // const response = fetch("https://app.aibers.health/api/getDoctorIdByContactNo/"+contact_no);
            const apiUrl = "https://app.aibers.health/doctors/"+contact_no+"/login";
            fetch(apiUrl)
          .then((response) => response.json())
          .then((data1) => {
                console.log('This is your data', data1[0].doctor_id);
                this.setState({data:data1});
                const { history } = this.props;
                history.push({
                pathname:"/Profile",
                state: { userId: data1[0].doctor_id }
        }); 
            })
          .catch((error) => console.error(error))
          .finally(() => {
           this.setState({ isLoading: false });
           }); 
            
    }

    render(){
        return( 
            <div className="header">
                <div className="form-wrapper" >
                    <h3>Sign In</h3>
                    {/* <Image src="./uploads/doctorProfilePicture/doctor-3-DP.png" rounded width={100} height={100}/> */}
                    <form className="Login-form" onSubmit={this.isData}>
                        <div className="PhoneNumber">
                            <input
                            placeholder="Enter your Phone Number"
                            type="text"
                            value={this.state.phonenumber}
                            noValidate
                            onChange={this.handleChange}
                            />    
                        </div>
                        <div className="SignInAccount">
                            <button type="submit" >Sign In</button>
                            <small>Don't have an Account?</small>
                            <label>Get Registered</label>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login