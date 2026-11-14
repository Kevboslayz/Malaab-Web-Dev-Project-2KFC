import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { seedUsers } from '../data/mockData'
import type { User } from '../data/mockData'

// Who is signed in. Every surface asks this context "who are you?" so the
// three viewer variants (owner, another user, signed out) come from one place.

type SignUpInput = { name: string; email: string; sports: string[]; password: string }

type AuthValue = {
  users: User[]
  currentUser: User | null
  signIn: (email: string, password: string) => boolean
  signUp: (input: SignUpInput) => User
  signOut: () => void
  emailTaken: (email: string) => boolean
}

const AuthContext = createContext<AuthValue | null>(null)

const normalise = (email: string) => email.trim().toLowerCase()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  function emailTaken(email: string) {
    return users.some((u) => u.email === normalise(email))
  }

  // Returns false on any mismatch. The caller never learns which half was
  // wrong — that would tell a stranger whether an address has an account.
  function signIn(email: string, password: string) {
    const user = users.find((u) => u.email === normalise(email))
    if (!user || user.password !== password) return false
    setCurrentUser(user)
    return true
  }

  function signUp({ name, email, sports, password }: SignUpInput) {
    const user: User = {
      id: `u${Date.now()}`,
      name: name.trim(),
      email: normalise(email),
      phone: '',
      preferredSports: sports,
      password,
    }
    setUsers((prev) => [...prev, user])
    setCurrentUser(user)
    return user
  }

  function signOut() {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ users, currentUser, signIn, signUp, signOut, emailTaken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
