Tracklog.DistanceElevationPlot = function(container, tracksFetcher, distanceUnits) {
  this.container     = container;
  this.tracksFetcher = tracksFetcher;
  this.distanceUnits = distanceUnits;

  if(distanceUnits == "imperial"){
    alt_multiplier = 3.28084;
    dist_multiplier = 0.621371;
    dist_unit = "miles"
    alt_unit = "ft"
  } else
  if(distanceUnits == "metric"){
    alt_multiplier = 1;
    dist_multiplier = 1;
    dist_unit = "km"
    alt_unit = "m"
  };

  this.drawPlot();
};

Tracklog.DistanceElevationPlot.prototype.drawPlot = function() {
  var data = [["Distance", "Altitude"]],
      distance = 0,
      minElevation = Infinity;

  this.tracksFetcher.tracks.forEach(function(track) {
    data.push([(distance / 1000) * dist_multiplier, track.segments[0].start.elevation * alt_multiplier]);
    distance += track.segments[0].distance;

    minElevation = Math.min(minElevation * alt_multiplier, track.segments[0].start.elevation * alt_multiplier);

    track.segments.forEach(function(segment) {
      data.push([(distance / 1000) * dist_multiplier, segment.end.elevation * alt_multiplier]);
      distance += segment.distance;
      minElevation = Math.min(minElevation * alt_multiplier, segment.end.elevation * alt_multiplier);
    });
  });

  data = google.visualization.arrayToDataTable(data);

    new google.visualization.NumberFormat({
      pattern: "#.## "+dist_unit
    }).format(data, 0);

    new google.visualization.NumberFormat({
      pattern: "# "+alt_unit
    }).format(data, 1);

  var chart = new google.visualization.LineChart(document.getElementById(this.container));

  chart.draw(data, {
    title: "Distance–Altitude Profile",
    colors: ["green"],
    backgroundColor: {
      strokeWidth: 1,
      stroke: "#ddd",
    },
    legend: {
      position: "none"
    },
    vAxis: {
      title: "Altitude ("+alt_unit+")"
    },
    hAxis: {
      title: "Distance ("+dist_unit+")"
    }
  });
};
