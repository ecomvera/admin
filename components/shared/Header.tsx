import { IoStorefront } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full fixed top-0 bg-white z-20 border-b-2">
      <div className="px-5 w-full sticky top-0 bg-white">
        <div className="flex justify-between gap-3 py-3 items-center">
          <div className="flex gap-3 items-center">
            {/* <IoStorefront className="text-3xl" /> */}
            <h2 className="text-2xl text-dark-3 font-bold uppercase tracking-wide">Silkyester</h2>
          </div>

          <div className="flex gap-5">
            <IoLogOutOutline className="text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
