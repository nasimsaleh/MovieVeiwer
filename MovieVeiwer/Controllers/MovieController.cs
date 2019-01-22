using MovieVeiwer.App_Start;
using MovieVeiwer.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using static MovieVeiwer.Models.Constants;

namespace MovieVeiwer.Controllers
{
    [RoutePrefix("movie")]
    public class MovieController : ApiController
    {
        [HttpGet]

        public IHttpActionResult SearchMovieByTitle(string movieTitle)
        {
       
            var data = Neo4jDriver.SearchMoviesByTitle(movieTitle);
        
            return Ok(data.Select(c => new { movie = c }));
        }


        [HttpGet]

        public IHttpActionResult SearchActorByName(string actorName)
        {
          
            var data = Neo4jDriver.SearchActorByName(actorName);
          
            return Ok(data.Select(c => new { movie = c }));
        }


        [HttpGet]
        public IHttpActionResult GetMovieActors(string imdbId)
        {
         

            var data = Neo4jDriver.GetMovieActors(imdbId);
           

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetActorMovies(string actorId)
        {
            

            var data = Neo4jDriver.GetActorMovies(actorId);
           

            return Ok(data);
        }

       
      

        [HttpGet]
        public IHttpActionResult GetActorNeighborhood(string id, string name, int level)
        {

            List<Node> nodes = new List<Node>();
            List<Edge> edges = new List<Edge>();

            List<string> fetchedMoviesIds = new List<string>();
            List<string> fetchedActorsIds = new List<string>();

            nodes.Add(new Node
            {
                id = id.ToString(),
                type = "actor",
                name = name,
                isbase = true
            });

            List<string> actorIds = new List<string> { id };
            List<string> movieIds = new List<string>();

            for (int i = 0; i < level; i++)
            {

                var newActorIds = actorIds.Where(x => !fetchedActorsIds.Any(y=> y==x)).Distinct().ToList();
                var data = WebApiConfig.GraphClient.Cypher
               .Match("(a:Actor)-[:ACTS_IN]->(m:Movie)")
               .Where("a.id IN {actorIdsList}")
               .WithParam("actorIdsList", newActorIds)
               .With(" a , collect(m) AS movies")
               .Return((a, movies) => new { Actor = a.As<Actor>(), Movies = movies.As<List<Movie>>() })
                .Results.ToList();


                fetchedActorsIds.AddRange(newActorIds);
                movieIds = new List<string>();
                foreach (var item in data)
                {
                    foreach(var movie in item.Movies)
                    {
                        nodes.Add(new Node
                        {
                            id = movie.imdbId,
                            name = movie.title,
                            type = NodeType.Movie
                        });

                        edges.Add(new Edge
                        {
                            id = item.Actor.id + "-" + movie.imdbId,
                            sourceId = item.Actor.id,
                            targetId = movie.imdbId
                        });

                        movieIds.Add(movie.imdbId);
                    }
                }
               
                var newMovieIds = movieIds.Where(x => !fetchedMoviesIds.Any(y => y == x)).Distinct().ToList();
                var actorsData = WebApiConfig.GraphClient.Cypher
               .Match("(m:Movie)<-[:ACTS_IN]-(a:Actor)")
               .Where("m.imdbId IN {moviesIdsList}")
               .WithParam("moviesIdsList", newMovieIds)
               .With(" m, collect(a) AS actors")
               .Return((m, actors) => new { Movie = m.As<Movie>(), Actors = actors.As<List<Actor>>() })               
               .Results.ToList();

                fetchedMoviesIds.AddRange(newMovieIds);

                actorIds = new List<string>();
                foreach (var item in actorsData)
                {
                    foreach (var actor in item.Actors)
                    {
                       

                        nodes.Add(new Node
                        {
                            id = actor.id.ToString(),
                            name = actor.name,
                            type = NodeType.Actor
                        });
                       

                        edges.Add(new Edge
                        {
                            id = actor.id + "-" + item.Movie.imdbId,
                            sourceId = actor.id,
                            targetId = item.Movie.imdbId
                        });

                        actorIds.Add(actor.id);
                    }
                }
            }

            var resultNodes = nodes.GroupBy(node => node.id).Select(g => g.First()).ToList();
            var resultEdges = edges.GroupBy(edge => edge.id).Select(g => g.First()).ToList();
            return Ok(new
            {
                nodes = resultNodes,
                edges = resultEdges
            });
        }


        [HttpGet]
        public IHttpActionResult GetActor(string actorId)
        {
          
            var data = Neo4jDriver.GetActor(actorId);
         

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetMovie(string imdbId)
        {
          
            var data = Neo4jDriver.GetMovie(imdbId);
         

            return Ok(data);
        }


        [HttpGet]
        public IHttpActionResult GetActorSuggestions(string query)
        {
            var data = Neo4jDriver.SearchActorByName(query);

            return Ok(new
            {
                suggestions = data.Select(a => new
                {
                    data = a.name,
                    value = a.name,
                    id = a.id
                })
            });
        }
    }
}