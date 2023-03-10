import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebase";
import axios from "axios";
import config from "../../../utils/constants";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import GoToChatWidget from "../../GroupChat/GoToChatWidget";

export default function UserGroup({ user }) {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [currentTrip, setCurrentTrip] = useState([]);
  const [firstGroupTrip, setFirstGroupTrip] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isUserAdmin, SetIsUserAdmin] = useState(false);

  const location = useLocation();
  let link_group_id;
  if (location?.state !== null) {
    link_group_id = location?.state;
  }

  function get_groups_ids() {
    setGroupIds(groups.map((group) => group._id));
  }

  const get_trips = async () => {
    await axios
      .get(`${config.VITE_SERVER_API}/get_all_trips`, {
        params: {
          groupIds: groupIds,
        },
      })
      .then((res) => {
        if (res?.data) {
          setTrips(res?.data);
        } else {
          Swal.fire({
            title: "No trips found in the database",
            text: "No trips data found. Database empty",
            icon: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#3085d6",
          });
        }
      });
  };

  const get_groups = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .get(`${config.VITE_SERVER_API}/user_group_info`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res?.data) {
                setGroups(res?.data);
              } else {
                Swal.fire({
                  title: "No trips found in the database",
                  text: "No trips data found. Database empty",
                  icon: "warning",
                  allowOutsideClick: false,
                  confirmButtonColor: "#3085d6",
                });
              }
            });
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User might be logged out --" + err,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    get_groups();
  }, []);

  useEffect(() => {
    get_groups_ids();
  }, [groups]);

  useEffect(() => {
    get_trips();
  }, [groupIds]);

  useEffect(() => {
    setFirstGroupTrip(
      trips.filter((trip) => trip?.group_id?._id === groups[0]?._id)
    );
  }, [trips]);

  useEffect(() => {
    SetIsUserAdmin(
      currentGroup[0]?.group_admin?._id === user?._id ||
        groups[0]?.group_admin?._id === user?._id
    );
  }, [currentGroup, groups]);

  useEffect(() => {
    setCurrentGroup(
      groups.filter((group) => link_group_id?.link_group_id === group._id)
    );
    setCurrentTrip(
      trips.filter(
        (trip) => trip?.group_id?._id === link_group_id?.link_group_id
      )
    );
  }, [link_group_id]);

  return (
    <>
      {!trips || trips.length === 0 ? (
        <div className="circle-ripple unravel_loading"></div>
      ) : (
        <>
          <GoToChatWidget group={currentGroup[0] || groups[0]} />
          <div className="absolute z-10 w-full">
            <p className="Oswald-font mt-20 pt-1 bg-primaryColor/30 backdrop-blur-md sm:mx-16 mx-5 rounded font-bold text-center pb-2 text-lightColor ">
              My groups
            </p>
            <div className="mx-5 rounded sm:mx-16 overflow-x-scroll flex backdrop-blur-xl bg-secondaryColor/30">
              {groups.map((group) => (
                <Link
                  key={group?._id}
                  to="/user/group"
                  state={{ link_group_id: group?._id }}
                  className="w-32 m-2 flex flex-col justify-center rounded cursor-pointer hover:shadow-md hover:shadow-gray-600/50 shadow shadow-lightColor/10 h-12 bg-lightColor/50"
                >
                  <p className="text-xs font-semibold pl-2 py-4 w-32 truncate hover:text-clip backdrop-blur-lg rounded text-gray-600">
                    {group.name}
                  </p>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-12">
              <div className="bg-lightColor/30 backdrop-blur-xl  grid grid-cols-12 col-span-12 sm:h-24 h-20 mt-4 sm:mx-16 mx-5 z-10 rounded-md">
                <div className="sm:col-span-2 col-span-4 justify-center flex">
                  <img
                    className="rounded-full h-20 w-20 sm:w-28 sm:h-28 object-cover mt-6 sm:mt-5"
                    src={
                      currentGroup[0]?.group_profile ||
                      groups[0]?.group_profile ||
                      "/group_default_profile.jpg"
                    }
                    alt="user_profile"
                  />
                </div>
                <div className="sm:col-span-3 col-span-4 relative">
                  <div className="sm:bottom-11 bottom-8 absolute left-0">
                    <p className="text-gray-600 font-bold text-shadow sm:text-xl">
                      {currentGroup[0]?.name || groups[0]?.name}
                    </p>
                    <p className="text-gray-600 font-light sm:text-base text-xs text-shadow flex justify-between">
                      {currentGroup[0]?.members.length ||
                        groups[0]?.members.length}{" "}
                      {currentGroup[0]?.members.length <= 1 ||
                      groups[0]?.members.length <= 1
                        ? "member"
                        : "members"}
                    </p>
                  </div>
                </div>
                {isUserAdmin &&
                  (link_group_id === undefined ? (
                    <Link
                      to="/user/edit/group"
                      className="left-0"
                      state={{ link_group_id: groups[0]?._id }}
                    >
                      <PencilSquareIcon
                        className="h-8 w-8 text-lightColor absolute m-3 cursor-pointer hover:text-accentColor right-0"
                        aria-hidden="true"
                      />{" "}
                    </Link>
                  ) : (
                    <Link
                      to="/user/edit/group"
                      className="left-0"
                      state={link_group_id}
                    >
                      {" "}
                      <PencilSquareIcon
                        className="h-8 w-8 text-lightColor absolute m-3 cursor-pointer hover:text-accentColor right-0"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
              </div>
              <div className="grid grid-cols-12 col-span-12 sm:h-24 h-20 sm:mx-16 mx-5 rounded-md">
                <div className="sm:col-span-6 col-span-12 rounded-md bg-secondaryColor/60 backdrop-blur-xl my-4 mr-2">
                  <p className="mt-8 text-center text-xl font-semibold text-gray-600">
                    Members
                  </p>
                  <div className="px-10 mx-1 rounded-md py-2 mb-6 shadow-xl text-gray-600 bg-lightColor/20 h-64 overflow-y-scroll">
                    {currentGroup[0]?.members
                      ? currentGroup[0]?.members.map((member, i) => (
                          <div key={member?._id} className="flex py-1">
                            <p className="mt-1 mr-9">{i + 1}.</p>
                            <img
                              src={
                                member?.profile_photo || "/profile-setup.gif"
                              }
                              alt="dp"
                              className="rounded-full mr-6 w-9 h-9 object-cover"
                            />
                            <p className="mt-1 mr-9 truncate">
                              {member?.first_name + " " + member?.last_name}
                            </p>
                            {currentGroup[0]?.group_admin?._id ===
                            member?._id ? (
                              <p className="mt-1 ml-auto">Admin</p>
                            ) : (
                              <p></p>
                            )}
                          </div>
                        ))
                      : groups[0]?.members.map((member, i) => (
                          <div key={member?._id} className="flex py-1">
                            <p className="mt-1 mr-9">{i + 1}.</p>
                            <img
                              src={
                                member?.profile_photo || "/profile-setup.gif"
                              }
                              alt="dp"
                              className="rounded-full mr-6 w-9 h-9 object-cover"
                            />
                            <p className="mt-1 mr-9 truncate">
                              {member?.first_name + " " + member?.last_name}
                            </p>
                            {groups[0]?.group_admin?._id === member?._id ? (
                              <p className="mt-1 ml-auto">Admin</p>
                            ) : (
                              <p></p>
                            )}
                          </div>
                        ))}
                  </div>
                </div>
                <div className="sm:col-span-6 col-span-12 rounded-md bg-secondaryColor/60 backdrop-blur-xl my-4 ml-2">
                  <p className="mt-8 text-center text-xl font-semibold text-gray-600">
                    Trips
                  </p>
                  <div className="px-8 mx-1 rounded-md py-2 mb-6 shadow-xl text-gray-600 bg-lightColor/20 h-64 overflow-y-scroll">
                    {currentTrip.length === 0 && link_group_id === undefined ? (
                      firstGroupTrip.map((trip, i) => (
                        <div key={trip?._id} className="flex mb-4 relative">
                          <p className="m-1">{i + 1}.</p>
                          <img
                            src={
                              trip?.trip_location?.images?.photos[0].src
                                ?.original || "/profile-setup.gif"
                            }
                            alt="dp"
                            className="rounded-full w-10 h-10 mx-4 object-cover"
                          />
                          <p className="mt-1 truncate">
                            {trip?.trip_location?.address?.spot +
                              ", " +
                              trip?.trip_location?.address?.state +
                              ", " +
                              trip?.trip_location?.address?.country}
                          </p>
                          <p className="text-xs w-28 mt-2 absolute font-light inset-1/2">
                            {trip?.trip_status}
                          </p>
                        </div>
                      ))
                    ) : currentTrip.length != 0 &&
                      link_group_id != undefined ? (
                      currentTrip.map((trip, i) => (
                        <div key={trip?._id} className="flex mb-4 relative">
                          <p className="m-1">{i + 1}.</p>
                          <img
                            src={
                              trip?.trip_location?.images?.photos[0].src
                                ?.original || "/profile-setup.gif"
                            }
                            alt="dp"
                            className="rounded-full w-9 h-9 mx-4 object-cover"
                          />
                          <p className="mt-1 truncate">
                            {trip?.trip_location?.address?.spot +
                              ", " +
                              trip?.trip_location?.address?.state +
                              ", " +
                              trip?.trip_location?.address?.country}
                          </p>
                          <p className="text-xs w-28 mt-2 absolute font-light inset-1/2">
                            {trip?.trip_status}
                          </p>
                        </div>
                      ))
                    ) : (
                      <>
                        <p className="font-light text-center">No trips found</p>
                        <p className="font-light text-center">
                          Select another group
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="object-center h-screen object-cover w-screen blur-md z-0"
            src={
              currentGroup[0]?.group_profile ||
              groups[0]?.group_profile ||
              "/group_default_profile.jpg"
            }
            alt=""
          />
        </>
      )}
    </>
  );
}
