import { Button } from "~/components/ui/button";
import { signOut } from "~/server/auth";

export default function Signout() {

  return (
    <div>
      <form action={async () => {
        "use server"
        await signOut({ redirectTo: "/" })
      }}>
        <Button size="sm" >Sign Out</Button>
      </form>
    </div>
  )
}