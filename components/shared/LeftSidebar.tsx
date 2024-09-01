"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LeftSidebar() {
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "font-bold border-b-4 border-gray-800"}`}
            >
              <Image src={link.imgURL} alt={link.label} width={28} height={28} />
              <p className={`text-dark-3 max-lg:hidden`}>{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default LeftSidebar;
