const Logo = () => (
  <div className="flex items-center ml-0 space-x-2">
    {/* Circular image */}
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img
        src="/school_logo.jpeg"
        alt="School Logo"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Logo text */}
    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
      South West Academy
    </h2>
  </div>
);

export default Logo;