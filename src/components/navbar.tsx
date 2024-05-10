import Link from "next/link"
import { auth } from "~/server/auth"

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="flex h-16 w-full shrink-0 items-center px-4 md:px-6">
      <Link className="mr-auto" href="#">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="flex justify-end space-x-6 text-sm font-medium md:space-x-10">
        <Link
          className="text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none disabled:pointer-events-none"
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
        >
          {session ? "Sign Out" : "Sign In"}
        </Link>
      </nav>
    </header>
  )
}


function MountainIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}