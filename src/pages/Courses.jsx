import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Courses({ role, setPage, setSelectedQuizId }) {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses?page=1&limit=10");
      setCourses(res.data.data || []);
    } catch {
      alert("Error loading courses");
    }
  };

  const createCourse = async () => {
    if (!title) return alert("Title required");

    try {
      await API.post("/courses", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchCourses();
    } catch {
      alert("Failed to create course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    console.log("Courses Data:", courses);
  }, [courses]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      {role === "INSTRUCTOR" && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Course
          </button>

          {showForm && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
              <input
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full mb-3"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full mb-3"
              />

              <button
                onClick={createCourse}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          )}
        </>
      )}

      {courses.length === 0 && <p>No courses found</p>}

      <div className="space-y-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            {c.modules?.map((m) => (
              <div key={m.id} className="mt-2">
                <h3 className="font-semibold">{m.title}</h3>

                {m.lessons?.map((lesson) => (
                  <div key={lesson.id} className="ml-6 mt-1">
                    <p>{lesson.title}</p>

                    {lesson.type === "QUIZ" &&
                      lesson.quiz &&
                      role === "STUDENT" && (
                        <button
                          onClick={() => {
                            setSelectedQuizId(lesson.quiz.id);
                            setPage("quiz");
                          }}
                          className="mt-1 bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Start Quiz
                        </button>
                      )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
