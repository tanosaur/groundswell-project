function backToAll() {
  clearPopup();
  sortByDistance(lastLocation.geometry.coordinates, orgs);
  allViewToggles();
  allListings(orgs)
}

function allViewToggles() {
  document.getElementById("selected").style.display = "none";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("toggles").style.display = "flex";
  document.getElementById("add-button").style.display = "flex";
}

function selectedViewToggles() {
  document.getElementById("toggles").style.display = "none";
  document.getElementById("orgs-list").style.display = "none";
  document.getElementById("events-list").style.display = "none";
  document.getElementById("add-button").style.display = "none";
  document.getElementById("selected").style.display = "block";
  document.getElementById("back-button").style.display = "flex";
}

document.getElementById("back-button").addEventListener("click", function() {
  backToAll();
});

document.getElementById("events-button").addEventListener("click", function() {
  orgs = false;
  document.getElementById("orgs-button").className = "toggle-unselected";
  document.getElementById("events-button").className = "toggle-selected";
  render();
});

document.getElementById("orgs-button").addEventListener("click", function() {
  orgs = true;
  document.getElementById("orgs-button").className = "toggle-selected";
  document.getElementById("events-button").className = "toggle-unselected";
  render();
});

document.getElementById("more-button").addEventListener("click", function() {
  if (more) {
    bringSelectedToTop();
    document.getElementById("all-filters").style.display = "none";
    document.getElementById("more-button").innerText = "More";
    _toggleDefaults();
    more = false;
  } else {
    document.getElementById("all-filters").style.display = "block";
    document.getElementById("more-button").innerText = "Less";
    more = true;
  }
});

// document.getElementById("keyword-search").focus({preventScroll: true});

document.getElementById("search-button").addEventListener("click", (e) => {
  keyword = document.getElementById("keyword-search").value.toLowerCase();
  if (keyword) {
    keywordSearch();
  }
});

document.getElementById("cancel-button").addEventListener("click", (e) => {
  _cancelKeywordSearch();
});

function _cancelKeywordSearch() {
  keyword = null;
  lastKeyword = null;
  render();
  document.getElementById("keyword-filter").remove();
  document.getElementById("keyword-search").value = "";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("search-button").style.display = "block"
}


document.getElementById('keyword-search').onkeydown = function(e){
   if(e.keyCode == 13){
     keyword = document.getElementById("keyword-search").value.toLowerCase();
     if (keyword) {
       keywordSearch();
     }
   }
};

function keywordSearch() {
  document.getElementById("searching").style.display = "block";
  document.getElementById("cancel-button").style.display = "block";
  document.getElementById("search-button").style.display = "none";
  render();
  if (keyword && keyword !== lastKeyword) {
    const selected = document.getElementById("selected-filters");
    let indicator = selected.insertBefore(document.createElement("div"), selected.firstChild);
    indicator.id = "keyword-filter";
    indicator.innerText = "Keyword: " + keyword;
    indicator.onclick = function() {
      _cancelKeywordSearch();
      indicator.remove();
    };
    lastKeyword = keyword;
  }
}

function toggleAreasFilter(area) {
  let index = areasOfWorkShowing.indexOf(area);
  if (index > -1 ) { //Has
    areasOfWorkShowing.splice(index, 1);
    render();
    removeFromSelected();
  } else { //Doesn't have
    areasOfWorkShowing.push(area);
    render();
  }
}

function toggleHelpFilter(area) {
  let index = helpNeededShowing.indexOf(area);
  if (index > -1 ) {
    helpNeededShowing.splice(index, 1);
    render();
    removeFromSelected();
  } else {
    helpNeededShowing.push(area);
    render();
  }
}

function _toggleDefaults() {
  const selected = document.getElementById("selected-filters");
  Array.from(selected.childNodes).map(filter => {
    if (!filter.className.includes("selected") && filter.className.includes("area")) {
      document.getElementById("areas-filters").appendChild(filter);
    } else if (!filter.className.includes("selected") && filter.className.includes("help")) {
      document.getElementById("help-filters").appendChild(filter);
    }
  });

  if (!selected.childNodes.length) {
    document.querySelectorAll(".area-filter").forEach(filter => {
      if (filter.innerText.toLowerCase() === "bame" || filter.innerText.toLowerCase() === "anti-hate" || filter.innerText.toLowerCase() === "interfaith") {
        selected.appendChild(filter);
      }
    });
  }

}


function removeFromSelected() {
  const selected = document.getElementById("selected-filters");
  selected.childNodes.forEach(filter => {
    if (filter.className.includes("area-filter") && !filter.className.includes("work-filter-selected")) {
      document.getElementById("areas-filters").appendChild(filter);
    } else if (filter.className.includes("help-filter") && !filter.className.includes("help-filter-selected")) {
      document.getElementById("help-filters").appendChild(filter);
    }
  });
  _toggleDefaults();
}

function bringSelectedToTop() {
  const selected = document.getElementById("selected-filters");

  document.querySelectorAll(".area-filter").forEach(filter => {
    if (filter.className.includes("work-filter-selected")) {
      selected.appendChild(filter);
    }
  });

  document.querySelectorAll(".help-filter").forEach(filter => {
    if (filter.className.includes("help-filter-selected")) {
      selected.appendChild(filter);
    }
  });

  if (keyword && keyword !== lastKeyword) {
    let indicator = selected.appendChild(document.createElement("div"));
    indicator.id = "keyword-filter";
    indicator.innerText = "Keyword: " + keyword;
    indicator.onclick = function() {
      _cancelKeywordSearch();
      indicator.remove();
    };
    lastKeyword = keyword;
  }
}


