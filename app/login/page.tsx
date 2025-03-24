import AuthForm from "../components/Forms/AuthForm.tsx"


export default function LoginPage() {
  return (
    <div className="bg-gray-100 flex gap-12 flex-col items-center justify-center py-12 px-2">
      <h1 className="text-gray-950 text-3xl font-bold">Login Page</h1>
      <AuthForm />
    </div>
  )
}