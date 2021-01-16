let orgs = true;
let keyword = null;
let more = false;

function sortByDistance(coords, orgs) {
  let list = null;

  if (orgs) {
    list = document.getElementById("orgs-list")
  } else {
    list = document.getElementById("events-list")
  }

  list.childNodes.forEach(function (listing) {
    listing.dataDistance = turf.distance(coords, listing.dataCoords);
  });

  Array.from(list.childNodes).sort(function (a, b) {
    if (a.dataDistance > b.dataDistance) {
      return 1;
    }
    if (a.dataDistance < b.dataDistance) {
      return -1;
    }
    return 0;
  }).forEach(listing => {
    list.appendChild(listing);
  });

}

function listing(location, orgs) {
  if (orgs) {
    const orgsList = document.getElementById("orgs-list");

    const listing = orgsList.appendChild(document.createElement("div"));
    listing.className = "listing";
    listing.dataCoords = location.geometry.coordinates;
    listing.dataset.areasOfWork = location.properties[config.AREAS_OF_WORK].toLowerCase();
    listing.dataset.helpNeeded = location.properties[config.HELP_NEEDED].toLowerCase();
    listing.dataset.id = location.properties.Id;

    const picture = listing.appendChild(document.createElement("div"));
    picture.className = "listing-pic";
    picture.style.backgroundImage = "url('" + location.properties["Picture"] + "')";

    const right = listing.appendChild(document.createElement("div"));
    right.className = "listing-right";

    const top = right.appendChild(document.createElement("div"));
    top.className = "listing-top";
    const title = top.appendChild(document.createElement("span"));
    title.className = "listing-title";
    title.innerText = location.properties["Name"];
    const areas = top.appendChild(document.createElement("span"));
    areas.className = "listing-areas";
    let words = location.properties[config.AREAS_OF_WORK].split(",");
    words.map(word => {
      const category = areas.appendChild(document.createElement("span"));
      category.className = "category";
      category.innerText = word;
    })

    const description = right.appendChild(document.createElement("div"));
    description.className = "listing-description";
    description.innerHTML = "<p>" + location.properties["Description 1"] + "</p><p>" + location.properties["Description 2"] + "</p>" ;

    listing.addEventListener("click", function () {
      showLocation(location);
    });

  } else {
    const eventsList = document.getElementById("events-list");

    const listing = eventsList.appendChild(document.createElement("div"));
    listing.className = "listing";
    listing.dataCoords = location.geometry.coordinates;
    listing.dataset.areasOfWork = location.properties[config.AREAS_OF_WORK].toLowerCase();
    listing.dataset.helpNeeded = location.properties[config.HELP_NEEDED].toLowerCase();
    listing.dataset.id = location.properties.Id;

    const picture = listing.appendChild(document.createElement("div"));
    picture.className = "listing-pic";
    picture.style.backgroundImage = "url('" + location.properties["Picture"] + "')";

    const right = listing.appendChild(document.createElement("div"));
    right.className = "listing-right";

    const top = right.appendChild(document.createElement("div"));
    top.className = "listing-top";
    const title = top.appendChild(document.createElement("span"));
    title.className = "listing-title";
    title.innerText = location.properties["Name"];

    const rightright = top.appendChild(document.createElement("div"));
    rightright.className = "events-listing-right-right";

    const areas = rightright.appendChild(document.createElement("div"));
    areas.className = "listing-areas";
    let words = location.properties[config.AREAS_OF_WORK].split(",");
    words.map(word => {
      const category = areas.appendChild(document.createElement("span"));
      category.className = "category";
      category.innerText = word;
    })

    const when = rightright.appendChild(document.createElement("div"));
    when.className = "events-listing-when";
    when.innerHTML = location.properties["Start Date - Day"] + "/"
    + location.properties["Start Date - Month"] + " "
    // + location.properties["Start Date - Year"].substring(2) + " "
    + location.properties["Start Time - H"] + ":"
    + location.properties["Start Time - M"] + " - "
    + location.properties["End Time - H"] + ":"
    + location.properties["End Time - M"]
    ;

    const description = right.appendChild(document.createElement("div"));
    description.className = "listing-description event-listing-description";
    description.innerHTML = "<p>" + location.properties["Description 1"] + "</p><p>" + location.properties["Description 2"] + "</p>" ;

    listing.addEventListener("click", function () {
      showLocation(location);
    });
  }

}

