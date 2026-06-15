export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto text-center">
        <p>© {new Date().getFullYear()} Gevora. All rights reserved.</p>
      </div>
    </footer>
  );
}