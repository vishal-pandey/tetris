var speed = 500
var changeSpeed = 500
const leftWall = 0
const rightWall = 400
var p_count = 0
const unit = 20 
var play_area_height = 600
var play_area_width = 400

var is_active = 1


var shapes = ['square', 'shapel-h', 'shapel-v', 'shapet-d', 'shapet-u']

var grid = []

window.onload = ()=>{
	play_area_height = document.querySelector(".content").offsetHeight
	play_area_width = document.querySelector(".content").offsetWidth

	
	for(var i=0; i<play_area_height/unit; i++){
		let row = []
		for(var j=0; j<play_area_width/unit; j++){
			row.push(1)
		}
		grid.push(row)
	}

	let row = []
	for(var j=0; j<play_area_width/unit; j++){
		row.push(0)
	}
	grid.push(row)

	
	// addPeice('shapet-u')

	document.querySelector(".start-game").onclick = ()=>{
		body = document.querySelector("body")
		openFullscreen(body)
		document.querySelector(".start-game").style.display = "none";
		playSound('start')
		addPeice('shapet-u')
	}
	
	document.querySelector(".result").onclick = ()=>{
		window.location.reload()
	}


	document.querySelector(".close-instruction").onclick = ()=>{
		document.querySelector(".instruction").style.display = "none"
	}

	document.querySelector(".instruction-button").onclick = ()=>{
		document.querySelector(".instruction").style.display = "flex"
	}

	document.querySelector(".github-button").onclick = ()=>{
		window.location.href = "https://github.com/vishal-pandey/tetris/"
	}





}

function addPeice(type){
	play_area = document.querySelector(".content")
	if(Math.min(...grid[0]) > 0){
		var element = document.createElement('span');
		element.className = type
		p_count += 1
		element.style.left = '180px'
		play_area.appendChild(element)
		move(element)
	}else{
		document.querySelector(".result").style.display = "flex";
		playSound('finish')
		is_active = 0
	}

	document.onkeydown = (e)=>{
	    if (e.keyCode == '37') {
	    	if (is_active) {
		       navigate(element, 'left')
	    	}
	    }
	    else if (e.keyCode == '39') {
	    	if (is_active) {
				navigate(element, 'right')
	    	}
	    }
	    else if(e.keyCode == '38'){
	    	if (is_active) {
	    		element.className = rotate(element.className)
	    		playSound('selection')
	    	}
	    }
	    else if(e.keyCode == '40'){
	    	changeSpeed = 50
	    }
	}

	document.onkeyup = (e)=>{
		if (e.keyCode == '40') {
			changeSpeed = 500
		}
	}

	document.querySelector(".content").ontouchstart = (evt)=>{
		console.log(evt.touches[0].clientX)
		console.log(evt.touches[0].clientY)

		if(evt.touches[0].clientX < 200){
			if(is_active){
				navigate(element, 'left')
			}
		}else if(evt.touches[0].clientX > 200){
			if(is_active){
				navigate(element, 'right')
			}
		}
	}



	document.querySelector("button.flip").onclick = ()=>{
			if(is_active){
				element.className = rotate(element.className)
	    		playSound('selection')
			}
	}

	document.querySelector("button.fast").ontouchstart = (ent)=>{
			if(is_active){
				changeSpeed = 50
			}
	}
	document.querySelector("button.fast").ontouchend = (ent)=>{
			if(is_active){
				changeSpeed = 500
			}
	}



	return element
}


function getPosition(element){
	piece_type = element.classList[0]
	// console.log(piece_type)

	var left = element.offsetLeft/unit
	var top = element.offsetTop/unit
	var width = element.offsetWidth/unit
	var height = element.offsetHeight/unit
	// console.log(element)

	var position = []

	if(piece_type == 'shapel-h' || piece_type == 'shapel-v' || piece_type == 'square'){
		for(let i=0; i<height; i++){
			for(let j=0; j<width; j++){
				position.push([top+i, left+j])
			}			
		}
	}
	if(piece_type == 'shapet-d'){
		for(let i=0; i<height; i++){
			for(let j=0; j<width; j++){
				position.push([top+i, left+j])
			}			
		}
		position.push([top+1, left+1])
	}
	if(piece_type == 'shapet-u'){
		position.push([top-1, left+1])
		for(let i=0; i<height; i++){
			for(let j=0; j<width; j++){
				position.push([top+i, left+j])
			}			
		}
	}

	return position
}


function navigate(element, dir){
	p = getPosition(element)

	if (dir == 'left') {
		for(var i=0; i<p.length; i++){
			p[i][1] -= 1
		}
		if(checkMove(p)){
			element.style.left = element.offsetLeft - unit +'px'
		}
	}
	else if(dir == 'right'){

		for(var i=0; i<p.length; i++){
			p[i][1] += 1
		}
		if(checkMove(p)){
			element.style.left = element.offsetLeft + unit +'px'
		}
	}
}

function checkMove(position){
	for(var i of position){
		if(!grid[i[0]][i[1]]){
			return false
		}
	}
	return true
}


function move(element){
	timer = setInterval(()=>{
		p = getPosition(element)
		for(var i=0; i<p.length; i++){
			p[i][0] += 1
		}
		if(checkMove(p)){
			element.style.top = element.offsetTop + unit +"px"
		}else{
			clearInterval(timer)
			maskPosition(element)
			document.querySelector(".content").removeEventListener('touchstart', ()=>{})
			addPeice(shapes[Math.floor(Math.random() * shapes.length)])
			return
		}

		if (speed != changeSpeed) {
			clearInterval(timer)
			speed = changeSpeed
			move(element)
		}

		// Play Hit Sound

		pp = getPosition(element)
		for(var i=0; i<pp.length; i++){
			pp[i][0] += 1
		}
		if(!checkMove(pp)){
			playSound('slow-hit')
		}


	}, speed)
}

function maskPosition(element){
	p = getPosition(element)
	for(var i of p){
		grid[i[0]][i[1]] = 0
	}
}


function rotate(cname){
	if (cname == 'shapel-h') {
		return 'shapel-v'
	}
	else if(cname == 'shapel-v'){
		return 'shapel-h'
	}else if(cname == 'shapet-u'){
		return 'shapet-d'
	}else if(cname == 'shapet-d'){
		return 'shapet-u'
	}
	else{
		return cname
	}

}


function playSound(name){
	document.querySelector("#"+name).play()
}






/********************

Full Screen Mode code

**********************/


// var elem = document.querySelector(".container")

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen(elem) {
	console.log(elem)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}