"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHSSchools } from "@/lib/shs-schools";
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSRegisterPage() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [level, setLevel] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const router = useRouter();
  const addTenantParam = useTenantLink();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Save profile info (replace with real backend integration)
    localStorage.setItem("shsProfile", JSON.stringify({ name, school, level, parentPhone }));
    router.push(addTenantParam("/shs-campus/game"));
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">SHS Registration</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border rounded px-4 py-2"
        />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Search School Name"
            value={schoolSearch}
            onChange={e => setSchoolSearch(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <select
            value={school}
            onChange={e => setSchool(e.target.value)}
            required
            className="border rounded px-4 py-2"
          >
            <option value="">Select School</option>
            {SHSSchools.filter(s => s.toLowerCase().includes(schoolSearch.toLowerCase())).map(schoolName => (
              <option key={schoolName} value={schoolName}>{schoolName}</option>
            ))}
          </select>
        </div>
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          required
          className="border rounded px-4 py-2"
        >
          <option value="">Select Level</option>
          <option value="SHS 1">SHS 1</option>
          <option value="SHS 2">SHS 2</option>
          <option value="SHS 3">SHS 3</option>
        </select>
        <input
          type="tel"
          placeholder="Parent Phone Number"
          value={parentPhone}
          onChange={e => setParentPhone(e.target.value)}
          required
          className="border rounded px-4 py-2"
        />
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary/80 transition">Register & Start Game</button>
      </form>
    </div>
  );
}
