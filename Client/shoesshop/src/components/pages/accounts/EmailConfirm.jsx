import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { AuthService } from "../../../services/authService"

export default function EmailConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token")
      const email = searchParams.get("email")

      if (!token || !email) {
        console.log("Invalid confirmation link")
        return
      }

      try {
        await AuthService.confirmEmail(token, email)
        navigate("/signin")

      } catch (error) {
        console.log("Error confirming email:", error.message)
      }
    }

    confirmEmail();
  }, [searchParams, navigate])

  return (
    <h1 style={{ textAlign: 'center'}}>Confirming your email...</h1>
  )
}
