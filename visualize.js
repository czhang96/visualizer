
var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser
var javascriptNode;
var ctx;
var gradient;


function _generateVisualizer(selector,player,colors){
	ctx = $(selector).get()[0].getContext("2d");
	var audio = $(player).get()[0];
	gradient = ctx.createLinearGradient(0,0,0,300);
	setupGradient(colors);
	setup(audio);
}

function setupGradient(colors){
	for (var i = 0 ; i < colors.length ; i++){
		gradient.addColorStop(i/colors.length,colors[i]);
	}
}


function setup(audio){

	javascriptNode = context.createScriptProcessor(2048,1,1);
	javascriptNode.connect(context.destination);

	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.3;
	analyser.fftSize=512;

	sourceNode = context.createMediaElementSource(audio);
	sourceNode.connect(analyser);
	analyser.connect(javascriptNode);

	sourceNode.connect(context.destination);

	javascriptNode.onaudioprocess = function(){
		var array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);
		ctx.clearRect(0,0,1000,325);
		ctx.fillStyle = gradient;
		drawSpectrum(array);
	}
}

function drawSpectrum(array){
	for (var i=0;i <array.length; i ++){
		var value = array[i]
		ctx.fillRect(i*5,325-value,3,325);
	}
}
