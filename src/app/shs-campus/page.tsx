'use client';
import Link from "next/link";
import { useTenantLink } from '@/hooks/useTenantLink';

export default function SHSCampusHome() {
  const addTenantParam = useTenantLink();
  
  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to SHS Campus</h1>
      <p className="mb-6 text-lg text-muted-foreground">Senior High School students can register, play games, and access SHS-level questions here.</p>
      <div className="flex flex-col gap-4 items-center">
        <Link href={addTenantParam('/shs-campus/register')}>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/80 transition">Register as SHS Student</button>
        </Link>
        <Link href={addTenantParam('/shs-campus/game')}>
          <button className="bg-secondary text-primary px-6 py-3 rounded-lg font-semibold shadow hover:bg-secondary/80 transition">Start SHS Game</button>
        </Link>
        <Link href={addTenantParam('/shs-campus/leaderboard')}>
          <button className="bg-muted text-primary px-6 py-3 rounded-lg font-semibold shadow hover:bg-muted/80 transition">View Leaderboard</button>
        </Link>
      </div>
    </div>
  );
}
