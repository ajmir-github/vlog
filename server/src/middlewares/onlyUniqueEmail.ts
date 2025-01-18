import { ErrorResponse } from "../ErrorHandling";
import database from "../utils/database";

export default async function onlyUniqueEmail<
  Context extends { body: { email?: string } }
>({ body: { email } }: Context) {
  if (!email) return;
  const emailAlreadyInUse = await database.user.findUnique({
    where: { email },
  });
  if (emailAlreadyInUse)
    throw ErrorResponse.customBadInput(
      "email",
      "This email is already in use!"
    );
}