function _keywordOnly(orgs) {
  let list = null;
  let prefix = null;

  if (orgs) {
    list = document.getElementById("orgs-list");
    prefix = "orgs";
  } else {
    list = document.getElementById("events-list")
    prefix = "events";
  }

  list.childNodes.forEach(listing => {
    let title = listing.getElementsByClassName("listing-title")[0].innerText.toLowerCase();
    let description = listing.getElementsByClassName("listing-description")[0].innerHTML.toLowerCase();

    if (title.includes(keyword) || description.includes(keyword)) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
    } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
    }
  });
}

function _showAll(orgs) {
  if (orgs) {
    document.querySelectorAll(".orgs-marker").forEach(marker => {
      marker.style.display = "block";
    });
    document.getElementById("orgs-list").childNodes.forEach(listing => {
      listing.style.display = "flex";
    });
  } else {
    document.querySelectorAll(".events-marker").forEach(marker => {
      marker.style.display = "block";
    });
    document.getElementById("events-list").childNodes.forEach(listing => {
      listing.style.display = "flex";
    });
  }
}

function _filtersOnly(orgs) {
  let list = null;
  let prefix = null;

  if (orgs) {
    list = document.getElementById("orgs-list");
    prefix = "orgs";
  } else {
    list = document.getElementById("events-list")
    prefix = "events";
  }

  if (areasOfWorkShowing && !helpNeededShowing.length) {
    list.childNodes.forEach(listing => {
      if (areasOfWorkShowing.some(category => listing.dataset.areasOfWork.includes(category))) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  } else if (helpNeededShowing && !areasOfWorkShowing.length) {
    list.childNodes.forEach(listing => {
      if (helpNeededShowing.some(category => listing.dataset.helpNeeded.includes(category))) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  } else {
    list.childNodes.forEach(listing => {
      if (
        areasOfWorkShowing.some(category => listing.dataset.areasOfWork.includes(category))
        &&
        helpNeededShowing.some(category => listing.dataset.helpNeeded.includes(category))
      ) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  }
}

function _keywordAndFilters(orgs) {
  let list = null;
  let prefix = null;

  if (orgs) {
    list = document.getElementById("orgs-list");
    prefix = "orgs";
  } else {
    list = document.getElementById("events-list")
    prefix = "events";
  }

  if (areasOfWorkShowing && !helpNeededShowing.length) {
    list.childNodes.forEach(listing => {
      let title = listing.getElementsByClassName("listing-title")[0].innerText.toLowerCase();
      let description = listing.getElementsByClassName("listing-description")[0].innerHTML.toLowerCase();

      if (areasOfWorkShowing.some(category => listing.dataset.areasOfWork.includes(category))
        &&
        (title.includes(keyword) || description.includes(keyword))
      ) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  } else if (helpNeededShowing && !areasOfWorkShowing.length) {
    list.childNodes.forEach(listing => {
      let title = listing.getElementsByClassName("listing-title")[0].innerText.toLowerCase();
      let description = listing.getElementsByClassName("listing-description")[0].innerHTML.toLowerCase();

      if (helpNeededShowing.some(category => listing.dataset.helpNeeded.includes(category))
      &&
      (title.includes(keyword) || description.includes(keyword))
      ) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  } else {
    list.childNodes.forEach(listing => {
      let title = listing.getElementsByClassName("listing-title")[0].innerText.toLowerCase();
      let description = listing.getElementsByClassName("listing-description")[0].innerHTML.toLowerCase();

      if (
        areasOfWorkShowing.some(category => listing.dataset.areasOfWork.includes(category))
        &&
        helpNeededShowing.some(category => listing.dataset.helpNeeded.includes(category))
        &&
        (title.includes(keyword) || description.includes(keyword))
      ) {
        listing.style.display = "flex";
        document.getElementById(prefix+listing.dataset.id).style.display = "block";
      } else {
        listing.style.display = "none";
        document.getElementById(prefix+listing.dataset.id).style.display = "none";
      }
    });
  }
}

function render() {
  if (orgs) {
    document.querySelectorAll(".events-marker").forEach(marker => {
      marker.style.display = "none";
    });
    document.getElementById("events-list").style.display = "none";
    document.getElementById("orgs-list").style.display = "block";
  } else {
    document.querySelectorAll(".orgs-marker").forEach(marker => {
      marker.style.display = "none";
    });
    document.getElementById("orgs-list").style.display = "none";
    document.getElementById("events-list").style.display = "block";
  }

  document.getElementById("lists").scrollTop = 0;

  if (keyword && (!areasOfWorkShowing.length && !helpNeededShowing.length)) {
    _keywordOnly(orgs);
  } else if ((areasOfWorkShowing.length>0 || helpNeededShowing.length>0) && !keyword) {
    _filtersOnly(orgs);
  } else if ((areasOfWorkShowing.length>0 || helpNeededShowing.length>0) && keyword) {
    _keywordAndFilters(orgs);
  } else {
    _showAll(orgs);
  }

  document.getElementById("searching").style.display = "none";

}
