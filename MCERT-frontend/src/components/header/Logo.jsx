import React from "react";
import { Link } from "react-router-dom";
import logoImg from "assets/img/layout/blue_gpt_2.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoImg} 
        alt="SIRIS" 
        className="h-8 w-auto"
      />
      <span className="text-2xl font-bold text-brand-500">SIRIS</span>
    </Link>
  );
};

export default Logo; 