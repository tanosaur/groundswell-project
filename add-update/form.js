const config = {
  ORGS_URL: "https://docs.google.com/spreadsheets/d/1MICdnJ5CnjIh2kYodN4vdFEN0r94Gbbdv7o4Xvkq1O4/gviz/tq?tqx=out:csv&sheet=Organisations",
  EVENTS_URL: "https://docs.google.com/spreadsheets/d/1MICdnJ5CnjIh2kYodN4vdFEN0r94Gbbdv7o4Xvkq1O4/gviz/tq?tqx=out:csv&sheet=Events",
  LATITUDE_FIELD: "Latitude",
  LONGITUDE_FIELD: "Longitude",
  AREAS_OF_WORK: "Areas of Work",
  HELP_NEEDED: "Help Needed",
};

let areasOfWork = [];
let helpNeeded = [];

let firstWorkLoad = [];
let firstHelpLoad = [];

function collectFilters(location) {
  let categories1 = location.properties[config.AREAS_OF_WORK].split(",");
  categories1.map(category => {
    category = category.trim().toLowerCase();
    if (!(areasOfWork.includes(category)) && category !== "") {
      areasOfWork.push(category);
    }
  });

  let categories2 = location.properties[config.HELP_NEEDED].split(",");
  categories2.map(category => {
    category = category.trim().toLowerCase();
    if (!(helpNeeded.includes(category)) && category !== "") {
      helpNeeded.push(category);
    }
  });
}

function formatOptions() {
  let areasFieldset = document.getElementById("fieldset1");
  let helpFieldset = document.getElementById("fieldset2");

  // areasOfWork.sort((a,b) => {
  //   if (config.SHOW_FIRST.includes(a)) {
  //     return -1
  //   }
  //   else {
  //     return 1
  //   }
  // })
  //
  // helpNeeded.sort((a,b) => {
  //   if (config.SHOW_FIRST.includes(a)) {
  //     return -1
  //   }
  //   else {
  //     return 1
  //   }
  // })

  areasOfWork.map(area => {
    if (!firstWorkLoad.includes(area)) {
      let field = areasFieldset.appendChild(document.createElement("div"));
      field.className = "field filter";

      let input = field.appendChild(document.createElement("input"));
      input.type = "checkbox";
      input.id = area.replace(/\s+/g, '-').toLowerCase();
      input.value = area;

      let label = field.appendChild(document.createElement("label"));
      label.htmlFor = input.id;
      label.innerText = area;
    }
  })

  helpNeeded.map(area => {
    if (!firstHelpLoad.includes(area)) {
      let field = helpFieldset.appendChild(document.createElement("div"));
      field.className = "field filter";

      let input = field.appendChild(document.createElement("input"));
      input.type = "checkbox";
      input.id = area.replace(/\s+/g, '-').toLowerCase();
      input.value = area;

      let label = field.appendChild(document.createElement("label"));
      label.htmlFor = input.id;
      label.innerText = area;
    }
  })

  firstWorkLoad = [...areasOfWork];
  firstHelpLoad = [...helpNeeded];


}

(function orgsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.ORGS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      if (err) {
        console.log("Error with orgs data")
        console.error(err);
      }
      geojson.features.forEach(function (location, index) {
        collectFilters(location);
      });
      formatOptions();
    });
  };
})();

(function eventsFromGoogleSheet() {
  const oReq = new XMLHttpRequest();

  let url = config.EVENTS_URL;
  oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
  oReq.send();

  oReq.onload = function(e) {
    csv2geojson.csv2geojson(oReq.responseText, {
      latfield: config.LATITUDE_FIELD,
      lonfield: config.LONGITUDE_FIELD,
      delimiter: ","
    }, function (err, geojson) {
      if (err) {
        console.log("Error with events data")
        console.error(err);
      }
      geojson.features.forEach(function (location, index) {
        collectFilters(location);
      });
      formatOptions();
    });
  };
})();


document.getElementById("add").addEventListener("click", function (e) {
  document.querySelectorAll(".asterisk").forEach(asterisk => {
    asterisk.style.display = "inline";
  });
});

document.getElementById("update").addEventListener("click", function (e) {
  document.querySelectorAll(".question").forEach(question => {
      if (question.id === "qAction" || question.id === "qOrgName" || question.id === "qEmail") {
        question.getElementsByClassName("asterisk")[0].style.display = "inline";
      } else {
        question.getElementsByClassName("asterisk")[0].style.display = "none";
      }
  })
});



function populateDays(month, previousDay, daySelect) {
  // delete the current set of <option> elements out of the
  // day <select>, ready for the next set to be injected
  while(daySelect.firstChild){
    daySelect.removeChild(daySelect.firstChild);
  }

  // Create variable to hold new number of days to inject
  var dayNum;

  // 31 or 30 days?
  if(month === '1' | month === '3' | month === '5' | month === '7' | month === '8' | month === '10' | month === '12') {
    dayNum = 31;
  } else if(month === '4' | month === '6' | month === '9' | month === '11') {
    dayNum = 30;
  } else {
  // If month is February, calculate whether it is a leap year or not
  var year = yearSelect.value;
  var isLeap = new Date(year, 1, 29).getMonth() == 1;
  isLeap ? dayNum = 29 : dayNum = 28;
  }

  // inject the right number of new <option> elements into the day <select>
  for(i = 1; i <= dayNum; i++) {
    var option = document.createElement('option');
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // if previous day has already been set, set daySelect's value
  // to that day, to avoid the day jumping back to 1 when you
  // change the year
  if(previousDay) {
    daySelect.value = previousDay;

    // If the previous day was set to a high number, say 31, and then
    // you chose a month with less total days in it (e.g. February),
    // this part of the code ensures that the highest day available
    // is selected, rather than showing a blank daySelect
    if(daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }

    if(daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }

    if(daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears(yearElement) {
  // get this year as a number
  var date = new Date();
  var year = date.getFullYear();

  // Make this year, and the 100 years before it available in the year <select>
  for(var i = 0; i <= 10; i++) {
    var option = document.createElement('option');
    option.textContent = year+i;
    yearElement.appendChild(option);
  }
}

var yearSelect = document.querySelector('#year');
var monthSelect = document.querySelector('#month');
var daySelect = document.querySelector('#day');
//preserve day selection
var previousDay;

populateDays(monthSelect.value, previousDay, daySelect);
populateYears(yearSelect);

// when the month or year <select> values are changed, rerun populateDays()
// in case the change affected the number of available days
yearSelect.onchange = function() {
  populateDays(monthSelect.value, previousDay, daySelect);
}

monthSelect.onchange = function() {
  populateDays(monthSelect.value, previousDay, daySelect);
}

// update what day has been set to previously
// see end of populateDays() for usage
daySelect.onchange = function() {
  previousDay = daySelect.value;
}



var endYearSelect = document.querySelector('#end-year');
var endMonthSelect = document.querySelector('#end-month');
var endDaySelect = document.querySelector('#end-day');

populateDays(endMonthSelect.value, endPreviousDay, endDaySelect);
populateYears(endYearSelect);
//preserve day selection
var endPreviousDay;

// when the month or year <select> values are changed, rerun populateDays()
// in case the change affected the number of available days
endYearSelect.onchange = function() {
  populateDays(endMonthSelect.value, endPreviousDay, endDaySelect);
}

endMonthSelect.onchange = function() {
  populateDays(endMonthSelect.value, endPreviousDay, endDaySelect);
}


// update what day has been set to previously
// see end of populateDays() for usage
endDaySelect.onchange = function() {
  endPreviousDay = endDaySelect.value;
}
