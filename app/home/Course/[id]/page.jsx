"use client";
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '@/components/Loader';
import Page from '@/app/home/Course/Addassignment/Page';
import { toast } from 'react-toastify';
import Link from 'next/link';

const AssignmentsPage = ({ params }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [file, setFile] = useState(null);
  const { id } = use(params);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const ge="add"
        const response = await axios.post(`/api/assignment`,{id:courseId,ge});
        setAssignments(response.data.assignments);
      } catch (error) {
        console.log("Error fetching assignments:", error);
      }
    };
    if(courseId)fetchAssignments(); // Fetch assignments when component mounts
  }, [courseId]);

useEffect(()=>{
  if(id)setCourseId(id);
},[id])
  // Fetch assignments for the course


  // Open/Close Modal
  const isOpen = () => {
    setIsModalOpen(true);
  };
  
  const onClose = () => {
    setIsModalOpen(false);
  };

  // Handle file upload for student assignment submission
  const handleFileUpload = async (e, assignmentId) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    
    try {
      await axios.post(`/api/assignments/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Assignment submitted successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload assignment.");
    }
  };

  return (
    <>
      <button onClick={isOpen} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-6">
        Add New Assignment
      </button>

      {/* Display assignments */}
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {(assignments==undefined || assignments.length === 0) ? (
        <h1 className='text-3xl font-bold text-center mb-9 text-gray-800'>No Assignments Available :)</h1>
      ) :  (
        assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{assignment.title}</h2>
            <p className="text-gray-600 mb-4">{assignment.description}</p>
            <p className="text-gray-500 mb-4">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>

            {assignment.fileUrl && (
              <a
                href={assignment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mb-4 inline-block"
              >
                Download Assignment
              </a>
            )}

            {/* File upload form */}
            <form onSubmit={(e) => handleFileUpload(e, assignment._id)} className="mt-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150"
              >
                Upload Assignment
              </button>
            </form>
          </div>
        ))
        )};
      </div>

      {/* Modal for Adding New Assignment */}
      {isModalOpen && (
        <Page isOpen={isOpen} onClose={onClose} courseId={courseId} />
      )}
    </>
  );
};

export default AssignmentsPage;
