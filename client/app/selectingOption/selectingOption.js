angular.module( 'moviematch.selectingOption', [] )


.controller( 'SelectingOptionController', function( $scope, Votes, Session, Socket, $location, Auth, $routeParams, FetchMovies, $timeout, FetchGenres ) {

  var category = $location.path().split('/')[2];
  var seconds = 30;
  var optionsVotedFor = [];
  var maxNumVotes = 3;

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  $scope.vote = function(option){
    var optionIndex = optionsVotedFor.indexOf(option.id);
    if(optionIndex > -1){//if already voted for that option, we will remove the vote
      var addVote = false;
      optionsVotedFor.splice(optionIndex, 1);
    } else { // if not we'll add it 
      if(optionsVotedFor.length < maxNumVotes){
        var addVote = true;
        optionsVotedFor.push(option.id);
      }
    }

    voteDate = {
      sessionName: $scope.session.sessionName, 
      id: option.id, 
      addVote: addVote
    };

    Votes.addVote(voteDate);
    
  };

  var tallyVotes = function(){
   var winnerArr = Votes.tallyVotes($scope.options);
    if( winnerArr.length === 1 ) { //when there's a winner
      Session.setSelectedOption(winnerArr[0]);
      Socket.removeAllListeners("voteAdded");
      $location.path('/selected/'+category);
    } else { //when there's a tie
      $scope.options = winnerArr;
      optionsVotedFor =[];
      maxNumVotes = 1;
      //if tie twice in a row, we want to remove an option
      setTimer(seconds);
    }
  }

  var setTimer = function(seconds){
    $scope.counter = seconds;
    $scope.timer = function(seconds){
      var countdown = $timeout($scope.timer,1000);
      $scope.counter -= 1;
      if( $scope.counter === 0 ){
        //when the timer reaches zero, make it stop
        $timeout.cancel(countdown);
        tallyVotes();
      }
    }
    $scope.timer();
  };
  
  setTimer(seconds);

  if(category === 'genre'){//fetching genres 
    var data = FetchGenres.getGenresArr();
    data.forEach(function(option){
        option.votes = 0; 
    });
    $scope.options = data;

  } else {//fetching movies is synchronous because we already made the api call 
    var data = FetchMovies.getMoviesArr();
    data.forEach(function(option){
        option.votes = 0; 
    });
    $scope.options = data;
  }

  //this will update our d3 animations eventually 
  Socket.on( 'voteAdded', function(vote) {
    console.log('added a vote:', vote);
    //update our array of options to reflect the new vote
    $scope.options = Votes.receiveVote(vote.id, $scope.options, vote.addVote);
  });

})