function allListings(orgs) {
  if (orgs) {
    document.getElementById("orgs-list").style.display = "block";
  } else {
    document.getElementById("events-list").style.display = "block";
  }
}

function selectedListing(location) {

  if (location.properties["Picture"]) {
    document.getElementById("selected-pic").style.display = "block";
    document.getElementById("selected-pic").style.backgroundImage = "url('" + location.properties["Picture"] + "')";
  } else {
    document.getElementById("selected-pic").style.display = "none";
  }

  document.getElementById("selected-title").innerText = location.properties["Name"];
  document.getElementById("selected-specialisations").innerHTML = location.properties[config.AREAS_OF_WORK].replace(/,(?=[^\s])/g, ", ");

  if (location.properties[config.HELP_NEEDED]) {
    document.getElementById("selected-help").style.display = "block";
    document.getElementById("selected-help-categories").innerHTML = location.properties[config.HELP_NEEDED].replace(/,(?=[^\s])/g, ", ");
  } else {
    document.getElementById("selected-help").style.display = "none";
  }

  if (location.properties["Start Date - Day"]) {
    document.getElementById("when").style.display = "block";
    document.getElementById("when").innerHTML = location.properties["Start Date - Day"] + "/"
    + location.properties["Start Date - Month"] + " "
    // + location.properties["Start Date - Year"].substring(2) + " "
    + location.properties["Start Time - H"] + ":"
    + location.properties["Start Time - M"] + " - "
    + location.properties["End Time - H"] + ":"
    + location.properties["End Time - M"]
    ;

    document.getElementById("instagram").style.display = "none";
    document.getElementById("website").style.display = "none";
    document.getElementById("twitter").style.display = "none";

    if (location.properties["Eventbrite"]) {
      document.getElementById("eventbrite").style.display = "flex";
      const link = document.getElementById("eventbrite").getElementsByTagName("a")[0];
      link.href = location.properties["Eventbrite"];
      link.innerHTML = location.properties["Eventbrite"];
    } else {
      document.getElementById("eventbrite").style.display = "none";
    }

    if (location.properties["Facebook"]) {
      document.getElementById("facebook").style.display = "flex";
      const link = document.getElementById("facebook").getElementsByTagName("a")[0];
      link.href = location.properties["Facebook"];
      link.innerHTML = location.properties["Facebook"];
    } else {
      document.getElementById("facebook").style.display = "none";
    }

      document.getElementById("selected-description").innerHTML = "<p>" +
      location.properties["Description 1"] + "</p><p>" +
      location.properties["Description 2"] + "</p>";

  } else {

    document.getElementById("when").style.display = "none";
    document.getElementById("eventbrite").style.display = "none";

    if (location.properties["Website"]) {
      document.getElementById("website").style.display = "flex";
      const link = document.getElementById("website").getElementsByTagName("a")[0];
      link.href = location.properties["Website"];
      link.innerHTML = location.properties["Website"];
    } else {
      document.getElementById("website").style.display = "none";
    }

    if (location.properties["Facebook"]) {
      document.getElementById("facebook").style.display = "flex";
      const link = document.getElementById("facebook").getElementsByTagName("a")[0];
      link.href = location.properties["Facebook"];
      link.innerHTML = location.properties["Facebook"];
    } else {
      document.getElementById("facebook").style.display = "none";
    }

    if (location.properties["Instagram"]) {
      document.getElementById("instagram").style.display = "flex";
      const link = document.getElementById("instagram").getElementsByTagName("a")[0];
      link.href = location.properties["Instagram"];
      link.innerHTML = location.properties["Instagram"];
    } else {
      document.getElementById("instagram").style.display = "none";
    }

    if (location.properties["Twitter"]) {
      document.getElementById("twitter").style.display = "flex";
      const link = document.getElementById("twitter").getElementsByTagName("a")[0];
      link.href = location.properties["Twitter"];
      link.innerHTML = location.properties["Twitter"];
    } else {
      document.getElementById("twitter").style.display = "none";
    }

    document.getElementById("selected-description").innerHTML = "<p>" +
    location.properties["Description 1"] + "</p><p>" +
    location.properties["Description 2"] + "</p>";
  }

  document.getElementById("selected").scrollTop = 0;
  document.getElementById("lists").scrollTop = 0;
}
