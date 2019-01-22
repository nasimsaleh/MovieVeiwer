using MovieVeiwer.App_Start;
using System.Collections.Generic;
using System.Linq;
namespace MovieVeiwer.Models
{
    public class Neo4jDriver 
    {


        // Search Movies by the title and return top 20 Results
        public static List<Movie> SearchMoviesByTitle(string movieTitle)
        {
            var data = WebApiConfig.GraphClient.Cypher
               .Match("(m:Movie)")
               .Where("m.title =~ {title}")
               .WithParam("title", "(?i).*" + movieTitle + ".*")
               .With("{imdbId : m.imdbId, title: m.title} as movie")
               .Return<Movie>("movie")
               .Limit(20)
               .Results.ToList();
            return data;
            
        }
        
        // Get the movie given the provided Id
        public static Movie GetMovie(string movieId)
        {
            var data = WebApiConfig.GraphClient.Cypher
               .Match("(m:Movie)")
               .Where("m.imdbId = {imdbId}")
               .WithParam("imdbId", movieId)
               .With("{imdbId : m.imdbId, title: m.title} as movie")
               .Return<Movie>("movie")
               .Results.ToList();

            return data.FirstOrDefault();

        }

        // Get the Actors who acted in the movie with the given id
        public static List<Actor> GetMovieActors(string movieId)
        {
            var data = WebApiConfig.GraphClient.Cypher
               .Match("(m:Movie)<-[:ACTS_IN]-(a:Actor)")
               .Where("m.imdbId = {imdbId}")
               .WithParam("imdbId", movieId)
              .With("{id : a.id, name: a.name} as actor")
               .Return<Actor>("actor")
               .Results.ToList();

            return data;
        }

        // Search actors by the name and return top 20 results
        public static List<Actor> SearchActorByName(string actorName)
        {            

            var data = WebApiConfig.GraphClient.Cypher
               .Match("(a:Actor)")
               .Where("a.name =~ {name}")
               .WithParam("name", "(?i).*" + actorName + ".*")
               .With("{id : a.id, name: a.name} as actor")
               .Return<Actor>("actor")
               .Limit(20)
               .Results.ToList();

            return data;
        }

        // Get an actor gvien the actor id
        public static Actor GetActor(string actorId)
        {

            var data = WebApiConfig.GraphClient.Cypher
               .Match("(a:Actor)")
               .Where("a.id =~ {id}")
               .WithParam("id", actorId)
               .With("{id : a.id, name: a.name} as actor")              
               .Return<Actor>("actor")              
               .Results.ToList();

            return data.FirstOrDefault();
        }


        // Get the movies of a given actor given the actor id
        public static List<Movie> GetActorMovies(string actorId)
        {
           
            var data = WebApiConfig.GraphClient.Cypher
               .Match("(a:Actor)-[:ACTS_IN]->(m:Movie)")
               .Where("a.id = {id}")
               .WithParam("id", actorId)
               .With("{imdbId : m.imdbId, title: m.title} as movie")
               .Return<Movie>("movie")
               .Results.ToList();

            return data;
        }

    }
}