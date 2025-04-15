'use client';

// import homepageImage from '/public/A_website_homepage_for_a_school_features_a_high-re.png';

export default function HomePage() {
  return (
    <div className="relative bg-cover bg-center h-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-center text-white px-6 sm:px-12 lg:px-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our School</h1>
          <p className="text-lg sm:text-xl mb-6">
            We are committed to providing a nurturing environment where students can thrive academically and personally.
          </p>
        </div>
      </div>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        <p>&copy; 2024 All rights reserved.</p>
      </footer>
    </div>
  );
}
