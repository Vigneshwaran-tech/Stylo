import { useState, type FormEvent } from 'react'

interface SignupProps {
  onSwitchToLogin?: () => void
  onAuthSuccess?: () => void
}

function Signup({ onSwitchToLogin, onAuthSuccess }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      console.error('Passwords do not match')
      return
    }
    // Placeholder for auth hook / API call
    console.log({ name, email, password })
    // Simulate successful signup
    onAuthSuccess?.()
  }

  const EyeIcon = ({ open }: { open: boolean }) => (
    open ? (
      <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden>
        <path d="M4 4l16 16" />
        <path d="M9.9 9.9a3 3 0 014.2 4.2" />
        <path d="M6.1 6.7C4.4 7.8 3 9.4 2 11.9c1.9 4.2 5.1 6.3 10 6.3 2.2 0 4-.5 5.5-1.4" />
        <path d="M14.6 14.6c-.4.3-.9.4-1.5.4-1.6 0-3-1.4-3-3 0-.6.1-1.1.4-1.5" />
        <path d="M12 5.8c4.9 0 8.1 2.1 10 6.3-.5 1.2-1.2 2.2-2.1 3" />
      </svg>
    ) : (
      <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden>
        <path d="M2 12c1.9-4.2 5.1-6.3 10-6.3s8.1 2.1 10 6.3c-1.9 4.2-5.1 6.3-10 6.3S3.9 16.2 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  )

  return (
    <div className="page">
      <main className="card" aria-label="Signup form">
        <div className="crest" aria-hidden />

        <div className="brand">
          <p className="brand-title">Create your account</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field" htmlFor="name">
            <span className="field-label">Full Name</span>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field" htmlFor="email">
            <span className="field-label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field" htmlFor="password">
            <span className="field-label">Password</span>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter the password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </label>

          <label className="field" htmlFor="confirm-password">
            <span className="field-label">Confirm Password</span>
            <div className="password-wrap">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter the password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </label>

          <button type="submit" className="submit">Sign Up</button>
        </form>

        <p className="footer">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin?.() }}>Login</a></p>
      </main>
    </div>
  )
}

export default Signup
