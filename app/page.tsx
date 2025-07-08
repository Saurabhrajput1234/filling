import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Job Portal</h1>
      <p className="mb-8 text-lg text-gray-700">Find your dream job or the perfect candidate!</p>
      <nav className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/jobs" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center">Job Feed</Link>
        <Link href="/auth/login" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center">Login</Link>
        <Link href="/auth/register" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 text-center">Register</Link>
        <Link href="/company/dashboard" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-center">Company Dashboard</Link>
        <Link href="/seeker/dashboard" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 text-center">Seeker Dashboard</Link>
      </nav>
    </main>
  );
}
