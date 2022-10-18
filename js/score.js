//globals
var courses = [];
var teeBoxes = {};
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
    //load up new html page
    //render table with 'calculated' values
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
    teeBoxSelectHtml += `<option disabled selected value> -- select Tee Box --</option>`;
    teeBoxes[currentCourseId][0].teeBoxes.forEach((teeBox, index) => {
        teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()},
        ${teeBox.yards} yards</option>`
    });
    document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
    console.log(teeBoxes);
}
