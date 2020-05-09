import React, { useState, useEffect, useRef } from 'react'
import { LinearProgress } from '@material-ui/core'

//if (isNaN(Number(selDelaySecs))) return

interface IProps {
	delaySecs: number
	callbackTimerDone: Function
}

export default function Progress(props: IProps) {
	let [count, setCount] = useState(0)

	function useInterval(callback: Function, delay: number) {
		const savedCallback = useRef<Function>()

		// Remember the latest callback.
		useEffect(() => {
			savedCallback.current = callback
		}, [callback])

		// Set up the interval.
		useEffect(() => {
			function tick() {
				if (savedCallback.current) savedCallback.current()
			}
			if (delay) {
				let id = setInterval(tick, delay)
				return () => clearInterval(id)
			}
		}, [delay])
	}

	useInterval(() => {
		// Your custom logic here
		//setCount(count + 1)
		let currCnt = count + 1
		if (currCnt >= props.delaySecs) {
			currCnt = 0
			props.callbackTimerDone()
		}
		setCount(currCnt)
	}, 1000)

	return <LinearProgress variant='determinate' value={Math.min((count / Number(props.delaySecs)) * 100, 100)} style={{ width: '100%' }} />
}
