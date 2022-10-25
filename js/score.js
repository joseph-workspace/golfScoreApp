import {getPlayer} from './players.js'
//globals
var courses = [];
var teeBoxes = {};
var players = [];
var courseName;
var courseId;
var playerIdentifier = 1;
const selectElement = document.getElementById('course-select');
const teeBoxElement = document.getElementById('tee-box-select');
const addPlayerBtn = document.querySelector('.addBtn');
const tableTeeBox = document.getElementById('tee-box-heading');
const tableCourseHeading = document.getElementById('course-heading');

window.onload = getAvailableCourses();

//event handlers
//Event handler that is triggered when a different course is selected
selectElement.addEventListener('change', function(event) {
    fetch(`https://golf-courses-api.herokuapp.com/courses/${event.target.value}`)
    .then(response => response.json())
    .then(json => {
        //utilize courses array to cache golf course name in teeBoxes obj. with key/value pairs
        //this solves the problem of Tee box not updating if the user changes the course
        //after initially selecting one
        courses[0].forEach((course) => {
            console.log('The current course is: ', course);
            if ((event.target.value == course.id) && !teeBoxes[course.id]) {
                teeBoxes[course.id] = json.data.holes; 
            }
        });
        //call teeBoxSelect fcn. which passes the courseId to the function so that it knows
        //which teeBox to load up from the teeBox obj.
        //console.log(teeBoxes);
        console.log('here\'s the current course name?', event.target.value);
        teeBoxSelect(event.target.value);
        courses[0].forEach((course) => {
            if (course.id == event.target.value) {
                courseName = course.name;
                tableCourseHeading.textContent = `Your course: ${courseName}`;
            }
        });

    });
}) 
teeBoxElement.addEventListener('change', function(event) {
    //render table with 'calculated' values
    const table1Element = document.querySelector('#scorecard-container');
    const table2Element = document.querySelector('.score-card-back9');
    const courseSelect = document.querySelector('.form-group-1');
    const teeSelect = document.querySelector('.form-group-2');
    const yardageRow = document.querySelector('#Yardage');
    const parRow = document.querySelector('#Par');
    const handicapRow = document.querySelector('#Handicap');
    console.log(teeBoxes);
    console.log('This is where you want to print headers', event.target.value);
    //get teeBox type here
    let currentTeeBox = teeBoxes[courseId][0].teeBoxes[event.target.value].teeType.toUpperCase();
    tableTeeBox.textContent = `Tee Box: ${currentTeeBox}`;
    displayOrHide(table1Element);
    displayOrHide(courseSelect);
    displayOrHide(teeSelect);
    displayOrHide(tableCourseHeading);
    displayOrHide(tableTeeBox);
    renderYardage(courseId, yardageRow, event.target.value, 'Yardage');
    renderPar(courseId, parRow, event.target.value, 'Par');
    renderHandicap(courseId, handicapRow, event.target.value, 'Handicap');
}); 

addPlayerBtn.addEventListener('click', () => {
    //prompt user for player name
    //create player object and store in players array
    //print row with player name
    if (players.length < 4) {
        const playerName = prompt('Please enter your player name:');
        createPlayer(playerName);
        console.log(players);
        printPlayerRows(players.length - 1);
    } else {
        toastr.warning('You can\'t add more than 4 players!', 'Error!');
    }
});

