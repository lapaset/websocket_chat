const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const { v4: uuidv4 } = require('uuid');

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log(`listening on port ${webSocketsServerPort}`)

const wsServer = new webSocketServer({
	httpServer: server
})

const clients = {}

wsServer.on('request', request => {
	const userId = uuidv4()
	console.log(`${new Date()} received a new connection from origin ${request.origin}`)

	const connection = request.accept(nulla, request.origin)
	clients[userId] = connection
	console.log(`connected: ${userId} in ${Object.getOwnPropertyNames(clients)}`)

	connection.on('message', message => {
		if (message.type === 'utf8') {
			console.log(`received message: ${message.utg8Data}`)

			for (key in clients) {
				clients[key].sendUTF(message.utf8Data)
				console.log('sent message to: ', clients[key])
			}
		}
	})

})