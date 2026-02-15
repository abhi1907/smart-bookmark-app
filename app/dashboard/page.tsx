"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("id, title, url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setBookmarks(data || []);
  };

  // 🔐 1️⃣ Session check + initial fetch
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/";
        return;
      }

      setUserId(session.user.id);
      fetchBookmarks();
    };

    checkSession();
  }, []);

  // ⚡ 2️⃣ Realtime subscription
  useEffect(() => {
  if (!userId) return;

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        fetchBookmarks();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);

  // ➕ Add bookmark
  const addBookmark = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("User not logged in");
      return;
    }

    if (!title || !url) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    setTitle("");
    setUrl("");
  };

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">My Bookmarks</h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 mb-6"
      >
        Logout
      </button>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {bookmarks.map((b) => (
        <div key={b.id} className="flex justify-between border p-3 mb-2">
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {b.title}
          </a>
          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
