import React from 'react';
import ReactDOM from 'react-dom'
import Header from '../../components/header/header.js';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import LoginSystem from '../../components/login/login.js';
import AOS from 'aos';
import './login.css';

const Login=(props)=>{

	AOS.init();
	const test={position:'absolute',left:'300px',width:'50%'};
	const loginstyle={borderLeft:'none',transition:'0.3s border',color:'#1DD9D8'};
	
	
	return(
			<>
				<Header loginlink={"nav-item active"} loginstyle={loginstyle}
				homeuser={<a className="nav-link" href="/">Home</a>}
				loginuser={<a className="nav-link active" href="/login">Login</a>}
				registeruser={<a className="nav-link" href="/register">Join US</a>}

				/>
				<br/><br/><br/>
				<LoginSystem />

			</>
		);
}

export default Login;