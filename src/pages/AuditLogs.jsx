import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/audit");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      {logs.length === 0 && <p>No logs found.</p>}

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <p>
              <strong>User:</strong> {log.userId}
            </p>
            <p>
              <strong>Action:</strong> {log.action}
            </p>
            <p>
              <strong>Entity:</strong> {log.entityType}
            </p>
            <p>
              <strong>Date:</strong> {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
