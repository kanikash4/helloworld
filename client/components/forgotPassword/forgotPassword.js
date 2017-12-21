import React from 'react';
import './forgotPassword.scss';
import {Link, Redirect} from 'react-router-dom';
import 'whatwg-fetch';
import {postData} from '../../util/fetch';
import {forgotPassword as forgotPasswordURL} from '../../util/urls';

class ForgotPassword extends React.Component {
    constructor() {
        super();
        this.proceedToForgotPassword = this.proceedToForgotPassword.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            forgotPassLink : false,
            isUserLoggedIn: window.localStorage.forgotPassLink !== 'false'
        };
    }

    proceedToForgotPassword(){
        let {userEmail} = this.state;
        postData('POST', forgotPasswordURL, {userEmail}, (resp) =>{
            console.log('Success:', resp);
        },(err) => {
            console.log('Failure: ', err);
        });
        //set forgotPassLink true to indicate pasword link has been sent
        this.setState({forgotPassLink}: true);
        window.localStorage.forgotPassLink = true;
    }

    onInputChange(event) {
        let obj = {};
        obj[event.target.name] = event.target.name !=='forgotPassLink' ? event.target.value : event.target.checked;
        this.setState(obj);
    }

    render() {
        return (
            <div className='supercontainer'>
                <div className='loginContainer'></div>
                <div className="forgotPassBody">
                  <input name='userEmail' className='userEmail' type='text' value={this.state.userEmail} 
                    onChange={this.onInputChange} placeholder='Email ID'
                  />
                  <button className="forgotPassBtn" onClick={this.proceedToForgotPassword} value={this.state.forgotPassLink}>Submit</button>   
            </div>
        );
    }
}

export default ForgotPassword;
