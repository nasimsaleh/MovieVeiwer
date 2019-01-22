var cy = {};
var layout = {
    name: 'cose-bilkent',
    animate: 'end',
    animationEasing: 'ease-out',
    animationDuration: 2000,
    randomize: true
}

var iterativeLayout = {
    name: 'cose-bilkent',
    randomize: false,
    animate: 'end',
    animationEasing: 'ease-out',
    animationDuration: 2000,


}

var panel = $("#movie-alert");

function initAll() {
    $("#actor-input").autocomplete({
        serviceUrl: '/api/Movie/GetActorSuggestions', 
        minChars: 2,
        onSelect: function (suggestion) {
           $("#actor-input").val(suggestion.value);
            $("#actor-id").val(suggestion.id);
        }
    });

    $("#actor-input").off('change').on('change', function () {
        $("#actor-id").val(0);
        $("#actor-input").val("");
    });

    $("#main-actor-shape").off('change').on('change', function () {
        var mainActorShape = $("#main-actor-shape").val();
        var mainActorColor = $("#main-actor-color").val();

        cy.style() 
            .selector('node[id="' + $("#actor-id").val() + '"]')
            .style({
                'background-color': mainActorColor,
                'label': 'data(name)',
                'shape': mainActorShape                
            })
            .update();
    });

    $("#main-actor-color").off('change').on('change', function () {
        var mainActorShape = $("#main-actor-shape").val();
        var mainActorColor = $("#main-actor-color").val();

        cy.style()
            .selector('node[id="' + $("#actor-id").val() + '"]')
            .style({
                'background-color': mainActorColor,
                'label': 'data(name)',
                'shape': mainActorShape,
               
            })
            .update();
    });

    $("#actor-shape").off('change').on('change', function () {
        var actorShape = $("#actor-shape").val();
        var actorColor = $("#actor-color").val();

        cy.style()
            .selector('node[type="actor"][id!="' + $("#actor-id").val() + '"]')
            .style({
                'background-color': actorColor,
                'label': 'data(name)',
                'shape': actorShape
            })
            .update();
    });

    $("#actor-color").off('change').on('change', function () {
        var actorShape = $("#actor-shape").val();
        var actorColor = $("#actor-color").val();

        cy.style()
            .selector('node[type="actor"][id!="' + $("#actor-id").val() + '"]')
            .style({
                'background-color': actorColor,
                'label': 'data(name)',
                'shape': actorShape
            })
            .update();
    });

    $("#movie-shape").off('change').on('change', function () {
        var movieShape = $("#movie-shape").val();
        var movieColor = $("#movie-color").val();

        cy.style()
            .selector('node[type="movie"]')
            .style({
                'background-color': movieColor,
                'label': 'data(name)',
                'shape': movieShape
            })
            .update();
    });

    $("#movie-color").off('change').on('change', function () {
        var movieShape = $("#movie-shape").val();
        var movieColor = $("#movie-color").val();

        cy.style()
            .selector('node[type="movie"]')
            .style({
                'background-color': movieColor,
                'label': 'data(name)',
                'shape': movieShape
            })
            .update();
    });
    
        

    $("#execute-query").off("click").on("click", function () {
        

      
        var actor = $("#actor-input").val().trim();
        var actorId = $("#actor-id").val().trim();

        if (actor == "" || actorId == 0) { 
            showAlert(panel, "Please choose an actor name from the suggestion list!");
            return;
        }
        var level = $("#level-input").val().trim();
        if (level == "" || parseInt(level) < 1) {
            showAlert("Please enter valid neighborhood level!");
            return;
        }


        beginLoading($("#execute-query"));

        $.ajax({
            url: '/api/movie/GetActorNeighborhood',
            data: { 'name': actor, 'id': actorId, 'level': level },
            type: 'GET',
            success: function (data) {
                
                var elements = [];

                $.each(data.nodes, function (i, item) {
                    elements.push({
                        data: { id: item.id, type: item.type, name: item.name, isbase: item.isbase }
                    });

                   

                });

                $.each(data.edges, function (i, item) {
                    elements.push({
                        data: { id: item.id, source: item.sourceId, target: item.targetId }
                    });
                                       
                });                                          


                drawGraph(elements);
                stopLoading($("#execute-query"));
               
            },
            error: function (error) { 
                stopLoading($("#execute-query"));
                showAlert(panel, error, "danger");
            },
            dataType: 'json'
        });



            
    });

}


