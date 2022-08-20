import useInput from "../hooks/useInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import Button from "react-bootstrap/Button";
import { prependBaseUri } from "../baseUri";

const Login = () => {
  const navigate = useNavigate();
  const email = useInput();
  const password = useInput();
  const { toggleAuth, isAuthenticated } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(prependBaseUri("/api/user/login"), {
        email: email.value,
        password: password.value,
      })
      .then((res) => res.data)
      .then((user) => {
        toggleAuth(user);
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, []);

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Email</label>
      <input
        style={{ borderWidth: "1px", borderRadius: "7px", paddingLeft: "10px" }}
        {...email}
      />
      <label>Password</label>
      <input
        type="password"
        style={{ borderWidth: "1px", borderRadius: "7px", paddingLeft: "10px" }}
        {...password}
      />
      <button style={{marginTop:'10px', borderRadius:'1px', borderRadius:'7px', padding:'6px', backgroundColor:'#00cc33', }}>Log in</button>
    </form>
  );
};

export default Login;
