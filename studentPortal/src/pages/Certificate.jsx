import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// const API = import.meta.env.VITE_API_URL;
 const API ="http://localhost:3001";



const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

const getCertificates = async () => {
  try {
    const res = await fetch(
      `${API}/api/v1/certificate/getCertificate`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json();

   
    if (res.ok) {
      setCertificates(data.data || []);
    }

    
    else {
      toast.warning(data.message || "Failed to fetch certificates");
    }
  } catch (error) {
    console.log("Error fetching certificates", error);

    toast.error("Server error while fetching certificates");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Certificates
        </h1>
        <p className="text-sm text-gray-500">
          View and download your earned certificates
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading certificates...
        </p>
      )}

      {/* Empty State */}
      {!loading && certificates.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No certificates found 🎓
        </p>
      )}

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            {/* Top */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {cert.title}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {cert.descriptions}
              </p>

              <div className="text-xs text-gray-400 space-y-1">
                <p>
                  <span className="font-medium text-gray-600">
                    Course:
                  </span>{" "}
                  {cert.courses?.title || "N/A"}
                </p>

                <p>
                  <span className="font-medium text-gray-600">
                    Issued:
                  </span>{" "}
                  {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center">
              
              {/* Download Button */}
              <button
                onClick={() =>
                  window.open(
                    `${API}/image/${cert._id}`,
                    "_blank"
                  )
                }
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Download
              </button>

              {/* Signature */}
              {cert.founderSign && (
                <img
                  src={cert.founderSign}
                  alt="signature"
                  className="h-8 object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;