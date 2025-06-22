import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function History() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(false); // toggle sorting

  const fetchData = async (sortDesc: boolean) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5000/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let rawData = await res.json();

    // Sorting
    rawData.sort((a: any, b: any) => {
      const t1 = a.timestamp?.seconds || new Date(a.timestamp).getTime() / 1000;
      const t2 = b.timestamp?.seconds || new Date(b.timestamp).getTime() / 1000;
      return sortDesc ? t2 - t1 : t1 - t2;
    });

    const mapped = rawData.map((item: any) => {
      const labels = item.result?.detections?.map((d: { label: string }) => d.label).join(", ") || "No concern detected";
      const image = item.result?.image_with_box || null;
      const timestamp = item.timestamp || item.result?.timestamp;

      let dateString = "No date";
      if (timestamp?.seconds) {
        dateString = new Date(timestamp.seconds * 1000).toLocaleString();
      } else if (typeof timestamp === "string") {
        dateString = new Date(timestamp).toLocaleString();
      }

      return {
        date: dateString,
        concern: labels,
        image: image ? (
          <img src={image} alt="BBox" className="h-16 w-16 object-cover rounded" />
        ) : (
          "No image"
        ),
      };
    });

    setData(mapped);
    setLoading(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(sortNewestFirst);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [sortNewestFirst]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="mb-4 text-[#7a422c] ">
        <label className="mr-2 font-semibold text-white!">Sort by:</label>
        <select
          value={sortNewestFirst ? "newest" : "oldest"}
          onChange={(e) => setSortNewestFirst(e.target.value === "newest")}
          className=" px-2 py-1 rounded-md shadow-sm bg-white/20 border border-white"
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
              <tr key={index} className="border-b hover:bg-[#7a422c]/20 transition">
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.concern}</td>
                <td className="px-4 py-2">{item.image}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
