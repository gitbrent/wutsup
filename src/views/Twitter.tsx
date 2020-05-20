import React, { useState, useEffect, useRef } from 'react'
import Twitter from 'twitter-lite'
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/database'

export default function TabTwitter() {
	const authRef = useRef<HTMLDivElement>(null)
	const [firebaseApp, setFirebaseApp] = useState<firebase.app.App>()
	const [firebaseUi, setFirebaseUi] = useState<firebaseui.auth.AuthUI>()

	useEffect(() => {
		const firebaseConfig = {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: 'wutsupdash.firebaseapp.com',
			databaseURL: 'https://wutsupdash.firebaseio.com',
			projectId: 'wutsupdash',
			storageBucket: 'wutsupdash.appspot.com',
			messagingSenderId: '280692246272',
			appId: '1:280692246272:web:6308584170b72fe11e55e5',
			measurementId: 'G-MBHW8T74RD',
		}

		if (!firebaseApp) setFirebaseApp(firebase.initializeApp(firebaseConfig))

		// Initialize the FirebaseUI Widget using Firebase.
		if (!firebaseUi) setFirebaseUi(new firebaseui.auth.AuthUI(firebase.auth()))
	}, [firebaseApp, firebaseUi])

	useEffect(() => {
		const firebaseUiConfig = {
			signInSuccessUrl: 'http://localhost:3000', // 'https://wutsupdash.firebaseapp.com',
			signInOptions: [
				{
					provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					scopes: 'email',
				},
			],
			tosUrl: 'https://wutsupdash.firebaseapp.com/tos.html',
		}

		if (firebaseUi) firebaseUi.start(authRef && authRef.current ? authRef.current : '', firebaseUiConfig)

		// TODO: move all this firebase auth/signin stuff to AppBody
		// TODO: firebase.auth().onAuthStateChanged(function(user){}) - then hide/show `refAuth` as needed
	}, [firebaseUi])

	/*
	function getTrending() {
		// @link https://developer.twitter.com/en/docs/trends/trends-for-location/api-reference/get-trends-place
		// Trending:
		// global: 1
		// dallas: 2388929 (https://www.findmecity.com/)
		// GET https://api.twitter.com/1.1/trends/place.json?id=1
	}
	*/

	function testFirebase() {
		console.log(firebaseApp)

		//firebase.database().ref('wutsupdash/consumer_key').once('value', (snapshot) => {
		if (firebaseApp)
			firebaseApp
				.database()
				//.ref('wutsupdash/consumer_key')
				.ref()
				.on('value', (snapshot) => {
					console.log('YO!!')
					snapshot.forEach((childSnapshot) => {
						//gObjNews = snapshot.val();
						//console.log( JSON.stringify(gObjNews,null,4) ); // DEBUG

						let childKey = childSnapshot.key
						let childData = childSnapshot.val()
						console.log('Key: ' + childKey + '    Val: ' + childSnapshot + '     Data: ' + childSnapshot.val().articleName)
						console.log(childData)
					})
				})
	}

	async function test() {
		const user = new Twitter({
			consumer_key: 'USE_FIREBASE',
			consumer_secret: 'USE_FIREBASE',
		})

		const response = await user.getBearerToken()
		console.log(response)
		/*
		const app = new Twitter({
			bearer_token: response.access_token,
		})
		*/

		//fetch('https://www.reddit.com/r/askreddit.json', {
		//	method: 'GET',
		//	headers: {
		//		Accept: 'application/json',
		//		//Authorization: 'Bearer ' + params['access_token'],
		//	},
		//	mode: 'no-cors',
	}

	return (
		<div className='container'>
			<div className='jumbotron'>
				<h1 className='display-4'>Twitter!</h1>

				<div ref={authRef}></div>

				<div className='row mt-3'>
					<div className='col'>
						<button type='button' onClick={() => testFirebase()}>
							Firebase Database Test
						</button>
					</div>
					<div className='col'>
						<button type='button' onClick={() => test()}>
							Twitter Feed Test
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
/*
class TwitterFeed extends Component {
  componentDidMount() {
    const params = {screen_name: 'nimaiwalsh'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
          console.log(tweets);
      } else {
          throw error
      }
    });
  }

  render() {
    return(
      <div>Test twitter feed</div>
    )
  }
}

export default Twitter
// https://api.twitter.com/1.1/statuses/user_timeline.json
*/
