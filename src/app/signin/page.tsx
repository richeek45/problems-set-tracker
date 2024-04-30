import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { signIn } from "~/server/auth";
 
export default function SignIn() {

  return (
    <Form>
      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <Button type="submit">Signin with GitHub</Button>
      </form>
    </Form>
  )
} 