import { useEffect, useState } from "react";
import "./UserProfile.css";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import MovieSlider from "../../components/MovieSlider";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const { getToken, getUsername, handleLogout } = useAuth();
  const username = getUsername();
  const [userData, setUserData] = useState({});
  const [userMovies, setUserMovies] = useState([]);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const maxLength = 100;

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.length <= maxLength) {
      setBio(value);
    }
  };

  const handleBioChange = async (userDetails) => {
    try {
      const token = getToken();
      const response = await axios.put(
        "http://localhost:3000/changeBio",
        userDetails,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Post Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    const getUserData = () => {
      const userString = localStorage.getItem("userData");
      if (userString) {
        const userObject = JSON.parse(userString);
        console.log(userObject);
        setUserData(userObject);
        setBio(userObject.bio);
        setUserMovies(
          userObject.movieData.watchedMovies.concat(
            userObject.movieData.watchLaterList
          )
        );
      }

      return null;
    };
    getUserData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userDetails = {
      username: username,
      bio: bio,
    };
    handleBioChange(userDetails);
    setIsEditingBio(false);
  };

  const deleteAccount = async () => {
    try {
      const token = getToken();
      const response = await axios.delete(
        "http://localhost:3000/delete-account",
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data);
      handleLogout();
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Delete Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <section id="profile-section" className="section-container">
        <div id="user-details" className="column-section">
          <div id="profile-name-bio" className="profile-details">
            <div className="avatar">
              <span>{username[0].toUpperCase()}</span>
            </div>
            <p id="profile-username" className="profile-field">
              {username}
            </p>
            {!isEditingBio ? (
              <>
                <p id="user-bio" className="profile-field">
                  {bio}
                </p>
                <button
                  id="edit-bio-btn"
                  className="bio-btn"
                  onClick={() => {
                    setIsEditingBio(true);
                  }}
                >
                  Edit Bio
                </button>
              </>
            ) : (
              <form id="user-profile-form" onSubmit={handleSubmit}>
                <textarea
                  className="bio"
                  value={bio}
                  maxLength={maxLength}
                  onChange={handleChange}
                  placeholder="Enter your bio..."
                />
                <div id="char-count">
                  Char count: {maxLength - bio.length}/{maxLength}
                </div>
                <div className="bio-btn-group">
                  <button id="submit-bio-btn" className="bio-btn" type="submit">
                    Submit bio
                  </button>
                  <button
                    id="cancel-btn"
                    className="bio-btn"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <p className="movies-stat">
              Movies Watched:{" "}
              {userMovies.length > 0 && userData.movieData.watchedMovies.length}
            </p>
            <button
              id="delete-account-btn"
              className="button"
              onClick={() => {
                deleteAccount();
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
        <div id="account-stats" className="column-section">
          {userMovies.length > 0 && (
            <MovieSlider genre="Movies In List" movies={userMovies} />
          )}
        </div>
      </section>
    </>
  );
}

export default UserProfile;