.directive('bubbles', ['$window', '$timeout', function($window, $timeout) {
  return {
    restrict: 'E',
    scope: {
      data: '='
      //sendVote: '&'
    },
    link: function(scope, ele, attrs) {
      var width = 980,
          height = 510,
          data = scope.$parent.options;
          allNodes = null,
          allLabels = null,
          margin = {top: 50, right: 0, bottom: 0, left: 0},
          maxRadius = 50,
          rScale = d3.scale.sqrt().range([0, maxRadius]),
          rValue = function(d) {return parseInt(d.votes)+1},//To show bubbles, we need count of at least 1
          idValue = function(d) {return d.id},
          textValue = function(d) {return d.title},
          collisionPadding = 4,
          minCollisionRadius = 12,
          jitter = 0.5;

      var tick = function(e) {
        var dampenedAlpha = e.alpha * 0.1;
        allNodes.each(gravity(dampenedAlpha))
                .each(collide(jitter))
                .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"});
        
        allLabels.style("left", function(d) {return ((margin.left + d.x) - d.dx / 2) + "px"})
                 .style("top", function(d) {return ((margin.top + d.y) - d.dy / 2) + "px"});
      };

      var force = d3.layout.force()
                    .gravity(0)
                    .charge(0)
                    .size([width, height])
                    .on("tick", tick);

      var update = function() {
        maxDomainValue = d3.max(data, function(d) {return rValue(d);});
        rScale.domain([0, maxDomainValue]); //Sets the bubble sizing scale;
        data.forEach(function(d, i){return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)))});
        force.nodes(data).start();
        updateNodes();
        updateLabels();
      };

      var updateNodes = function() {
        allNodes = bubbleGroup.selectAll(".bubble-node").data(data, function(d) {return idValue(d)});
        //Format existing circles
        allNodes.selectAll("circle")
                .attr("r", function(d){return rScale(rValue(d));});

        allNodes.exit().remove(); //Remove unused nodes

        allNodes.enter()
                .append("a")
                .attr("class", "bubble-node")
                .call(force.drag)
                .call(connectEvents)
                .append("circle")
                .attr("r", function(d){return rScale(rValue(d));});
      };

      var updateLabels = function() {
        allLabels = labelGroup.selectAll(".bubble-label")
                              .data(data, function(d){return idValue(d)});

        allLabels.exit().remove(); //Remove unused labels

        //Add text and count to label
        var labelsEnter = allLabels.enter()
                                   .append("div")
                                   .attr("class", "bubble-label")
                                   .text(function(d) {return textValue(d)})
                                   .call(force.drag)
                                   .append("div")
                                   .attr("class", "bubble-label-value")
                                   .text(function(d) {return rValue(d)});

        allLabels.style("font-size", function(d) {return Math.max(12, rScale(rValue(d) / 8)) + "px"})
                 .style("width", function(d) {return 2.5 * rScale(rValue(d)) + "px"});

        //Trick to get correct dx value. After getting it, we delete span
        allLabels.append("span").text(function(d) {return textValue(d)})
         .each(function(d) {
           return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
         })
         .remove();

        allLabels.style("width", function(d) {return d.dx + "px"});

        /***************This -100 is not supposed to be needed ***************/
        allLabels.each(function(d){return d.dy = -90+this.getBoundingClientRect().height});
      };

      var gravity = function(alpha) {
        var cx = width / 2;
        var cy = height / 2;
        var ax = alpha / 2; // Determines the shape of the pulled together circles
        var ay = alpha / 2; // Determines the shape of the pulled together circles
        return function(d) {
          d.x += (cx - d.x) * ax;
          d.y += (cy - d.y) * ay;
        };
      };

      var collide = function(jitter) {
        return function(d) {
          data.forEach(function(d2) {
            if (d !== d2) {
              var x = d.x - d2.x;
              var y = d.y - d2.y;
              var distance = Math.sqrt(x * x + y * y);
              var minDistance = d.forceR + d2.forceR + collisionPadding;
              if (distance < minDistance) {
                distance = (distance - minDistance) / distance * jitter;
                var moveX = x * distance;
                var moveY = y * distance;
                d.x -= moveX;
                d.y -= moveY;
                d2.x += moveX;
                return d2.y += moveY;
              }
            }
          });
        };
      };

      var connectEvents = function(d) {
        d.on("click", click);
        d.on("mouseover", mouseover);
        d.on("mouseout", mouseout);
      };

      var mouseover = function(d) {
        allNodes.classed("bubble-hover", function(node) {return node === d});
      };

      var mouseout = function(d) {
        allNodes.classed("bubble-hover", false);
      };

      var click = function(d) {
        scope.$parent.vote(d);
        if (d3.event.defaultPrevented) return; // click suppressed when dragging
        d3.event.preventDefault();
        if(d3.select(this).classed("bubble-selected")){
          d3.select(this).classed("bubble-selected",false) 
        } else {
          d3.select(this).classed("bubble-selected",true)
        };
        
        update();
      };


      var svg = d3.select(ele[0]).selectAll("svg").data([data]);

      var svgEnter = svg.enter().append("svg");
      svg.attr("width", "100%");
      svg.attr("height", "100%");

      bubbleGroup = svgEnter.append("g")
                     .attr("id", "bubble-nodes")
                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // bubbleGroup.append("rect")
      //            .attr("id", "bubble-background")
      //            .attr("width", "100%")
      //            .attr("height", "100%")

      labelGroup = d3.select(ele[0]).selectAll("#bubble-labels").data([data])
                                    .enter()
                                    .append("div")
                                    .attr("id", "bubble-labels");
      
      // $window.onresize = function() {
      //   var w = ele.clientWidth;
      //   var h = ele.clientHeight;
      //   console.log(ele);
        //console.log(angular.element($window)[0].innerWidth);
        //update();
        //scope.$apply();
      // };

      // scope.$watch(function() {
      //   return angular.element($window)[0].innerWidth;
      // }, function() {
      //   update();
      // });

      scope.$watch('$parent.options', function(newData) {
        if (!newData) return;
        data = newData;
        update();
      }, true);
  }}
}])