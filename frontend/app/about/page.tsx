import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">About Gevora</h1>

        <p className="text-lg text-gray-600">
          Gevora is a frontend learning project built using Next.js and Tailwind CSS.
          It demonstrates reusable components, routing, and responsive UI design.
        </p>
      </main>

      <Footer />
    </div>
  );
}