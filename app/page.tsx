import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">Bienvenido a Smartests</h1>

        <p className="text-lg mb-8 text-muted-foreground">
          Esta es la versión Beta de Smartests, una web app donde podrás crear y practicar tests basados en tu temario.
        </p>

        <Link
          href="/inicio"
          className="inline-flex h-12 items-center justify-center rounded-md bg-black px-8 text-base font-medium text-background shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Empezar
        </Link>
      </div>
    </div>
  )
}

