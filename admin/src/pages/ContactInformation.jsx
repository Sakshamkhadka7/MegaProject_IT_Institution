import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;


const ContactInformation = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/contact/getContact`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();

      setContacts(data.data || []);
      console.log(data.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching contacts", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Contact Messages
      </h1>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="w-full text-left">
            {/* TABLE HEAD */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Message</th>
                
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {contacts?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{item.name}</td>

                  <td className="p-4 text-blue-600">{item.email}</td>

                  <td className="p-4">{item.purpose}</td>

                  <td className="p-4 text-gray-600 max-w-xs truncate">
                    {item.message}
                  </td>

                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactInformation;
