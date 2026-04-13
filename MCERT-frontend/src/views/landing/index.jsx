import React from "react";
import Header from "components/header/Header";
import backgroundImg from "assets/img/layout/background.png";

const Landing = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-lightPrimary dark:bg-navy-900"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <div
        className="flex min-h-screen w-full flex-col items-center pt-8"
        style={{ marginTop: "100px" }}
      >
        {/* Main Card */}
        <div className="mb-8 flex w-full justify-center">
          <div className="mx-4 mt-8 w-full max-w-4xl rounded-lg bg-white p-10 shadow-lg">
            <h3 className="mb-2 text-lg font-bold text-brand-700">
              WE ARE SIRIS
            </h3>
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Compliance today, for the <br />
              environment tomorrow
            </h1>
            <p className="mb-2 text-gray-700">
              At SIRIS we are a recognised provider of water discharge
              monitoring solutions, including effluent{" "}
              <span className="font-bold text-brand-700">
                flow sampling, effluent flow measurement
              </span>{" "}
              and{" "}
              <span className="font-bold text-brand-700">
                MCERTS inspections.
              </span>
            </p>
            <p className="mb-2 text-gray-700">
              Our solutions guarantee compliance and aftercare support. With
              over 30 years in the industry, we can save our customers time,
              money and wastage with reliable and robust effluent flow sampling
              and measurement solutions. Our MCERTS Inspections division offers
              an independent and trusted service, officially approved as a
              service provider to the CSA Group.
            </p>
            <p className="text-gray-700">
              We believe in helping our clients build a sustainable future and
              are focused on continuous development, investment and innovation
              in ourselves and our services.
            </p>
          </div>
        </div>

        {/* Products & Services Section */}
        <div className="flex w-full justify-center">
          <div className="mx-4 flex w-full max-w-7xl flex-col items-stretch gap-8 rounded-lg bg-white p-10 shadow-lg lg:flex-row">
            {/* Left: Text */}
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="mb-2 text-lg font-bold text-brand-700">
                WHAT WE DO
              </h3>
              <h1 className="mb-2 text-3xl font-bold leading-tight">
                Products &amp; Services
              </h1>
              <h2 className="mb-2 text-lg font-bold">
                MCERTS compliant solutions for water discharge flow sampling,
                measurement, analysis, service and calibration.
              </h2>
              <p className="text-gray-700">
                Our experienced team have the knowledge and know-how to specify
                and apply the correct flow and sampling solutions for your water
                discharge compliance requirements. We offer peace of mind that
                your system is providing accurate data, cost-effective results
                and the assurance of ongoing compliance and positive
                environmental impact.
              </p>
            </div>
            {/* Right: Icons */}
            <div className="grid flex-1 grid-cols-2 items-center gap-x-6 gap-y-8 self-center">
              <div className="flex items-center space-x-3">
                <svg
                  className="h-10 w-10 text-brand-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M8 10h8M8 14h6M9 18h6" />
                </svg>
                <span>Data Monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-10 w-10 text-brand-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 12c1.5-2 4.5-2 6 0s4.5 2 6 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Flow Metering</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-10 w-10 text-brand-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="3" width="4" height="18" rx="2" />
                  <rect x="14" y="3" width="4" height="18" rx="2" />
                </svg>
                <span>Samplers</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-10 w-10 text-brand-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 3" />
                </svg>
                <span>Service &amp; Calibration</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-10 w-10 text-brand-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                <span>Analysing Equipment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
