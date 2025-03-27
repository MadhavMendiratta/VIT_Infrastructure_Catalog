"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">VIT Vellore</span>
        </Link>
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/buildings" className="transition-colors hover:text-primary">
              Buildings
            </Link>
            <Link href="/navigation" className="transition-colors hover:text-primary">
              Navigation
            </Link>
          </nav>
          <div className="hidden md:flex ml-auto">
            <form action="/search" method="get" className="flex">
              <Input
                name="q"
                placeholder="Quick search..."
                className="w-[200px] bg-gray-900 border-gray-700 text-white mr-2"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="flex md:hidden ml-auto">
          <Button variant="ghost" className="h-9 w-9 p-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Toggle Menu</span>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-16 left-0 z-50 w-full p-4 bg-black border-b border-gray-800">
            <nav className="grid gap-2">
              <Link
                href="/"
                className="flex items-center py-2 text-lg font-semibold hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/buildings"
                className="flex items-center py-2 text-lg font-semibold hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Buildings
              </Link>
              <Link
                href="/navigation"
                className="flex items-center py-2 text-lg font-semibold hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Navigation
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

