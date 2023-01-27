import React,{useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import VerifyUser from '../../components/verify/verify.js';

const Verify=()=>{
		return(
				<React.Fragment>{
					localStorage.getItem('authorization')?(
					<div className="row">
						<div className="col-lg-12">
							<VerifyUser />
						</div>
					</div>):<
						div className="jumbotron">
							<center>
							<h3 style={{fontWeight:'bold'}}> Something is Wrong with our Server Please Try Later</h3>
							<br />
							<
								Link to={"/register"}>Go to Home Page</Link
							></center>
						</div>
						}
				</React.Fragment>
		);
	
}
export default Verify;