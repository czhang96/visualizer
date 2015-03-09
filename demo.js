if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}


var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser, analyser2;
var javascriptNode;

var ctx = $("#canvas").get()[0].getContext("2d");

var gradient = ctx.createLinearGradient(0,0,0,300);
gradient.addColorStop(1,'#000000');
gradient.addColorStop(0.75,'#ff0000');
gradient.addColorStop(0.25,'#ffff00');
gradient.addColorStop(0,'#ffffff');

setupAudioNodes();
loadSound("a.mp3");

function setupAudioNodes(){

	javascriptNode = context.createScriptProcessor(2048,1,1);
	javascriptNode.connect(context.destination);

	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.3;
	analyser.fftSize=512;



	sourceNode = context.createBufferSource();
	sourceNode.connect(analyser);
	analyser.connect(javascriptNode);

	sourceNode.connect(context.destination);



}


function loadSound(url){
	var request = new XMLHttpRequest();
	request.open("GET",url,true);
	request.responseType = 'arraybuffer';	
	request.onload = function(){
		context.decodeAudioData(request.response, function(buffer){
			playSound(buffer);
		}, onError);
	}
	request.send();
}
function playSound(buffer){
	sourceNode.buffer = buffer;
	sourceNode.start(0);
}

function onError(e){
	console.log(e)
}

javascriptNode.onaudioprocess = function(){
	var array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);

	ctx.clearRect(0,0,1000,325);
	ctx.fillStyle = gradient;
	drawSpectrum(array);
}
function drawSpectrum(array){
	for (var i=0;i <array.length; i ++){
		var value = array[i]
		ctx.fillRect(i*5,325-value,3,325);

	}

}
