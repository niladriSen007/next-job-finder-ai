import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-gradient-to-b from-black to-blue-900">
      <h1 className="text-4xl md:text-7xl font-bold">404</h1>
      <p className="text-lg ">Looks like this page doesn&apos;t exist</p>
      <Link href="/" className="mt-4 rounded-full bg-white text-black tracking-normal font-medium w-fit px-4 py-2 " >Go to Home Page </Link>
    </div>
  )
}
export default NotFound