import { useState, useEffect } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import "../styles/pages/home.css"

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <div className="frame">
            <Header/>
            <div className="Title">
                Arena : Bot War
            </div>
            <div className="home-main">
                <button onClick={() => navigate("/trade")}>Entry Bot Trade Page</button>
            </div>
            <Footer/>
        </div>
    );
}
