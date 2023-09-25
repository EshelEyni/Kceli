import { Outlet, useParams } from "react-router-dom";
import "./ProfileDetails.scss";

const ProfileDetails = () => {
  const params = useParams();

  return (
    <main className="profile-details">
      <h1>Profile Details Page</h1>

      <Outlet />
    </main>
  );
};

export default ProfileDetails;
