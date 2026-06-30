export default function StatCard({
  label,
  value,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  accent?: "blue" | "green" | "purple" | "red" | "zinc";
}) {
  const accents: Record<string, string> = {
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
    purple: "border-purple-500 text-purple-600",
    red: "border-red-500 text-red-600",
    zinc: "border-zinc-400 text-zinc-600",
  };
  return (
    <div className={`rounded-xl border-l-4 ${accents[accent]} bg-white shadow-sm p-4`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
