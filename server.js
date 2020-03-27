const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
const porta = process.env.PORT || 8080

app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)

app.use('/', (req, res) => {
    res.render('index.html')
})

let membros = []

io.on('connection', socket => {

    socket.on('connect', data =>{
		const membro = membros.find(e => e.token == data)
		if(membro){
		console.log(membro.nome)
		}
	})

    socket.on('enviarMensagem', data => {
        const membro = membros.find(e => e.token == data.token)
        console.log(membro)
        if(membro){
        const message = {
            "nome": membro.nome,
            "msg": data.msg
        }
        socket.broadcast.emit('receberMensagem', message)
        socket.emit('receberMensagem', message)
        console.log(message.nome)
        }
    })
    socket.on('generateToken', data => {
        socket.emit('myToken', socket.id)
        membros.push({
            "nome":data,
            "token": socket.id
        })
        console.log("Gerei um token")
        socket.emit('users', membros)
        socket.broadcast.emit('users', membros)
    })
    socket.on('disconnect', function (data) {
        const membro = membros.find(e => e.token == socket.id)
        if(membro){
            const id = membros.indexOf(membro)
            membros.splice(id, 1)
            socket.broadcast.emit('users', membros)
            console.log(`${membro.nome} disconnect`)
            socket.broadcast.emit('receberMensagem', {
                "nome": membro.nome,
                "msg": "Desconectou do servidor"
            })
        }
    })
})

server.listen(porta)
console.log("Server aberto")