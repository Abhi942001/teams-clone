import { PrimaryButton } from "@fluentui/react/lib/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const {login } = useAuth();
  const history = useHistory();



  async function handleLogin() {
    await login();

    history.push("/Dashboard");
  }

  return (
    <div className="signIn">
      <div className="signIn-content">
        <div className="signIn-content-content">
          <h1 className="signIn-content-heading">Microsoft Teams</h1>
          <p className="signIn-content-para">
            Meet, chat, call, and collaborate in just one place.
          </p>
          <PrimaryButton
            style={{
              backgroundColor: "#4b53bc",
              borderColor: "white",
              minWidth: "230px",
              padding: "12px",
              minHeight: "20px",
            }}
            onClick={() => {
              handleLogin();
            }}
          >
            Sign in
          </PrimaryButton>
        </div>
      </div>
      <div className="signIn-image-div">
        <img
          src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWDeEK?ver=e1e6&q=90&m=2&h=768&w=1024&b=%23FFFFFFFF&aim=true"
          alt="TeamsImage"
          className="signIn-image"
        />
      </div>
    </div>
  );
};

export default SignIn;
