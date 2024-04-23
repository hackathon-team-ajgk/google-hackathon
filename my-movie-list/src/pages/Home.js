import { useEffect } from "react";
import axios from "axios";

function Home() {
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      console.log(response.data);
    } catch (error) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request Error:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <h1>Home</h1>
    </>
  );
}

export default Home;
