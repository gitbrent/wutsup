import React from 'react'
import logo from './logo.svg'
import Reddit from './Reddit'
import './css/bootstrap.yeticyborg.css'

function App() {
	return (
		<div>
			<nav className='navbar navbar-expand-lg navbar-dark'>
				<a className='navbar-brand' href='https://gitbrent.github.io/wutsup/'>
					<img src={logo} width='30' height='30' className='d-inline-block align-top mr-2' alt='' />
					wutsup
				</a>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#navbarColor01'
					aria-controls='navbarColor01'
					aria-expanded='false'
					aria-label='Toggle navigation'>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarColor01'>
					<ul className='navbar-nav mr-auto'>
						<li className='nav-item active'>
							<a className='nav-link' href='https://gitbrent.github.io/wutsup/'>
								Home <span className='sr-only'>(current)</span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
			<main className='container-fluid'>
				<div className='row'>
					<div className='col'>
						<section>{Reddit()}</section>
					</div>
					<div className='col'>twitter</div>
				</div>
			</main>
		</div>
	)
}

export default App