function getMovieActors(imdbId, callback) {
    $.ajax({
        url: '/api/movie/GetMovieActors',
        data: { 'imdbId': imdbId},
        type: 'GET',
        success: function (data) {


            if (callback)
                callback(data);
            //var elements = [{
            //    data: { id: data.id, name: actor, type:'actor' }
            //}];

            //var elements = [];

            //$.each(data.nodes, function (i, item) {
            //    elements.push({
            //        data: { id: item.id, type: item.type, name: item.name, isbase: item.isbase }
            //    });



            //});


            //$.each(data.edges, function (i, item) {
            //    elements.push({
            //        data: { id: item.id, source: item.sourceId, target: item.targetId }
            //    });



            //});






            //drawGraph(elements);
        },
        error: function (error) {
            showAlert(panel, error);

        },
        dataType: 'json'
    });

}
function getActorMovies(actorId, callback) {
    $.ajax({
        url: '/api/movie/GetActorMovies',
        data: { 'actorId': actorId },
        type: 'GET',
        success: function (data) {

            if (callback)
                callback(data);

            //var elements = [{
            //    data: { id: data.id, name: actor, type:'actor' }
            //}];

            //var elements = [];

            //$.each(data.nodes, function (i, item) {
            //    elements.push({
            //        data: { id: item.id, type: item.type, name: item.name, isbase: item.isbase }
            //    });



            //});


            //$.each(data.edges, function (i, item) {
            //    elements.push({
            //        data: { id: item.id, source: item.sourceId, target: item.targetId }
            //    });



            //});






            //drawGraph(elements);
        },
        error: function (error) {
            showAlert(panel, error);

        },
        dataType: 'json'
    });

}


