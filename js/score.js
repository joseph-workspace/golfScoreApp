//globals
var courses = [];
var teeBoxes = {};
var courseId;
const selectElement = document.getElementById('course-select');
const teeBoxElement = document.getElementById('tee-box-select');

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
            if ((event.target.value == course.id) && !teeBoxes[course.id]) {
                teeBoxes[course.id] = json.data.holes; 
            }
        });
        //call teeBoxSelect fcn. which passes the courseId to the function so that it knows
        //which teeBox to load up from the teeBox obj.
        console.log(teeBoxes);
        teeBoxSelect(event.target.value);

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
    const golfCourseAttributes = ['yards', 'par', 'hcp'];
    
    displayOrHide(table1Element);
    displayOrHide(courseSelect);
    displayOrHide(teeSelect);
    renderYardage(courseId, yardageRow, event.target.value, 'Yardage');
    renderPar(courseId, parRow, event.target.value, 'Par');
    renderHandicap(courseId, handicapRow, event.target.value, 'Handicap');
    // console.log(teeBoxes);
}); 

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
function fillOutScorecard(rowId) {
    //define variables
    teeBoxes[courseId].forEach((hole) => {

    });
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
            tableRowHtml += `<td id="out">${total}</td>
            \n<td></td>`;
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
            tableRowHtml += `<td id="out">${total}</td>
            \n<td></td>`;
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
    //const teeBoxi = -1;
    
    tableRowHtml += '<td>' + rowTitle + '</td>';
    //for loop to get yardage from each hole
    teeBoxes[courseId].forEach((hole, index) => {
        total += hole.teeBoxes[teeBoxIndex].hcp;
        tableRowHtml += `<td id="${index}">${hole.teeBoxes[teeBoxIndex].hcp}</td>`;
        if (index === 8) {
            tableRowHtml += `<td id="out">${total}</td>
            \n<td></td>`;
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