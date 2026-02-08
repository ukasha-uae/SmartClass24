'use client';
import { useTenantLink } from '@/hooks/useTenantLink';

const sampleLeaderboard = [
  { name: "Ama Mensah", school: "Accra SHS", score: 5 },
  { name: "Kwame Boateng", school: "Kumasi SHS", score: 4 },
  { name: "Akosua Owusu", school: "Tamale SHS", score: 3 }
];

export default function SHSLeaderboardPage() {
  const addTenantParam = useTenantLink();
  
  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">SHS Leaderboard</h2>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">School</th>
              <th className="py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {sampleLeaderboard.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 font-semibold">{entry.name}</td>
                <td className="py-2">{entry.school}</td>
                <td className="py-2 text-primary font-bold">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href={addTenantParam('/shs-campus')} className="text-primary underline mt-6">Back to SHS Campus</a>
    </div>
  );
}
