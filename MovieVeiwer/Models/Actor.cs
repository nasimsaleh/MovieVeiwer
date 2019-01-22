using System.Collections.Generic;

namespace MovieVeiwer.Models
{
    public class Actor
    {
        public string name { get; set; }
        public string id { get; set; }
        public string birthplace { get; set; }
        public List<Movie> Movies { get; set; }
    }
}