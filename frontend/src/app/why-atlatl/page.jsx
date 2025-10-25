"use client";
import "./page.css";
import Image from "next/image";

export default function WhyAtlatlPage() {
    return (
        <main className="why-atlatl">

            <section className="intro-section">
                <h1 className="title">WHY ATLATL</h1>

                <div className="definition-row">
                    <div className="definition">
                        <p className="phonetic">
                            AT· LATL<br />/ˈAT ˌ LAD( ə )L<br />NOUN
                        </p>
                        <p className="description">
                            A tool that uses leverage to propel an arrow towards its intended target with greater accuracy, velocity, and power.
                        </p>
                    </div>

                    <div className="logo-container">
                        <Image
                            src="/logo.svg"
                            alt="Atlatl Mark"
                            width={300}
                            height={300}
                            className="logo"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="video-section">
                <video
                    className="baby-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    src="/baby-swing.mp4"
                />
            </section>

            <section className="cta-section">
                <div className="cta-text">
                    <h2>READY TO TAKE THE NEXT STEP TOWARD YOUR FINANCIAL FUTURE?</h2>
                    <p>LET’S BUILD YOUR PLAN TOGETHER.</p>
                </div>
            </section>

            <section className="info-section">
                <div className="info-image">
                    <Image
                        src="/AtlatlTool.png"
                        alt="Atlatl Tool"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        Our name is unique and chosen with intent because it offers a lot of parallels to how we view our team in relation to the clients we serve. In the digital age of information, it can be overwhelming and challenging to craft a path on one’s own without guidance that is tailored to address specific needs. Atlatl Advisers is a team of professionals that can serve as a tool to help shape a path for individuals, families and businesses to achieve their goals, much like an atlatl was a tool that revolutionized hunting for people thousands of years ago.
                    </p>
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        The name offers not only a nice metaphor for how we view ourselves as a resource, but it also has a personal family connection. A beloved relative of one of our employees was a skilled artisan by hobby and crafted wooden atlatls and other items, some of which can be found in our office. Upon his passing, and as the firm was expanding, it felt only appropriate to pay homage to this special person.                     
                    </p>
                </div>

                <div className="info-image">
                    <Image
                        src="/images/placeholder-vertical.png"
                        alt="Placeholder"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-image">
                    <Image
                        src="/trio.png"
                        alt="Trio"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="info-box">
                    <h2>HEADER TEXT</h2>
                    <p>
                        Perhaps it is unsurprising that family and relationships are at the center of our business. We’ve built up a group that includes some of our own family members, and also those who have come to be seen as family.  Our team is composed of individuals who bring different perspectives from their personal and professional histories to create an approach to wealth management that goes beyond the numbers. We strive for a balance that allows our employees to spend time with family and to pursue their passions, so that they come to work every day feeling fulfilled and ready to help clients achieve a level of success as they define it.                    
                    </p>
                </div>
            </section>

        </main>
    );
}