document.getElementById('player-1').addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'td') {
        playerIdentifier = 1;
        inputPlayerData(event.target, playerIdentifier);
        //console.log(players);
        updatePlayerRow();
    }
});
document.getElementById('player-2').addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'td') {
        playerIdentifier = 2;
        inputPlayerData(event.target, playerIdentifier);
        //console.log(players);
        updatePlayerRow();
    }
});
document.getElementById('player-3').addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'td') {
        playerIdentifier = 3;
        inputPlayerData(event.target, playerIdentifier);
        //console.log(players);
        updatePlayerRow();
    }
});
document.getElementById('player-4').addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'td') {
        playerIdentifier = 4;
        inputPlayerData(event.target, playerIdentifier);
        console.log(players);
        updatePlayerRow();
    }
});
//functions
async function getAvailableCourses() {
    return fetch('https://golf-courses-api.herokuapp.com/courses/')
    .then((response) => response.json())
    .then(json => {
        courses.push(json.courses);
        renderCourse();
    });
}
function renderCourse() {
    let courseOptionsHtml = '';
    courses[0].forEach((course, index) => {
        if (index === 0) {
            courseOptionsHtml += `<option disabled selected value> -- select course to play --</option>
            <option value="${course.id}">${course.name}</option>`;
        } else {
            courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
            selectElement.innerHTML = courseOptionsHtml;
        }
    });
}
function teeBoxSelect(currentCourseId) {
    let teeBoxSelectHtml = '';
    courseId = currentCourseId;
    teeBoxSelectHtml += `<option disabled selected value> -- select Tee Box --</option>`;
    teeBoxes[currentCourseId][0].teeBoxes.forEach((teeBox, index) => {
        teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()},
        ${teeBox.yards} yards</option>`
    });
    document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}
function displayOrHide(element) {
    //console.log(element);
    if (window.getComputedStyle(element).visibility === 'hidden') {
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden';
        //console.log(element);
    }
}
function renderYardage(courseId, tableRowElement, teeBoxIndex, rowTitle) {
    console.log(`The current course ID is: ${courseId}`);
    let tableRowHtml = '';
    let total = 0;
    let firstHalf = 0;
    //const teeBoxi = -1;
    
    tableRowHtml += '<td>' + rowTitle + '</td>';
    //for loop to get yardage from each hole
    teeBoxes[courseId].forEach((hole, index) => {
        total += hole.teeBoxes[teeBoxIndex].yards;
        tableRowHtml += `<td id="${index}">${hole.teeBoxes[teeBoxIndex].yards}</td>`;
        if (index === 8) {
            tableRowHtml += `<td id="out">${total}</td>`;
            firstHalf = total;
            total = 0;
        }
        if (index === 17) {
            tableRowHtml += `<td id="in">${total}</td>
            \n<td>${firstHalf}</td>\n<td>${total + firstHalf}`;
        }
    });
    tableRowElement.innerHTML = tableRowHtml;
}
function renderPar(courseId, tableRowElement, teeBoxIndex, rowTitle) {
    console.log(`The current course ID is: ${courseId}`);
    let tableRowHtml = '';
    let total = 0;
    let firstHalf = 0;
    //const teeBoxi = -1;
    
    tableRowHtml += '<td>' + rowTitle + '</td>';
    //for loop to get yardage from each hole
    teeBoxes[courseId].forEach((hole, index) => {
        total += hole.teeBoxes[teeBoxIndex].par;
        tableRowHtml += `<td id="${index}">${hole.teeBoxes[teeBoxIndex].par}</td>`;
        if (index === 8) {
            tableRowHtml += `<td id="out">${total}</td>`;
            firstHalf = total;
            total = 0;
        }
        if (index === 17) {
            tableRowHtml += `<td id="in">${total}</td>
            \n<td>${firstHalf}</td>\n<td>${total + firstHalf}`;
        }
    });
    tableRowElement.innerHTML = tableRowHtml;
}
function renderHandicap(courseId, tableRowElement, teeBoxIndex, rowTitle) {
    console.log(`The current course ID is: ${courseId}`);
    let tableRowHtml = '';
    let total = 0;
    let firstHalf = 0;
    
    tableRowHtml += '<td>' + rowTitle + '</td>';
    //for loop to get yardage from each hole
    teeBoxes[courseId].forEach((hole, index) => {
        total += hole.teeBoxes[teeBoxIndex].hcp;
        tableRowHtml += `<td id="${index}">${hole.teeBoxes[teeBoxIndex].hcp}</td>`;
        if (index === 8) {
            tableRowHtml += `<td id="out">${total}</td>`;
            firstHalf = total;
            total = 0;
        }
        if (index === 17) {
            tableRowHtml += `<td id="in">${total}</td>
            \n<td>${firstHalf}</td>\n<td>${total + firstHalf}`;
        }
    });
    tableRowElement.innerHTML = tableRowHtml;
}
function printPlayerRows(playerId) {
    //if empty add player name to first cell
    //print empty/filled out holes
    //total up 1-9 score when first 9 hole scores are entered
    //total up 10-18 in the same way
    //check for negative numbers or zeros
    let tableRowHtml = '';
    tableRowHtml += `<td id="${new Date().getTime()}">${players[playerId].name}</td>`;
    for (let i = 1; i < 19; i++) {
        if (i <= 8 | i > 9) {
            tableRowHtml += `<td id="${i}" contenteditable="true"></td>`;
        } else if (i === 9) {
            tableRowHtml += `<td id="${i}" contenteditable="true"></td>
            \n<td id="${'out-' + (playerId * 2)}"></td>`;
        }
    }
    tableRowHtml += `<td id="${'in-' + (playerId + 1)}"></td>\n<td id="${'out-' + ((playerId * 2) + 1)}"></td>
    \n<td id="${'total-' + (playerId + 1)}"></td>`;
    let idString = 'player-' + (playerId + 1);
    document.getElementById(idString).innerHTML = tableRowHtml;
}
function createPlayer(playerName) {
    players.push(getPlayer(playerName));
    // console.log(players);
}
function inputPlayerData(targetBox, currentRowId) {
    //push currentBox's value to player scores array
    players[currentRowId - 1].scores[parseInt(targetBox.id) - 1] = parseInt(targetBox.textContent);
}
function updatePlayerRow() {
    //total up 1-9 score when first 9 hole scores are entered
    //total up 10-18 in the same way
    let counter1 = 0;
    let counter2 = 0;
    let total1 = 0;
    let total2 = 0;
    let playersPoints = players[playerIdentifier - 1];
    let playerName = playersPoints.name;
    for (let i = 0; i < 9; i++) {
        //keep in mind after you change an editablecontent box
        //(from having a number to no number) it is replaced in the array with NaN
        if (playersPoints.scores[i] > 0) { //|| playersPoints !== NaN) {
            total1 += playersPoints.scores[i];
            counter1++;
        }
    }
    if (counter1 === 9) {
        document.getElementById('out-' +  ((playerIdentifier * 2) - 2)).innerHTML = total1;
    } else {
        document.getElementById('out-' + ((playerIdentifier * 2) - 2)).innerHTML = '';
    }
    for (let j = 9; j < 18; j++) {
        if (playersPoints.scores[j] > 0) {
            total2 += playersPoints.scores[j];
            counter2++;
        }
    }
    if (counter2 === 9) {
        document.getElementById('out-' + ((playerIdentifier * 2) - 1)).innerHTML = total2;
        if (counter1 === 9) {
            document.getElementById('total-' + playerIdentifier).innerHTML = total1 + total2;
            document.getElementById('in-' + playerIdentifier).innerHTML = total1;
        }
    } else {
        document.getElementById('out-' + ((playerIdentifier * 2) - 1)).innerHTML = '';
    }
    //toastr completion
    let isFinished = playersPoints.scores.filter(num => num > 0);
    if (isFinished.length === 18) {
        let successMessage = `Congratulations ${playerName}! You completed the ${courseName} golf course!`
        toastr.success(successMessage, "Success!");
    }
}