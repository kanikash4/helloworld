import React from 'react';
import './dashboard.scss';
import {Link, Redirect} from 'react-router-dom';
import 'whatwg-fetch';
import {postData} from '../../util/fetch';
import {dashboard as dashboardURL} from '../../util/urls';

class Dashboard extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='supercontainer'>
            	
            </div>
        );
    }
}

export default Dashboard;