function drawGraph(elements) {
  
    var mainActorShape = $("#main-actor-shape").val();
    var mainActorColor = $("#main-actor-color").val();

    var actorShape = $("#actor-shape").val();
    var actorColor = $("#actor-color").val();

    var movieShape = $("#movie-shape").val();
    var movieColor = $("#movie-color").val();
   
    cy = cytoscape({
        container: document.getElementById('cy'), // container to render in
        elements: elements,
        style: [ // the stylesheet for the graph
            {
                selector: 'node[id="' + $("#actor-id").val() + '"]',
                style: {
                    'background-color': mainActorColor,
                    'label': 'data(name)',                    
                    'shape': mainActorShape,
                    'width': '15px',
                    'height': '15px',
                    'font-size': '10px'
                   
                }
            },
            {
                selector: 'node[type="actor"][id!="' + $("#actor-id").val() + '"]',
                style: {
                    'background-color': actorColor,
                    'label': 'data(name)',
                    'shape': actorShape,
                    'width': '5px',
                    'height': '5px',
                    'font-size': '8px'
                 
                }
            },

            {
                selector: 'node[type="movie"]',
                style: {
                    'background-color': movieColor,
                    'label': 'data(name)',
                    'shape': movieShape,
                    'width': '10px',
                    'height': '10px',
                    'font-size': '8px'
                  
                }
            },

            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'width': 1,
                    'line-color': 'pink',
                    'target-arrow-color': 'pink',
                    'target-arrow-shape': 'vee',
                    
                }
            }
        ],

        layout: layout
        
    });


    cy.contextMenus({
        menuItems: [
            {
                id: 'showMovies',
                content: 'Show Movies',
                tooltipText: 'Show Movies',
                 
                selector: 'node[type="actor"]',
                onClickFunction: function (event) {
                    var target = event.target || event.cyTarget;
                    var actorId = target.id();
                    var needsLayoutUpdate = false;
                  
                    getActorMovies(actorId, function (data) {
                        
                        $.each(data, function (i, movie) {
                            if (cy.$('#' + movie.imdbId).length == 0) {

                                needsLayoutUpdate = true;
                                cy.add({
                                    data: { id: movie.imdbId, type: "movie", name: movie.title, isbase: false },
                                    group: "nodes"
                                });

                              
                                cy.add({
                                    data: { id: actorId + "-" + movie.imdbId, source: actorId, target: movie.imdbId },
                                    group: "edges"

                                });
                              
                               
                            }
                            else if (cy.$('#' + actorId + "-" + movie.imdbId).length == 0)
                            {
                                needsLayoutUpdate = true;
                                cy.add({
                                    data: { id: actorId + "-" + movie.imdbId, source: actorId, target: movie.imdbId },
                                    group: "edges"

                                });
                              
                            }
                        });

                        if (needsLayoutUpdate) {
                            cy.layout(iterativeLayout).run();
                        } else {
                            showAlert( "All movies of this actor already in the graph no need to update layout!!");
                        }
                         
                        //cy.filter(function (element, i) {
                        //    return element.isNode() && $.inArray(element.data('id'), ids) > -1;
                        //}).layout(iterativeLayout).run();
                    });

                },
                hasTrailingDivider: true
            }, 
            {
                id: 'showActors',
                content: 'Show Actors',
                tooltipText: 'Show Actors', 
                selector: 'node[type="movie"]',
                onClickFunction: function (event) {
                    var target = event.target || event.cyTarget;
                    var movieId = target.id();                  
                    var needsLayoutUpdate = false;
                    getMovieActors(movieId, function (data) {
                        
                        $.each(data, function (i, actor) {
                            if (cy.$('#' + actor.id).length == 0) {

                                needsLayoutUpdate = true;
                                cy.add({
                                    data: { id: actor.id, type: "actor", name: actor.name, isbase: false },
                                    group: "nodes"
                                });

                                cy.add({
                                    data: { id: actor.id + "-" + movieId, source: actor.id, target: movieId },
                                    group: "edges"

                                });

                               
                            }
                            else if (cy.$('#' + actor.id + "-" + movieId).length == 0) {
                                needsLayoutUpdate = true;
                                cy.add({
                                    data: { id: actor.id + "-" + movieId, source: actor.id, target: movieId },
                                    group: "edges"

                                });

                            
                            }
                        });

                        if (needsLayoutUpdate) {
                            cy.layout(iterativeLayout).run();
                        } else {
                            showAlert("All actors of this movie already in the graph no need to update layout!!");
                        }
                       
                        //cy.layout(layout).run();
                        //cy.filter(function (element, i) {
                        //    return element.isNode() && $.inArray(element.data('id'), ids) > -1;
                        //}).layout(iterativeLayout).run();
                    });
                },
                hasTrailingDivider: true
            }, 
        ]
    });
 
     
}

function showAlert(message) {

    alert(message);
    //var element = document.activeElement;
    //$(panel).find(".alert").remove();
    //$(panel).prepend($('<div class="alert alert-'+ type +' alert-dismissible fade show" role="alert"> '+
    //    '<strong> Alert!</strong> ' + message + 
    //   ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> '+
    //  '  <span aria-hidden="true" >&times;</span> '+
    // ' </button> '+
    //    '</div>'));

    //$('.alert').alert();
    //$(element).focus();

}

var beginLoading = function (button) {
    $(button).attr("disabled", "disabled");
    $(button).find("i").addClass("fa-circle-o-notch fa-spin");
}
var stopLoading = function (button) {
    $(button).removeAttr("disabled");
    $(button).find("i").removeClass("fa-circle-o-notch fa-spin");
}