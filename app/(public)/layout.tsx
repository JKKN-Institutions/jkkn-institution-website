import Link from 'next/link';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header - Will be implemented in future tasks */}
      <header className='bg-white border-b border-gray-200'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='text-xl font-bold'>JKKN Institution</div>
            <nav className='flex items-center gap-6'>
              <Link href='/' className='text-gray-600 hover:text-gray-900'>
                Home
              </Link>
              <Link href='/about' className='text-gray-600 hover:text-gray-900'>
                About
              </Link>
              <Link href='/admin' className='text-gray-600 hover:text-gray-900'>
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer - Will be implemented in future tasks */}
      <footer className='bg-gray-900 text-white'>
        <div className='container mx-auto px-4 py-8'>
          <p className='text-center text-gray-400'>
            © {new Date().getFullYear()} JKKN Institution. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
