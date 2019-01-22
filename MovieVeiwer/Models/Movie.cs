using System.Collections.Generic;

namespace MovieVeiwer.Models
{

    public class Movie
    {
        public string title { get; set; }
        public string imdbId { get; set; }
        public int released { get; set; }
        public string tagline { get; set; }
        public string imageUrl { get; set; }
        
        public List<Actor> Actors { get; set; }
    }  
   
}