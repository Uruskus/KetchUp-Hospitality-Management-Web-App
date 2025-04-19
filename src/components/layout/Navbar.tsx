import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">KetchUp</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/shifts" className="text-gray-600 hover:text-gray-900">
              Shifts
            </Link>
            <Link href="/inventory" className="text-gray-600 hover:text-gray-900">
              Inventory
            </Link>
            <Link href="/reports" className="text-gray-600 hover:text-gray-900">
              Reports
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
