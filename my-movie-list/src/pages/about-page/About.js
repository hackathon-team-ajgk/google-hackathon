import "./About.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProfileCard from "../../components/ProfileCard";
import { teamInfo } from "../../components/MemberInfo";
import "../../App.css";

function About() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <h2 className="page-heading">Our Objective</h2>
      <p>
        Our objective with this project was to faciliate the movie watching
        process for users. We wanted to create a website where users could
        create their own personalized list of movies and give the movies they've
        watched ratings. Sometimes, we're not sure what to watch and we just
        need some recommendations to help us out. That's where Google's AI tool
        'Gemini' comes in. Our goal was to use the power of Gemini to bring
        users movie recommendations based on a specific genre and their own
        movie list. Since Gemini will output something relatively new everytime,
        users will always have many options in terms of what to watch next, and
        even if they don't watch it right away, they can still add it to the
        "Watching Soon" section of their list. This way users have an organized
        list to save movies for watching later or for saving an already watched
        movie with a rating so they remember what movies they enjoyed and which
        ones they didn't. This idea helps users maintain a list that disregards
        what platform holds rights to that movie so they don't have to go
        searching all of their streaming apps looking for what film to see next.
      </p>
      <h2 className="page-heading">The Team</h2>
      <Carousel responsive={responsive}>
        {teamInfo.map((val, key) => (
          <ProfileCard key={`member-${key}`} member={val} />
        ))}
      </Carousel>
    </>
  );
}

export default About;
