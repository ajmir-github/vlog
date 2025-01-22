import { PrivateContext } from "../context";
import database from "../utils/database";
import onlyUniqueEmail from "../middlewares/onlyUniqueEmail";
import { updateSelfValidator } from "../validators/selfValidator";

export const getSelf = PrivateContext.resolve((context) => context.auth);

export const updateSelf = PrivateContext.use(updateSelfValidator)
  .use(onlyUniqueEmail)
  .resolve(async (context) => {
    const user = await database.user.update({
      where: { id: context.auth.id },
      data: context.body,
    });
    return { user };
  });

export const deleteSelf = PrivateContext.resolve(async (context) => {
  const userId = context.auth.id;
  // delete the users
  // const deleteComments = database.comment.deleteMany({where:{
  //   userId
  // }})
  // The transaction runs synchronously so deleteUsers must run last.
  // await database.$transaction([deleteProfile, deletePosts, deleteUsers])

  return "User deactivated!";
});
