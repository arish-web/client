import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Quiz({ quizId, setPage }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${quizId}`);
        setQuiz(res.data);

        const attemptsRes = await API.get(`/quiz/${quizId}/attempts`);
        setAttempts(attemptsRes.data);
      } catch (err) {
        console.error("Error loading quiz", err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  // 🔥 Handle answer selection
  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // 🔥 Submit quiz
  const submitQuiz = async () => {
    if (!quiz?.questions?.length) return;

    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`/quiz/${quizId}/attempt`, {
        answers,
      });

      setResult(res.data);
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 States
  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!quiz) return <p>Quiz not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>

      {/* Questions */}
      {quiz.questions?.map((q) => (
        <div key={q.id} className="mb-6 border p-4 rounded">
          <h3 className="font-semibold mb-3">{q.questionText}</h3>

          {q.options?.map((opt, index) => {
            const isSelected = answers[q.id] === opt;

            return (
              <label key={index} className="block p-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  disabled={!!result}
                  checked={isSelected}
                  onChange={() => handleSelect(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            );
          })}
        </div>
      ))}

      {/* Submit */}
      {!result && (
        <button
          onClick={submitQuiz}
          disabled={submitting}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      )}

      {/* Attempt History */}
      {attempts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-3">Previous Attempts</h3>

          <div className="space-y-2">
            {attempts.map((a) => (
              <div
                key={a.id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <p>
                  Score: <strong>{a.score}%</strong>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Score: {result.score}%</h3>
          <p>
            Correct: {result.correct} / {result.total}
          </p>

          <button
            onClick={() => setPage("courses")}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
}
