export const getColorFromInitials = (initials: string) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-teal-200",
    "bg-orange-200",
    "bg-cyan-200",
    "bg-amber-200",
    "bg-lime-200",
    "bg-emerald-200",
    "bg-fuchsia-200",
    "bg-rose-200",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};
