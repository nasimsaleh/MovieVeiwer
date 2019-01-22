using MovieVeiwer.App_Start;
using MovieVeiwer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Neo4jClient.Cypher;

namespace MovieVeiwer.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var data = WebApiConfig.GraphClient.Cypher
          .Match("(movie:Movie {title:{title}})")
          .OptionalMatch("(movie)<-[r]-(person:Person)")
          .WithParam("title", "The Matrix")
          .Return((movie, a) => new
          {
              movie = movie.As<Movie>().title,
              cast = Return.As<IEnumerable<string>>("collect([person.name, head(split(lower(type(r)), '_')), r.roles])")
          })
          .Limit(1)
          .Results.FirstOrDefault();

            //var result = new MovieResult();
            ViewBag.movie = data.movie;

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}