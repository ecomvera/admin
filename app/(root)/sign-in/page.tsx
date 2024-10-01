"use client";

import { useAuthStore } from "@/stores/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./style.css";
import { error, generareHash } from "@/lib/utils";
import { FaBuildingLock } from "react-icons/fa6";

const SignIn = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!username || !password) return;

    const defaultUsername = process.env.NEXT_PUBLIC_USERNAME;
    const defaultPassword = process.env.NEXT_PUBLIC_PASSWORD;

    if (username !== defaultUsername || password !== defaultPassword) {
      return error("Invalid credentials");
    }

    const hash = generareHash("admin");
    if (hash) {
      setUser(hash);
      sessionStorage.setItem("auth", hash);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="w-full">
      <div className="wrapper">
        <div className="flip-card__inner">
          <div className="flip-card__front">
            {/* <div className="title">Log in</div> */}
            <FaBuildingLock className="w-8 h-8" />
            <input
              className="flip-card__input"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="flip-card__input"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="flip-card__btn" onClick={handleSubmit}>
              Let`s go!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
