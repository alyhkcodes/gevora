import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        <p className="text-lg text-gray-600">
          Welcome to your dashboard. Here you can track your progress,
          view analytics, and manage your Gevora frontend project.
        </p>
      </main>

      <Footer />
    </div>
  );
}