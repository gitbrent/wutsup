import React, { useState, useEffect } from 'react'
import Twitter from 'twitter-lite'
import * as firebase from 'firebase'
import 'firebase/database'

export default function TabTwitter() {
	const firebaseConfig = {
		apiKey: 'AIzaSyB1Ey2f2xyBAaU5lbJwWBWX9LoZjakF-Ag',
		authDomain: 'wutsupdash.firebaseapp.com',
		databaseURL: 'https://wutsupdash.firebaseio.com',
		projectId: 'wutsupdash',
		storageBucket: 'wutsupdash.appspot.com',
		messagingSenderId: '280692246272',
		appId: '1:280692246272:web:6308584170b72fe11e55e5',
		measurementId: 'G-MBHW8T74RD',
	}

	const [firebaseApp, setFirebaseApp] = useState<firebase.app.App>()

	useEffect(() => {
		if (!firebaseApp) setFirebaseApp(firebase.initializeApp(firebaseConfig))
	}, [firebaseApp, firebaseConfig])

	function getTrending() {
		/*
			@link https://developer.twitter.com/en/docs/trends/trends-for-location/api-reference/get-trends-place

			// Trending:
			// global: 1
			// dallas: 2388929 (https://www.findmecity.com/)
			GET https://api.twitter.com/1.1/trends/place.json?id=1
		*/
	}

	async function test() {
		console.log(firebaseApp)

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
	}

	return (
		<section>
			<h5>(need developer key)</h5>
			<button type='button' onClick={() => test()}>
				Run Test
			</button>
		</section>
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
