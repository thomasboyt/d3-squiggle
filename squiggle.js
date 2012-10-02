d3.squiggle = {

  // d3.squiggle.value: just randomly add # between (-wiggle_room, wiggle_room)
  value: function (original, wiggle_room_px) {          
    var wiggle = Math.random() * (wiggle_room_px * 2) - wiggle_room_px
    var wiggled = original + wiggle
    return wiggled
  },

  // d3.squiggle.linear_path: generate a squiggle-fied line from [x1, y1] to [x2, y2] with resolution res
  linear_path: function(args) { 

    var x1 = args.from_pt[0];
    var y1 = args.from_pt[1];
    var x2 = args.to_pt[0];
    var y2 = args.to_pt[1];

    var mode = args.mode || "x";
    var res = args.res || 1;
    var wiggle_room = args.wiggle || 1;

    var slope = (y2-y1)/(x2-x1);
    var intercept = y1 - slope* x1;
    var points = [];

    if (mode == "x") {
      for (var x = x1; x < x2; x += res) {
        var squig_x = this.value(x, wiggle_room);
        var squig_y = this.value(slope*x, wiggle_room) + intercept;
        points.push([squig_x, squig_y]);
      }
      
      if (!_.any(points, function(pt) {return pt[0] == x2} )) {
        points.push([x2, y2])
      }
      else {
        points[points.length - 1] = [x2, y2]
      }
    }
    else if (mode == "y") {
      for (var y = y1; y < y2; y += res) {
        if (slope == Infinity)
          var x = x1;
        else
          var x = (y-intercept)/slope
        var squig_x = this.value(x, wiggle_room);
        var squig_y = this.value(y, wiggle_room);
        points.push([squig_x, squig_y]);
      }

      if (!_.any(points, function(pt) {return pt[1] == y2} )) {
        points.push([x2, y2])
      }
      else {
        points[points.length - 1] = [x2, y2]
      }
    }
    
    return linedef = d3.svg.line()
      .x(function(d) {return d[0]})
      .y(function(d) {return d[1]})
      .interpolate("basis")
      (points);
  },

  x_axis_paths: function(args) {

    var x = args.x;
    var y = args.y;
    var length = args.length;

    var res = args.res || 4;
    var arrow_height = args.arrow_height || 4;
    var arrow_width = args.arrow_width || 10;

    var x_axis_line = this.linear_path({
        from_pt: [x, y],
        to_pt: [x+length, y],
        mode: "x",
        res: 4,
      });

    var x_arrow_path = this.linear_path({
        from_pt: [x+length - arrow_width, y - arrow_height],
        to_pt: [x+length, y],
        mode: "x",
        res: 4
      }) 
      + this.linear_path({
        from_pt: [x+length - arrow_width, y + arrow_height],
        to_pt: [x+length, y],
        mode: "x",
        res: 4
      });

    return {
      axis: x_axis_line,
      arrow: x_arrow_path
    };
  },

  y_axis_paths: function(args) {
    var x = args.x;
    var y = args.y;
    var height = args.height;

    var res = args.res || 4;
    var arrow_height = args.arrow_height || 10;
    var arrow_width = args.arrow_width || 4;

    var y_axis_line = this.linear_path({
        from_pt: [x, y],
        to_pt: [x, y+height],
        mode: "y",
        res: 4,
      });

    var y_arrow_path = 
      this.linear_path({
        from_pt: [x, y],
        to_pt: [x - arrow_width, y + arrow_height],
        mode: "y",
        res: 4
      })
      + this.linear_path({
        from_pt: [x, y],
        to_pt: [x + arrow_width, y + arrow_height],
        mode: "y",
        res: 4
      });

    return {
      axis: y_axis_line,
      arrow: y_arrow_path
    }
  }
}