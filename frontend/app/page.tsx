import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
  const cards = [
    {
      title: "Learn React",
      description: "Build interactive user interfaces with React.",
    },
    {
      title: "Next.js",
      description: "Create modern full-stack web applications.",
    },
    {
      title: "Tailwind CSS",
      description: "Design beautiful responsive layouts quickly.",
    },
    {
      title: "Gevora Project",
      description: "Frontend foundation for your internship submission.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <Hero />

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore Topics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}