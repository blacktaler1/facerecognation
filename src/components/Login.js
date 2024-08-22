import { useSelector } from "react-redux";
import { getActiveTab } from "../features/auth/authSlice";
import { PictureControls } from "./PictureControls";
export const Login = ({ enableInput }) => {
  const activeTab = useSelector(getActiveTab);

  return (
    <form
      className={"login100-form " + (activeTab === "login" ? "active" : "")}
    >
      <PictureControls />
    </form>
  );
};
