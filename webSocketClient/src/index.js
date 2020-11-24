import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { Card, Avatar, Input, Typography } from 'antd'
import 'antd/dist/antd.css'
import './index.css'

const { Text } = Typography
const { Search } = Input
const { Meta } = Card
const client = new W3CWebSocket('ws://127.0.0.1:8000')

const App = () => {

	const [user, setUser] = useState('')
	const [messages, setMessages] = useState([])
	const [searchVal, setSearchVal] = useState('')

	const onButtonClicked = value => {
		client.send(JSON.stringify({
			type: "message",
			msg: value,
			user
		}))

		setSearchVal('')
	}

	useEffect(() => {

		client.onopen = () => {
			console.log('WebSocket Client Connected')
		}

		client.onclose = () => {
			alert('on close')
		}


		return () => {
			alert('will unmount');
		}
	}, [])

	useEffect(() => {

		client.onmessage = message => {
			const dataFromServer = JSON.parse(message.data)
			console.log('got reply', dataFromServer)
			if (dataFromServer.type === "message") {
				setMessages(messages.concat({
					msg: dataFromServer.msg,
					user: dataFromServer.user
				}))
			}
		}

	}, [messages, user])


	const onLogin = value => {
		setUser(value)
	}


	return <div className="main">
		<div className="title">
			<Text type="secondary" style={{ fontSize: '4em' }}>socket up</Text>
		</div>
		{user
			? <>
				<div className="messageField">
					{messages.map(m =>
						<Card key={m.msg} style={{
							width: '48%',
							alignSelf: user === m.user ? 'flex-end' : 'flex-start'
						}}>
							<Meta
								title={m.user}
								description={m.msg} />
						</Card>
					)}
				</div>
				<div className="bottom">
					<Search
						placeholder="input message and send"
						enterButton="Send"
						value={searchVal}
						size="large"
						onChange={e => setSearchVal(e.target.value)}
						onSearch={value => onButtonClicked(value)} />
				</div>
			</>
			: <div className={"loginField"}>
				<Search
					placeholder="Enter username"
					enterButton="Login"
					size="large"
					onSearch={value => onLogin(value)} />
			</div>
		}
	</div>
}

ReactDOM.render(<App />, document.getElementById('root'))