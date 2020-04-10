const speed = 50
const leftWall = 0
const rightWall = 400
var low_positions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// var low_positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]


var grid = []


for(var i=0; i<30; i++){
	let row = []
	for(var j=0; j<20; j++){
		row.push(0)
	}
	grid.push(row)
}



var play_area_height
var element

var limit = 0
window.onload = ()=>{
	play_area_height = document.querySelector(".content").offsetHeight
	console.log(grid)
	element = addPeice('square')
}



function addPeice(type){
	play_area = document.querySelector(".content")
	var element = document.createElement('span');
	element.className = type
	if (Math.max(...low_positions) < play_area_height) {
		play_area.appendChild(element)	
		move(element)
	}else{
		document.querySelector(".result").style.display = "flex";
	}
	document.onkeydown = (e)=>{
	    if (e.keyCode == '37') {
	       navigate(element, 'left')
	    }
	    else if (e.keyCode == '39') {
	       navigate(element, 'right')
	    }
	}
	return element
}



function move(element){
	timer = setInterval(()=>{
		limit = getLimit(element)
		if ((play_area_height - element.offsetTop - element.offsetHeight - limit) < element.offsetHeight) {
			clearInterval(timer)
			element.style.top = element.offsetTop + (play_area_height - element.offsetTop - element.offsetHeight - limit)+"px"
			setLimit(element)
			addPeice('square')
		}else{
			element.style.top = element.offsetTop+20+"px"
		}
	}, speed)
}



















function navigate(element, dir){
	if (dir == 'left') {
		if(element.offsetLeft != 0 && element.offsetTop+element.offsetHeight != play_area_height){
			element.style.left = element.offsetLeft - 20 +'px'
		}
	}
	else if(dir == 'right'){
		if(element.offsetLeft != rightWall-element.offsetWidth && element.offsetTop+element.offsetHeight != play_area_height){
			element.style.left = element.offsetLeft + 20 +'px'
		}
	}
}

function getLimit(element){
	unit_width = element.offsetWidth/20
	index = element.offsetLeft/20
	indexs = []
	indexs_values = []
	for(var i=0; i<unit_width; i++){
		indexs_values.push(low_positions[index+i])
		indexs.push(index+i)
	}
	max_limit = Math.max(...indexs_values)
	// console.log(low_positions)
	// console.log(element.offsetLeft/20)
	// console.log("")
	return max_limit;
}

function setLimit(element){
	unit_width = element.offsetWidth/20
	index = element.offsetLeft/20
	indexs = []
	indexs_values = []
	indexs_values_temp = []
	for(var i=0; i<unit_width; i++){
		indexs_values.push(low_positions[index+i])
		indexs_values_temp.push(low_positions[index+i])
		indexs.push(index+i)
	}

	for(var i = 0; i < indexs_values.length; i++){
		indexs_values[i] = Math.max(...indexs_values_temp) + element.offsetHeight
	}

	for(var i = 0; i < indexs.length; i++){
		low_positions[indexs[i]] = indexs_values[i]
	}
}