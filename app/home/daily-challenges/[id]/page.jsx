"use client";
import { use, useState, useEffect } from 'react';
import axios from 'axios';
import Page from '@/app/home/daily-challenges/Addchallenges/Page';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { useEdgeStore } from '@/lib/edgestore';
import { useRouter } from 'next/navigation';

const AssignmentsPage = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [progress, setProgress] = useState({});
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [file, setFile] = useState(null);
  const [stid, setstid] = useState(null);
  const { id } = use(params);
  const { user } = useUser();

  const fetchAssignments = async () => {
    try {
      const ge = "add";
      const response = await axios.post(`/api/challenges`, { id: courseId, ge });
      setAssignments(response.data);
      console.log(response.data);
      const p = user.id;
      const idResponse = await axios.post('/api/user', { id: p });
      const fg = idResponse.data._id;
      setstid(idResponse.data);
      console.log(idResponse.data,"student");
    } catch (error) {
      console.log("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAssignments(); // Fetch assignments when the courseId is set
    }
  }, [courseId, user.id]); // Depend on courseId and user.id

  useEffect(() => {
    if (id) setCourseId(id);
  }, [id]);

  const isOpen = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    fetchAssignments();
  };

  const handleFileUpload = async (e, assignmentId) => {
    e.preventDefault();
    if (!file) return;

    setLoading((prev) => ({ ...prev, [assignmentId]: true }));

    try {
      let fileURL;
      if (file) {
        const uploadResponse = await edgestore.myProtectedFiles.upload({
          file,
          onProgressChange: (progressValue) => {
            setProgress((prev) => ({ ...prev, [assignmentId]: progressValue }));
          },
        });
        fileURL = uploadResponse.url;
      }

      const newFile = {
        id: assignmentId,
        fileName: file.name,
        fileURL,
        studentid: stid._id,
      };

      const ge = "addstu";
      await axios.post(`/api/challenges`, { ge, newFile });

      toast.success("Assignment submitted successfully!");
      // Fetch assignments again to reflect the latest state
      fetchAssignments();
    } catch (error) {
      console.log("Error uploading file:", error);
      toast.error("Failed to upload assignment.");
    } finally {
      setLoading((prev) => ({ ...prev, [assignmentId]: false }));
      setProgress((prev) => ({ ...prev, [assignmentId]: 0 }));
      setFile(null);
    }
  };

  const handleRemoveFile = async (assID) => {
    const ge = "removestu";
    try {
      
      await axios.post(`/api/challenges`, { ge, assID, stid:stid._id });
      toast.info("Assignment removed.");
      // Fetch assignments again to reflect the latest state
      fetchAssignments();
    } catch (error) {
      console.log("Error removing file:", error);
      toast.error("Failed to remove assignment.");
    }
  };
  const remass = async (ASSID) => {
   
    try {
      const ge = "remass";
      
      await axios.post(`/api/challenges`, { ge, ASSID});
      toast.info("Assignment removed.");
      // Fetch assignments again to reflect the latest state
      fetchAssignments();
    } catch (error) {
      console.log("Error removing file:", error);
      toast.error("Failed to remove assignment.");
    }
  };
  return (
    <div className="bg-gradient-to-b from-gray-600 to-gray-50 py-8 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {(stid && (stid?.prof==1)) ?
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-white-800">Challenges</h1>
          <button
            onClick={isOpen}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-150"
          >
            + Add New challenge
          </button>
        </div> : <h1 className="text-3xl mb-8 font-semibold text-white-800">Challenges</h1>}
      
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <h2 className="text-center text-lg font-medium text-white">
              No challenges available.
            </h2>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-gradient-to-br from-gray-600 to-gray-100 p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl text-white"
                style={{
                  background: 'radial-gradient(circle, rgba(156, 163, 175, 1) 20%, rgba(30, 40, 55, 1) 90%)',
                }}
              >
                <h2 className="text-2xl font-semibold text-white mb-2">{assignment.title}</h2>
                <p className="text-white mb-4">{assignment.description}</p>
                <p className="text-lg text-white mb-4">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>

                {assignment.assignmenturl && (
                  <a
                    href={assignment.assignmenturl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 bg-gray-900 rounded-md py-2 px-4 underline hover:text-blue-100 mb-4 inline-block transition-colors duration-150"
                  >
                    Download challenges
                  </a>
                )}
                
                {stid?.prof=== 1 ? (
                  <div className="flex space-x-4">
                  <button
                    onClick={() => router.push(`/home/Challenges/${assignment._id}/present`)} 
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white mt-4 py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-150"
                  >
                  View Student's Submitted challenges
                  </button>
                  <button
                     onClick={()=>remass(assignment._id)} 
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white mt-4 py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-150"
                  >
                  Remove challenges
                  </button>
                </div>
                ) : (
                  <>
                <div key={assignment._id} className="mt-4 space-y-2">
                  {assignment.uploads && assignment.uploads.length > 0 ? (
                    assignment.uploads.map((file) => {
                      if (file.studentId == stid?._id) {
                        return (
                          <div 
                            key={`${assignment._id}-${file.filename}`} // Ensure uniqueness
                            className="flex items-center justify-between bg-gray-800 p-3 rounded-md"
                          >
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-100 underline hover:text-blue-200"
                            >
                              {file.filename}
                            </a>
                            <button
                              onClick={() => handleRemoveFile(assignment._id)}
                              className="text-red-500 hover:text-red-600 transition-colors duration-150 ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      }
                      return null; // Return null if studentId doesn't match
                    })
                  ) : (
                    <p>No files uploaded.</p>
                  )}
                </div>
                {/* File upload form */}
                <form onSubmit={(e) => handleFileUpload(e, assignment._id)} className="mt-4">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    className="block w-full text-sm text-white border border-gray-300 rounded-lg p-2 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                  />
                  <div className="h-[6px] bg-white w-full border rounded overflow-hidden mb-2 mt-2">
                    <div
                      className="h-full bg-gray-900 transition-all duration-150"
                      style={{ width: `${progress[assignment._id] || 0}%` }}
                    ></div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    disabled={loading[assignment._id]} // Disable if this assignment is loading
                  >
                    {loading[assignment._id] ? "Uploading..." : "Upload challenges"}
                  </button>
                </form>
                </>
                )}
              </div>
            ))
          )}
        </div>

        {isModalOpen && <Page isOpen={isOpen} onClose={onClose} courseId={courseId} />}

      </div>
    </div>
  );
};

export default AssignmentsPage;
