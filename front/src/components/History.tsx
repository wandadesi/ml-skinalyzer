import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface RawDetection {
  label: string;
  confidence: number;
  bbox: number[];
}

interface RawResult {
  num_detections: number;
  detections: RawDetection[];
  image_with_box: string;
  timestamp?: { seconds: number } | string;
}

interface RawHistoryResponseItem {
  id: string;
  result: string; // <-- string JSON, perlu diparse
  timestamp?: { seconds: number } | string;
}

interface RawHistoryItem {
  result: RawResult;
  timestamp?: { seconds: number } | string;
}

interface HistoryItem {
  date: string;
  concern: string;
  image: React.ReactElement | string;
}

export default function History() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(false);

  const fetchData = async (sortDesc: boolean) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("🚫 No authenticated user found.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();

      let parsedRaw: RawHistoryResponseItem[] = [];

      try {
        parsedRaw = JSON.parse(text);
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON response:", parseErr);
        return;
      }

      // Convert stringified result to proper RawResult
      const rawData: RawHistoryItem[] = parsedRaw.map((item) => {
        let parsedResult: RawResult = {
          num_detections: 0,
          detections: [],
          image_with_box: "",
        };

        try {
          parsedResult = JSON.parse(item.result);
        } catch (err) {
          console.warn("⚠️ Failed to parse item.result:", item.result);
        }

        return {
          result: parsedResult,
          timestamp: item.timestamp,
        };
      });

      // Sort
      rawData.sort((a, b) => {
        const getTime = (ts: unknown) => {
          if (typeof ts === "string") return new Date(ts).getTime();
          if (typeof ts === "object" && ts && "seconds" in ts) {
            return (ts as { seconds: number }).seconds * 1000;
          }
          return 0;
        };

        const t1 = getTime(a.timestamp ?? a.result?.timestamp);
        const t2 = getTime(b.timestamp ?? b.result?.timestamp);
        return sortDesc ? t2 - t1 : t1 - t2;
      });

      // Map to displayable data
      const mapped: HistoryItem[] = rawData.map((item) => {
        const labels =
          item.result?.detections?.length > 0
            ? item.result.detections.map((d) => d.label).join(", ")
            : "No concern detected";

        const imageSrc = item.result?.image_with_box;
        const image =
          imageSrc && imageSrc.trim() !== "" ? (
            <img
              src={imageSrc}
              alt="Detection Result"
              className="h-16 w-16 object-cover rounded"
            />
          ) : (
            "No image"
          );

        const ts = item.timestamp ?? item.result?.timestamp;
        let dateString = "No date";
        if (typeof ts === "object" && ts !== null && "seconds" in ts) {
          dateString = new Date(ts.seconds * 1000).toLocaleString();
        } else if (typeof ts === "string") {
          dateString = new Date(ts).toLocaleString();
        }

        return {
          date: dateString,
          concern: labels,
          image,
        };
      });

      setData(mapped);
    } catch (error) {
      console.error("⚠️ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        fetchData(sortNewestFirst);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [sortNewestFirst]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="mb-4 text-[#7a422c]">
        <label className="mr-2 font-semibold text-white">Sort by:</label>
        <select
          value={sortNewestFirst ? "newest" : "oldest"}
          onChange={(e) => setSortNewestFirst(e.target.value === "newest")}
          className="px-2 py-1 rounded-md shadow-sm bg-white/20 border border-white"
        >
          <option value="oldest">Oldest first</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full table-auto text-sm text-left border-collapse bg-white">
          <thead className="bg-[#7a422c] text-white">
            <tr>
              <th className="px-4 py-2 rounded-tl-xl">Date</th>
              <th className="px-4 py-2">Concern</th>
              <th className="px-4 py-2 rounded-tr-xl">Image</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-[#7a422c]/20 transition"
              >
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.concern}</td>
                <td className="px-4 py-2">{item.image}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-4">📭 No history found.</p>
      )}
    </div>
  );
}
