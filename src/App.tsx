import { useState, useRef, useEffect } from 'react'

import { Toast } from 'primereact/toast';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Navbar } from './shared/navmenu/Navbar';
import { Footer } from './shared/footer/Footer';
import Modal from './shared/modal/Modal';

import About from './about/About';
import Groups from './groups/Groups';
import NewGroup from './newGroup/newGroup';
import Login from './auth/login';
import Register from './auth/register';
import GroupDetail from './groupDetail/GroupDetail';
import TagManagement from './tags/tagManagement'; 

import appState from './shared/appState';
import { setAuthenticatingBackend } from './shared/backend';

class State {
	isInitialized : boolean = false;
	showWelcomeModal : boolean = false;

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}

function App() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get ref to interact with the toast
	const toastRef = useRef<Toast>(null);

	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : () => void) => {
		updater();
		setState(state.shallowClone());
	}

	let updateState = (updater : (state : State) => void) => {
		setState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//initialize
	if( !state.isInitialized )
	{
		//subscribe to app state changes
		appState.when(appState.isLoggedIn, () => {
			//this will force component re-rendering
			updateState(state => {});
		});

		//subscribe to user messages
		appState.msgs.subscribe(msg => {
			update(() => toastRef.current?.show(msg));
		});

		//if JWT is set, replace backend connector with authenticating one
		if( appState.authJwt != null && appState.authJwt !== "" ) {
			setAuthenticatingBackend(appState.authJwt);
			appState.isLoggedIn.value = true;
		}

		// Check if first visit to show welcome modal
		const hasVisited = sessionStorage.getItem('HabitTribe.hasVisited');
		if (!hasVisited) {
			sessionStorage.setItem('HabitTribe.hasVisited', 'true');
			updateState(state => state.showWelcomeModal = true);
		}

		//indicate initialization is done
		updateState(state => state.isInitialized = true);
	}

	const closeWelcomeModal = () => {
		updateState(state => state.showWelcomeModal = false);
	}

	return (
		<Router>
			<Navbar />
			<main className="flex-shrink-0">
				<Toast ref={toastRef}/>
				
				<Modal 
					isOpen={state.showWelcomeModal}
					onClose={closeWelcomeModal}
					title="Sveiki atvykę į HabitTribe!"
					size="md"
				>
					<div className="text-center">
						<div className="mb-4">
							<i className="bi bi-people-fill display-1 text-primary"></i>
						</div>
						<h5 className="mb-3">Geriausias būdas formuoti įpročius!</h5>
						<p className="mb-3">
							HabitTribe yra platforma, leidžianti jums prisijungti prie bendraminčių grupių 
							ir kartu formuoti sveikus įpročius.
						</p>
					</div>
				</Modal>

				<Routes>
					<Route path="/" element={<About />}/>
					<Route path="/groups" element={<Groups />}/>
					<Route path="/group/:id" element={<GroupDetail />}/>
					<Route path="/new-group" element={<NewGroup />}/>
					<Route path="/tags" element={<TagManagement />}/>
					<Route path="/login" element={<Login />}/>
					<Route path="/register" element={<Register />}/>
				</Routes>
			</main>
			<Footer />
		</Router>
	)
}

export default App;