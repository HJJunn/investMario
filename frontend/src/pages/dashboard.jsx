import { useState, useEffect } from "react";
import Header from "../components/common/Header"
import "../styles/pages/dashboard.css"

import Footer from "../components/common/Footer"

import { useNavigate } from "react-router-dom";

import Account from "../components/dashboard/Account"

import Prompt from "../components/dashboard/Prompt"
import Readme from "../components/dashboard/Readme"

export default function DashBoard() {
    const [select, setSelect] = useState("Account")

    const navigate = useNavigate();

    const menu = ["Account", "Prompt", "Readme"]     

    const goSelect = (menu) => {
        const search = new URLSearchParams(location.search); 
        search.set("select", menu.toLowerCase());         
        navigate(`/dashboard?${search.toString()}`, { replace: true });
    };

    useEffect(()=>
    {
        goSelect(select)
    },[select]);
    
    return (
        <div className="frame">
            <Header />
            <div className="dash-main">
                <div className="dash-main-left">
                    {menu.map((item, index)=>
                    (
                        <button 
                        className="menu"
                        key={item}
                        onClick={()=>setSelect(item)}>
                            {item}
                        </button>
                    ))}
                </div>
                <div className="dash-main-center">
                    {select === "Account" && <Account />}
                    {select === "Prompt" && <Prompt />}
                    {select === "Readme" && <Readme />}
                </div>
            </div>
            <Footer />
        </div>
        )
}
