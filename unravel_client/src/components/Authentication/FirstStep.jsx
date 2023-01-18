import React from "react";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginBg from "./LoginBg";

const FirstStep = (props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      username: user.username,
    },
  });

  const onSubmit = (data) => {
    props.updateUser(data);
    navigate("/signup/2");
    console.log(data);
  };
  return (
    <>
      <Header {...props} router={{ location }} />
      <form
        className="p-20 justify-center flex"
        onSubmit={handleSubmit(onSubmit)}
      >
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
        >
          <div className="group relative">
            <label className="absolute form--label">Name</label>
            <input
              className={`form--input ${errors.name ? "input-error" : ""}`}
              type="text"
              placeholder={
                errors.name ? errors.name.message : "Enter your name"
              }
              autoComplete="off"
              {...register("name", {
                required: "Name is required.",
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Name should contain only characters.",
                },
              })}
            />
          </div>

          <div className="group relative mt-6">
            <label className="absolute form--label">User Name</label>
            <input
              className={`form--input ${errors.username ? "input-error" : ""}`}
              type="text"
              placeholder={
                errors.username
                  ? errors.username.message
                  : "Enter your username"
              }
              autoComplete="off"
              {...register("username", {
                required: "username is required.",
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message:
                    "username should contain only characters and number.",
                },
              })}
            />
          </div>
          <div className="flex justify-between mt-4">
            <button className="btn btn--primary" type="submit">
              Next
            </button>
            <Link className="btn my-5 btn--secondary" to="/signin">
              Already have an account
            </Link>
          </div>
        </motion.div>
      </form>

      {/* Waves Container */}
      <div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#c19892" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#d8d7d7" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#bebfbd" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f3f1ef" />
          </g>
        </svg>
      </div>
      {/* Waves end */}
    </>
  );
};

export default FirstStep;
