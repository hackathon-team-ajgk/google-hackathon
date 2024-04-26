import { useEffect } from "react";
import "./UserProfile.css";
import axios from "axios";

function UserProfile() {
  // Function to get the user's username from localStorage
  const getUsername = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      const username = userObject.name;
      return username;
    }

    return null;
  };
  const username = getUsername();

  // Function to get the user's token from localStorage
  const getToken = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      const token = userObject.userToken;
      return token;
    }

    return null;
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = getToken();
        console.log(token);
        const response = await axios.get("http://localhost:3000/user", {
          headers: {
            authorization: token,
          },
          params: {
            username: username,
          },
        });
        console.log(response.data);
      } catch (error) {
        if (error.response) {
          // The server responded with a status code that falls out of the range of 2xx
          console.error("Get Error:", error.response.data);
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
    getUserInfo();
  }, [username]);

  return (
    <>
      <section id="profile-section" className="section-container">
        <div id="user-details" className="column-section">
          <div className="avatar">
            <span>{username[0]}</span>
          </div>
          <p id="profile-username">{username}</p>
        </div>
        <div id="account-stats" className="column-section"></div>
      </section>
    </>
  );
}

export default UserProfile;
