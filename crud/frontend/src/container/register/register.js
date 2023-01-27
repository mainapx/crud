import React from 'react';
import ReactDOM from 'react-dom';
import RegisterSystem from '../../components/register/register.js';
import {connect} from 'react-redux';
import Header from '../../components/header/header.js';

const Register=()=>{
	const registerstyle={borderLeft:'none',transition:'0.3s',color:'#1DD9D8'};

	return(
			<>
				<Header registerlink={'nav-item'} registerstyle={registerstyle}		
					homeuser={<a className="nav-link" href="/">Home</a>}
					loginuser={<a className="nav-link" href="/login">Login</a>}
					registeruser={<a className="nav-link active" href="/register">Join US</a>}
				 />
				<br/><br/><br/>
				<RegisterSystem />
			</>
		);
}
export default Register;