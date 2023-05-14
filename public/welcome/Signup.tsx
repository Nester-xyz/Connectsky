import React, { useState } from "react";
import type { AtpAgentCreateAccountOpts, BskyAgent } from "@atproto/api";
import { HiEye } from "react-icons/hi";
import { HiEyeSlash } from "react-icons/hi2";
import { BsFillInfoCircleFill } from "react-icons/bs";

type Props = {
  attemptedLogin: boolean;
  setAttemptedLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInSuccess: boolean;
  setLoggedInSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSignUpClick: (value: boolean) => void;
  agent: BskyAgent;
};

interface IFormValues extends AtpAgentCreateAccountOpts {
  confirmPassword: "";
}

interface IShowPassword {
  password: boolean;
  confirmPassword: boolean;
}

const Signup: React.FC<Props> = (props) => {
  const [formValues, setFormValues] = React.useState<IFormValues>({
    email: "",
    password: "",
    handle: "",
    inviteCode: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<IShowPassword>({
    password: false,
    confirmPassword: false,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleValueChange = (event) => {
    if (errorMessage.length > 0) {
      setErrorMessage("");
    }
    setFormValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAccountCreate = async (event) => {
    try {
      event.preventDefault();
      console.log("Account Create click");
      if (formValues?.password !== formValues?.confirmPassword) {
        setErrorMessage("Password do not match. Please try again.");
        return;
      }
      await props.agent!.createAccount({
        email: formValues.email,
        password: formValues.password,
        handle: formValues.handle,
        inviteCode: formValues.inviteCode,
      });
    } catch (error) {
      setErrorMessage(error?.message);
    }
  };

  return (
    <>
      <div className="container">
        <div className="formTitle">
          <h1 className="login-heading">Create an account</h1>
        </div>
        <form id="login" className="loginForm" onSubmit={handleAccountCreate}>
          <div className="input-container">
            <div className="tooltip-container">
              {showTooltip && (
                <div className="tooltip">
                  Bluesky Social is currently invite only.
                </div>
              )}
            </div>
            <label htmlFor="inviteCode">
              Invite Code&nbsp;{" "}
              <div
                className="info-icon"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <BsFillInfoCircleFill />
              </div>
            </label>
            <input
              type="text"
              id="inviteCode"
              name="inviteCode"
              className="input-box"
              placeholder="bsky-social-xxxxx-xxxxx"
              onChange={handleValueChange}
              value={formValues.inviteCode}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-box"
              placeholder="john.doe@test.com"
              onChange={handleValueChange}
              value={formValues.email}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="handle">Handle</label>
            <input
              type="text"
              id="handle"
              name="handle"
              className="input-box"
              placeholder="john.bsky.social"
              onChange={handleValueChange}
              value={formValues.handle}
              required
            />
          </div>

          <div className="input-container password-container">
            <label htmlFor="password">Password</label>
            <div className="password-box">
              <input
                type={showPassword?.password ? "text" : "password"}
                id="password"
                name="password"
                className="input-box "
                placeholder="********"
                onChange={handleValueChange}
                value={formValues.password}
                required
              />
              <div className="password-icons">
                {showPassword?.password ? (
                  <HiEyeSlash
                    onClick={() =>
                      setShowPassword((previous) => ({
                        ...previous,
                        password: false,
                      }))
                    }
                  />
                ) : (
                  <HiEye
                    onClick={() =>
                      setShowPassword((previous) => ({
                        ...previous,
                        password: true,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="input-container password-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-box">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="input-box "
                placeholder="********"
                onChange={handleValueChange}
                value={formValues.confirmPassword}
                required
              />
              <div className="password-icons">
                {showPassword.confirmPassword ? (
                  <HiEyeSlash
                    onClick={() =>
                      setShowPassword((previous) => ({
                        ...previous,
                        confirmPassword: false,
                      }))
                    }
                  />
                ) : (
                  <HiEye
                    onClick={() =>
                      setShowPassword((previous) => ({
                        ...previous,
                        confirmPassword: true,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {errorMessage?.length > 0 && (
            <h5 className="login-msg"> {errorMessage}</h5>
          )}

          <button className="submit" type="submit">
            Create account
          </button>
          <div className="signUp">
            <p>
              Already have an account?{" "}
              <span
                className="strong"
                onClick={() => props.setSignUpClick(false)}
              >
                Sign in.
              </span>{" "}
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
export default Signup;
