"use client"

import Link from 'next/link'; 
import "./styles.css"

export default function ContactUsPage() {
  return (<div className="contact-us-page">

    <h1>LET'S CONNECT</h1>
    <div className="extended-form">
      <div className="info-box">
        <div>
        <img src="/Graphic_Arrow_Black.png" style={{ height: "60px" }}></img>
        <h2>ATLATL <br/> ADVISERS</h2>
        </div>
        <div>
          <p>608-351-4500</p>
          <p>info@atlatladvisers.com</p>
        </div>
        <div>
          2921 Landmark Place Suite 501 <br /> Madison, WI 53711
        </div>
        <button>SCHEDULE A MEETING</button>
      </div>
      <div className="contact-form">
        <div>
          <div>
            First Name 
            <input></input>
          </div>
          <div>
            Last Name
            <input></input>
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        <button>SUBMIT</button>
      </div>
    </div>
    
    {/** The interactive Map */}
    <div></div>

    <h1>QUESTIONS?</h1>
    <Link href="/" className="faq">VIEW FAQ</Link>
  </div>);
}
