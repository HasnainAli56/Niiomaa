import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000B1A] text-white">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <Link href="/" className="mt-4 px-5 py-2 bg-purple-600 rounded-full text-sm font-medium hover:bg-purple-700 transition">
        Return Home
      </Link>
    </div>
  );
}
