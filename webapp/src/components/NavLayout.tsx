import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCircleArrowLeft,
  FaArrowRightFromBracket,
  FaBars,
} from "react-icons/fa6";
import { useAuth } from "../context/useAuth";
import Dropdown from "./Dropdown";
import useDropdown from "./useDropdown";
import { ConfirmationModalContext } from "./useConfirmationModal";

type Props = { children: React.ReactElement };

const NavLayout = ({ children }: Props) => {
  const { isOpen, setIsOpen } = useDropdown(false);
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showConfirmationModal } = useContext(ConfirmationModalContext);

  const handleLogout = () =>
    showConfirmationModal("Logout", "Are you sure you want to logout?", () => {
      console.log("logging out");
      logout();
    });

  const handleRecordingClick = () => {
    navigate("/recording");
    setIsOpen(false);
  };

  return (
    <div className="h-full">
      {
        <nav id="header" className="w-full fixed z-20">
          <div className="w-full bg-gray-200 flex flex-row justify-between items-center border-b-gray-300 shadow-md p-3 h-16">
            <Link className={`${pathname === "/" && "invisible"}`} to="/">
              <FaCircleArrowLeft className="text-2xl m-3 bg-transparent" />
            </Link>

            <Link to="/" className="h-full">
              <img className="h-full" src="/logo.png" alt="logo" />
            </Link>

            <div className="flex flex-row items-center">
              {/* {!pathname.includes("recording") && (
                <Link to="/recording">
                  <button className="btn btn-sm btn-secondary">
                    Recording
                  </button>
                </Link>
              )} */}

              <div className="ml-2">
                <Dropdown
                  isOpen={isOpen}
                  setOpen={setIsOpen}
                  display={<FaBars className="text-2xl m-3 bg-transparent" />}
                  dropdown={
                    <div className="dropdown-content menu z-9 shadow-lg bg-base-100 rounded-box -right-1 p-1">
                      <ul className="flex flex-col px-1">
                        <div className="border-b-2 last:border-b-0 border-gray-300">
                          <span
                            onClick={handleRecordingClick}
                            className="w-full inline-flex items-center justify-start m-2"
                          >
                            <div className="w-6 m-1 mr-5">
                              <img src="/TapeIcon.png" />
                            </div>
                            <span>Recording</span>
                            {/* <FaChevronRight className="ml-6" /> */}
                          </span>

                          <hr className="bg-gray-400" />
                          <span
                            onClick={handleLogout}
                            className="w-full inline-flex items-center justify-start m-2"
                          >
                            <div className="w-6 m-1 mr-5">
                              <FaArrowRightFromBracket className="text-lg mx-auto translate-x-[2px]" />
                            </div>
                            <span>Logout</span>
                          </span>
                        </div>
                      </ul>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </nav>
      }
      <div id="content" className={`h-full ${pathname !== "/qr" && `pt-16`}`}>
        {children}
      </div>
    </div>
  );
};

export default NavLayout;
