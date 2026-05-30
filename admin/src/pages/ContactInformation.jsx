import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const ContactInformation = () => {
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
     
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/contact/getContact`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.warning(
          data.message ||
            "Failed to fetch contacts"
        );

        setContacts([]);

        return;
      }

      setContacts(data.data || []);

      console.log(data.data);
    } catch (error) {
      console.log(
        "Error fetching contacts",
        error
      );

      toast.warning(
        "Network error or server not responding"
      );

      setContacts([]);
    } finally {
    
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
   
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Contact Messages
      </h1>

     
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full text-left">
        
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Name</th>

              <th className="p-4">Email</th>

              <th className="p-4">Purpose</th>

              <th className="p-4">Message</th>
            </tr>
          </thead>

        
          <tbody>
            {contacts?.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  {item.name}
                </td>

                <td className="p-4 text-blue-600">
                  {item.email}
                </td>

                <td className="p-4">
                  {item.purpose}
                </td>

                <td className="p-4 text-gray-600 max-w-xs truncate">
                  {item.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactInformation;