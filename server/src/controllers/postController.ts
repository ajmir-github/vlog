import database from "../utils/database";
import { PrivateContext, PublicContext } from "../context";
import { ErrorResponse } from "../ErrorHandling";
import { inferContext } from "../utils/createContext";
import {
  validateCreatePost,
  validatePostParams,
  validateUpdatePost,
} from "../validators/postValidator";

const canMutate = async (
  context: inferContext<typeof PrivateContext> & { params: { postId: string } }
) => {
  if (context.isAdmin) return {};
  const post = await database.post.findUnique({
    where: { id: context.params.postId },
    select: {
      userId: true,
    },
  });
  if (!post) throw ErrorResponse.notFound("Post not found!");
  if (post.userId !== context.auth.id)
    throw ErrorResponse.unauthorized("You are not authorized!");
  return {};
};

// get
export const getPosts = PublicContext.resolve(async () => {
  return await database.post.findMany();
});

// create
export const createPost = PrivateContext.use(validateCreatePost).resolve(
  async (context, request) => {
    const post = await database.post.create({
      data: {
        ...context.body,
        userId: context.auth.id,
        video: "",
      },
    });
    return post;
  }
);

// update
export const updatePost = PrivateContext.use(validatePostParams)
  .use(canMutate)
  .use(validateUpdatePost)
  .resolve(async (context, request) => {
    await database.post.update({
      where: { id: context.params.postId },
      data: context.body,
    });
    return "Updated";
  });

// delete
export const deletePost = PrivateContext.use(validatePostParams)
  .use(canMutate)
  .resolve(async (context) => {
    await database.post.delete({ where: { id: context.params.postId } });
    return "Deleted!";
  });
