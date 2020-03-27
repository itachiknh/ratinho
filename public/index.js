
$(document).ready(function(){
var socket = io('https://ratinhodogas.herokuapp.com')
socket.emit('connect', localStorage.getItem("token"))
console.log("Connect")

function enterName(){
    $("#nome button").click(function(){
        var nome = $("#nomer").val()
        if(nome.length > 2){
            myToken(nome)
        }
        return false
    })
}

enterName()

function myToken(nome){
    const myToken = localStorage.getItem("token")
    if(nome.length > 2){
        socket.emit("generateToken", nome)
        socket.on('myToken', function(data){
            localStorage.setItem("token",data)
        })
        $(".mensagens").removeClass("inactive")
        $("#msg").removeClass("inactive")
        $(".nome").addClass("inactive")
    }
}

function enviarMensagem(){
    $("#msg button").click(function(){
        var mensagem = $("#mensagem").val()
        if(localStorage.getItem("token")){
            const object = {
            "msg": mensagem,
            "token": localStorage.getItem("token")        
        }
        socket.emit('enviarMensagem', object)
        $("#mensagem").val("")
        rolarBaixo()
        }
        return false
    })
}

enviarMensagem()

function receberMensagem(data){
    for(let i = 0; i < 11; i++){
    data.msg = data.msg.replace(':emoji'+i,
        '<div class="emoji" style="background-position: '+44 * i+'px 0px"></div>')
    }
    
    const msgHtml = `<div class="message">
        <span>${data.nome} - </span>
        <span>&nbsp;   ${data.msg}</span>
    </div> <br>`

    $(".after").before(msgHtml)
    rolarBaixo()
}

socket.on('receberMensagem', function(data){
    receberMensagem(data)
})

function rolarBaixo(){
    setTimeout(function(){ 
		$('.mensagens').animate({
	    		scrollTop: $('.mensagens')[0].scrollHeight}, "slow");
	}, 300);
}

socket.on('disconnect', () => {
    socket.emit('disconnect', localStorage.getItem("token"))
})

function emojiGenerate(){
    var emojiHtml = ""
    for(let i = 0; i <= 10; i++){
        emojiHtml += `<div 
		class='emoji' data-id='${i}' style='background-position: ${44 * i}px 0px'></div>`
    }
    $(".emojis").html(emojiHtml)
}

function enviarEmoji(){
	$(".emojis .emoji").click(function() {
		const id =  $(this).data("id")
		const msgAtual = $("#mensagem").val()
		$("#mensagem").val(`${msgAtual} :emoji${id}`)
	})
}

emojiGenerate()
enviarEmoji()

function aparecerEmoji(){
	$("a .emoji").click(function(){
		if($('.emojis').hasClass('inactive')){
			$(".emojis").removeClass("inactive")
		} else{
			$(".emojis").addClass("inactive")
		}
	})
}

aparecerEmoji()

socket.on('users', function(data){
	var membrosHtml = ""
	for(let i = 0; i < data.length; i++){
		membrosHtml += `<li>${data[i].nome}</li>`
	}
	$(".membros").html(membrosHtml)
})

})