import "./About.css";
import "../../App.css";
import Contact from "../../components/Contact";
import MemberCarousel from "../../components/MemberCarousel";
import arrow from "../../assets/images/Arrow.jpg";

function About() {
  return (
    <>
      <div className="about-container">
        <section className="about-heading-container">
          <h1 id="about-heading" className="page-heading">
            About Us
          </h1>
          <img id="arrow-image" src={arrow} alt="arrow" />
        </section>
        <section className="about-section">
          <div className="about-sub-container">
            <h2 className="page-heading">Our Objective</h2>
            <p id="objective" className="about-text">
              Our objective with this project was to faciliate the movie
              watching process for users. We wanted to create a website where
              users could create their own personalized list of movies and give
              the movies they've watched ratings. Sometimes, we're not sure what
              to watch and we just need some recommendations to help us out.
              That's where Google's AI tool 'Gemini' comes in. Our goal was to
              use the power of Gemini to bring users movie recommendations based
              on a specific genre and their own movie list.
            </p>
          </div>
        </section>
        <section className="about-section">
          <div className="about-sub-container">
            <h2 className="page-heading">Our Features</h2>
            <ul className="features">
              <li className="feature">
                Users can browse trending and popular movies in the database
                from the TMDB API. Movie names, titles, or even just keywords
                can be entered into the search bar to find a specific movie or
                movies with similar names.
              </li>
              <li id="second-feature" className="feature">
                Users can click on a movie to reveal movie metadata including
                the movie title, overview, genres, release date, etc. On this
                same screen users can give movies rating, but only if the movie
                is in their list and set to "Watched". Ratings range from 1-5 in
                the form of stars.
              </li>
              <li className="feature">
                Users can save movies to their list, more specifically either
                their "Watched" list or their "Watching Soon" list. Users will
                then get recommendations based on the movies in their list. This
                can be seen in the list page of our website. Recommendations are
                generated by Gemini.
              </li>
            </ul>
          </div>
        </section>
        <h2 className="page-heading">The Team</h2>
        <section id="carousel-section">
          <MemberCarousel />
        </section>
        <section id="contact-section">
          <Contact />
        </section>
      </div>
    </>
  );
}

export default About;
