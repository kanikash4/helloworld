import React from 'react';
import './login.scss';
import {Link, Redirect} from 'react-router-dom';
import 'whatwg-fetch';
import {postData} from '../../util/fetch';
import {login as loginURL} from '../../util/urls';
import {forgotPassword as forgotPasswordURL} from '../../util/urls';


class Login extends React.Component {
    constructor() {
        super();
        this.proceedToLogin = this.proceedToLogin.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            userID: '',
            password: '',
            staySignedIn: false,
            isUserLoggedIn: window.localStorage.isUserLoggedIn !== 'false'
        };
    }

    proceedToLogin() {
        let {userID, password, staySignedIn} = this.state;
        postData('POST', loginURL, {userID, password, staySignedIn}, (resp) => {
            console.log('Success', resp);
            window.location.href = "https://www.example.com";
            console.log("set the new url");
        }, (error) => {
            console.log('Failure', error);
        });
        // On success of login isUserLoggedIn state will be set as true
        this.setState({isUserLoggedIn: true});
        window.localStorage.isUserLoggedIn = true;
    }

    onInputChange(event) {
        let obj = {};
        obj[event.target.name] = event.target.name !== 'staySignedIn' ? event.target.value : event.target.checked;
        this.setState(obj);
    }

    handleSubmit(event){
        event.preventDefault();
        alert('it works!');
    }

    render() {
        return (
            // <div>This is the login screen</div>
            <div className='supercontainer'>
                <div className="HeaderContainer">
                    <div className='logoContainer'>
                    Logo
                    </div>
                </div>
                <div className="mainBodyContainer">
                    <div className='loginContainer'>
                          <input name='userID' className='userID' type='text' value={this.state.userID} 
                            onChange={this.onInputChange} placeholder='Email ID'
                          />
                          <input name='password' className='password' type='password' value={this.state.password}
                              onChange={this.onInputChange} placeholder='Password'
                          />
                          <button className="loginBtn" onClick={this.proceedToLogin} value={this.state.staySignedIn}>Sign In</button>
                            <div className="forgetPassword">
                                <a href ="forgotPasswordURL">Forgot Password?</a>
                            </div>
                    </div>
                    <br/>
                    <div className="signUpContainer">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="firstName"/>
                            <input type="text" name="lastName"/>
                            <input type="text" name="phNumber"/>
                            <input type="password" name="pass"/>
                            <input type="text" name="email"/>
                            <button>Register</button>
                        </form>
                    </div>
                </div>
                <div className="footerContainer">Footer</div>
            </div>
        );
    }
}

export default Login;

