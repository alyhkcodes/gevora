export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Gevora</h1>

      <div className="space-x-6">
        <a href="/" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        <a href="/login" className="hover:underline">Login</a>
      </div>
    </nav>
  );
}