import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, []);

  return <Fragment />;
};

export default RedirectComponent;
