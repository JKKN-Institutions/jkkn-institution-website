export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to JKKN Institution Website
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Empowering education and fostering excellence in academic and professional development.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">About Us</h3>
            <p className="text-gray-600">
              Learn about our mission, vision, and values.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Programs</h3>
            <p className="text-gray-600">
              Explore our diverse range of educational programs.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Contact</h3>
            <p className="text-gray-600">
              Get in touch with us for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
