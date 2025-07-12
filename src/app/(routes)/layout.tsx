const AuthLayout = ({children} : Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="bg-gradient-to-b from-black to-blue-900">
      {children}
    </div>
  )
}
export default AuthLayout