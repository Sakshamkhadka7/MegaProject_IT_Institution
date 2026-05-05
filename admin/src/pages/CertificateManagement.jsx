import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CertificateManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState(null);
  const [progressData, setProgressData] = useState({});

  const [showModal, setShowModal] = useState(false);

  const [selectedIds, setSelectedIds] = useState({
    studentId: "",
    courseId: "",
  });

  const [data, setData] = useState({
    title: "",
    descriptions: "",
    founderSign: "",
  });

  //  FIXED INPUT HANDLER
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { title, descriptions, founderSign } = data;

    if (!title) {
      toast.warning("Title is required");
      return false;
    }

    if (!descriptions) {
      toast.warning("Descriptions is required");
      return false;
    }

    if (!founderSign) {
      toast.warning("Foundersign is required");
      return false;
    }

    return true;
  };

  //  GET STUDENTS
  const getStudents = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/student/getStudents",
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (res.ok) {
        const result = await res.json();
        setStudents(result.data || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("No students founds");
    } finally {
      setLoading(false);
    }
  };

  //  GET PROGRESS
  const getProgress = async (studentId, courseId) => {
    try {
      let res = await fetch(
        `http://localhost:3001/api/v1/progress/getStudentProgress/${courseId}/${studentId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (res.ok) {
        res = await res.json();

        const key = `${studentId}-${courseId}`;

        setProgressData((prev) => ({
          ...prev,
          [key]: res.data,
        }));
      }
    } catch (error) {
      toast.error("error occured at getProgress");
      console.log(error);
    }
  };

  //  VIEW TOGGLE
  const handleView = (studentId, courseId) => {
    const key = `${studentId}-${courseId}`;

    if (active === key) {
      setActive(null);
    } else {
      setActive(key);
      getProgress(studentId, courseId);
    }
  };

  //  OPEN CERTIFICATE MODAL
  const openCertificates = (pro, studentId, courseId) => {
    if (!pro.score || pro.score < 90) {
      toast.warning("Student not eligible (score < 90)");
      return;
    }

    setSelectedIds({ studentId, courseId });
    setShowModal(true);
  };

  //  CREATE CERTIFICATE API
  const createCertificate = async () => {
    try {
      if (!validateForm()) return;

      const { studentId, courseId } = selectedIds;

      const res = await fetch(
        `http://localhost:3001/api/v1/certificate/createCertificate/${studentId}/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Certificate created successfully");

        setShowModal(false);

        setData({
          title: "",
          descriptions: "",
          founderSign: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured at certificate management");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Certificate Management</h1>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md md:ml-80">
            <h2 className="text-lg font-semibold mb-4">Create Certificate</h2>

            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              name="descriptions"
              value={data.descriptions}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              name="founderSign"
              value={data.founderSign}
              onChange={handleChange}
              placeholder="Signature URL"
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={createCertificate}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Create Certificate
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ STUDENTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold">{student.fullName}</h2>
            <p className="text-sm text-gray-500">{student.email}</p>

            <div className="mt-4 space-y-3">
              {student.enrolledCourses.map((course) => {
                const key = `${student._id}-${course._id}`;
                const progress = progressData[key];

                return (
                  <div key={course._id} className="border p-3 rounded">
                    <div className="flex justify-between">
                      <span>{course.title}</span>

                      <button
                        onClick={() => handleView(student._id, course._id)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        {active === key ? "Hide" : "View"}
                      </button>
                    </div>

                    {active === key && (
                      <div className="mt-2">
                        {progress ? (
                          progress.progress.map((pro, i) => (
                            <div key={i} className="mt-2">
                              <p className="text-sm">
                                Score: {pro.score ?? "N/A"}
                              </p>

                              <button
                                onClick={() =>
                                  openCertificates(pro, student._id, course._id)
                                }
                                className="mt-1 text-xs bg-green-600 text-white px-2 py-1 rounded"
                              >
                                Create Certificate
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">Loading...</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateManagement;
